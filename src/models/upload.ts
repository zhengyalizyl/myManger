import { Effect, Reducer } from 'umi';

import { postUpload,postMergeUpload } from '@/services/upload';

export interface CurrentUpload {
    name:string,
    hash:string,
    chunk:File
}

export interface UploadModelState {
  currentUpload?: CurrentUpload;
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
    currentUpload: {},
  },

  effects: {
    *fetchCurrent({payload}, { call, put }) {
      const response = yield call(postUpload,payload.form);
      yield put({
        type: 'saveCurrentUpload',
        payload: response.result||{},
      });
    },
    *mergeUploadfile({payload}, { call, put }) {
      const response = yield call(postMergeUpload,payload.aa);
      yield put({
        type: 'saveCurrentUpload',
        payload: response.result||{},
      });
    },
  },

  reducers: {
    saveCurrentUpload(state, action) {
      return {
        ...state,
        currentUpload:action.payload,
      };
    },
  }
   
};

export default UploadModel;
