import { Effect, Reducer } from 'umi';
import { notification } from 'antd';
import { postUpload, postMergeUpload } from '@/services/upload';
import { CHUNK_SIZE } from '@/pages/upload/checkImg';


const uploadLogic = (newChunks: any[], hash: File,limit=4,errorLimit=3) => {
  const newForm = [];

  for (let index = 0; index < newChunks.length; index += 1) {
    const form = new FormData();
    const name = `${hash}-${index}`;
    const chunk = newChunks[index].file;
    form.append('name', name);
    form.append('hash', hash);
    form.append('chunk', chunk);
    newForm.push(form);
  }
  return newForm;
};

export interface CurrentUpload {
  uploadUrl:string
}

export interface UploadModelState {
  currentUpload?: CurrentUpload;
  status: undefined
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
    status:'ok',
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
    *fetchCurrent({ payload }, { call, put, take }) {
      // 这里要发生并发请求后端
      const { hash, chunks, fileUrl } = payload;
      const errorLimit=3;
      const limit=3;
      const forms = uploadLogic(chunks, hash,limit,errorLimit);

      // 要全部同时请求
      const requests = forms.map((item) => call(postUpload, item));
      const response = yield requests;
      const responseAllSuccessful = response.every((item: any) => item.successfull);
      if (responseAllSuccessful) {
        yield put({
          type: 'mergeUploadfile',
          payload: {
            hash, 
            ext: fileUrl.name.split('.').pop(),
            size: CHUNK_SIZE
            },
        });
        yield take('mergeUploadfile/@@end');
      }else {
        yield put({
          type: 'saveCurrentUpload',
          payload: {
            successfull:false
          },
        });
      }
    },
    *mergeUploadfile({ payload }, { call, put }) {
      const response = yield call(postMergeUpload, payload);
      yield put({
        type: 'saveCurrentUpload',
        payload: response|| {},
      });
    },
  },

  reducers: {
    saveCurrentUpload(state, action) {
      const {payload}=action;
      const {successfull,result}=payload;
      if(successfull){
       notification.success({
          message: '上传成功',
        }
        );
      }else{
      notification.error({
        message: '上传失败',
      }
     )
      }
 
      return {
        ...state,
        status:successfull?'ok':'error',
        currentUpload:{
          uploadUrl:successfull?decodeURIComponent(result):'',
        },

      };
    },
  },
};



export default UploadModel;
