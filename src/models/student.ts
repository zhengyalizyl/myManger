
import { Effect, Reducer } from 'umi';

import {  getStudentList, getStudentCount} from '@/services/student';

export interface StudentType {
  user_name: string,
  reg_account: string,
  user_age: string,
  user_sex: string,
  area: string,
  points: string,
  reg_time: Date,
  last_login_time:Date,
  phone: string,
}

export interface  StudentModelState {
  studentList:  [StudentType];
  studentCount: number
}

export interface StudentModelType {
  namespace: 'Student';
  state: StudentModelState;
  effects: {
    fetchStudentList: Effect;
    fetchAddStudent: Effect;
  };
  reducers: {
    saveStudent: Reducer<StudentModelState>;
    addStudent: Reducer<StudentModelState>;
  };
}

const StudentModel: StudentModelType = {
  namespace: 'student',

  state: {
    studentCount:0,
    studentList:{}
  },

  effects: {
    *fetchStudentList({payload}, { call, put }) {
      const response = yield call(getStudentList,payload);
      yield put({
        type: 'saveStudent',
        payload: response.result,
      });
    },
    *fetchStudentCount(_, { call, put }) {
      const response = yield call(getStudentCount);
      if(response.successfull){
        yield put({
          type: 'studentCount',
          payload: response.result,
        });
        const {payload,callback}=_;
        if(callback){
          callback(response.result)
        }
      }
    },
  },

  reducers: {
    saveStudent(state, action) {
      return {
        ...state,
        studentList:action.payload,
      };
    },
    studentCount(state,action) {
      return {
        ...state,
        studentCount:action.payload
      };
    },
  },
};

export default StudentModel;
