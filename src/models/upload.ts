import { Effect, Reducer } from 'umi';
import { notification } from 'antd';
import { postUpload, postMergeUpload, fetchFile } from '@/services/upload';
import { CHUNK_SIZE } from '@/pages/upload/checkImg';

const mergeRequest = (chunks: any[], limit = 4, errorLimit = 3) => {
  const len = chunks.length;
  let count = 0;
  let isStop = false;
  return new Promise((resolve, reject) => {
    // 一个切片task重试失败三次，整体全部终止
    const start = async () => {
      if (isStop) {
        return;
      }
      const task = chunks.shift();
      if (task) {
        const { form } = task;
        try {
         const  res= await postUpload(form);
         if(res.status_code!==200){
          if (task.error < errorLimit) {
            task.error += 1;
            chunks.unshift(task);
            start();
          } else {
            isStop = true;
            reject();
          }
         }else if (count === len - 1) {
            resolve({res});
          } else {
            count += 1;
            start();
          }
         
        } catch (error) {
          if (task.error < errorLimit) {
            task.error += 1;
            chunks.unshift(task);
            start();
          } else {
            isStop = true;
            reject();
          }
        }
      }
    };

    while (limit > 0) {
      setTimeout(() => {
        start();
      }, 200);
      limit -= 1;
    }
  });
};

const uploadLogic = (newChunks: any[], hash: File) => {
  const newForm = [];

  for (let index = 0; index < newChunks.length; index += 1) {
    const form = new FormData();
    const name = `${hash}-${index}`;
    const chunk = newChunks[index].file;
    form.append('name', name);
    form.append('hash', hash);
    form.append('chunk', chunk);
    newForm.push({
      form,
      index,
      error: 0,
    });
  }
  return newForm;
};

export interface CurrentUpload {
  uploadUrl: string;
}

export interface UploadModelState {
  currentUpload?: CurrentUpload;
  status: undefined;
}

export interface UploadModelType {
  namespace: 'upload';
  state: UploadModelState;
  effects: {
    fetchCurrent: Effect;
    mergeUploadfile: Effect;
  };
  reducers: {
    saveCurrentUpload: Reducer<UploadModelState>;
  };
}

const UploadModel: UploadModelType = {
  namespace: 'upload',

  state: {
    status: 'ok',
    currentUpload: {},
  },

  effects: {
    // *fetchCurrent({payload}, { call, put }) {
    //   const response = yield call(postUpload,payload.form);
    //   yield put({
    //     type: 'saveCurrentUpload',
    //     payload: response.result||{},
    //   });
    // },

    *checkFile({ payload }, { call, put }) {
      // 这里要发生并发请求后端
      const { hash, chunks, fileUrl } = payload;
      const response = yield call(fetchFile, {
        hash,
        ext: fileUrl.name.split('.').pop(),
      });
      const { successfull, result } = response;
      const { isExist } = result;
      if (isExist) {
        notification.success({
          message: '秒传成功',
        });
      } else {
        yield put({
          type: 'fetchCurrent',
          payload: {
            hash,
            chunks,
            fileUrl,
          },
        });
      }
    },
    *fetchCurrent({ payload }, { call, put, take }) {
      // 这里要发生并发请求后端
      const { hash, chunks, fileUrl } = payload;
      const errorLimit = 3;
      const limit = 3;
      const forms = uploadLogic(chunks, hash);
      try {
        yield call(mergeRequest, forms, limit, errorLimit);
        yield put({
          type: 'mergeUploadfile',
          payload: {
            hash,
            ext: fileUrl.name.split('.').pop(),
            size: CHUNK_SIZE,
          },
        });
        yield take('mergeUploadfile/@@end');
      } catch (error) {
        yield put({
          type: 'saveCurrentUpload',
          payload: {
            successfull: false,
          },
        });
      }
    },
    *mergeUploadfile({ payload }, { call, put }) {
      const response = yield call(postMergeUpload, payload);
      yield put({
        type: 'saveCurrentUpload',
        payload: response || {},
      });
    },
  },

  reducers: {
    saveCurrentUpload(state, action) {
      const { payload } = action;
      const { successfull, result } = payload;
      if (successfull) {
        notification.success({
          message: '上传成功',
        });
      } else {
        notification.error({
          message: '上传失败',
        });
      }

      return {
        ...state,
        status: successfull ? 'ok' : 'error',
        currentUpload: {
          uploadUrl: successfull ? decodeURIComponent(result) : '',
        },
      };
    },
  },
};

export default UploadModel;
