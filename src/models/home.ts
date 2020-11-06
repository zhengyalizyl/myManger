
import { Effect, Reducer } from 'umi';

import { getHomeList, addFetchHome} from '@/services/home';

export interface HomeType {
   // 登录用户数
   login_user:string,
   // 新增注册数
   new_register: string,
   // 课程新增学员
   new_stu_course: string,
   // 班级新增学员
   new_stu_classes:string,
   // 新增会员
   new_member: string,
   // 未回复问答
   not_reply:string,
   // 订单统计
   order_counter: {
       "web": string,
       "java":string,
       "python": string,
       "bigdata": string,
       "ui":string
   },
}

export interface HomeModelState {
  homeList?:  HomeType;
}

export interface HomeModelType {
  namespace: 'home';
  state: HomeModelState;
  effects: {
    fetchHomeList: Effect;
    fetchAddHome: Effect;
  };
  reducers: {
    saveHome: Reducer<HomeModelState>;
    addHome: Reducer<HomeModelState>;
  };
}

const HomeModel: HomeModelType = {
  namespace: 'home',

  state: {
    homeList:{}
  },

  effects: {
    *fetchHomeList(_, { call, put }) {
      const response = yield call(getHomeList);
      console.log(response,'请求回来的数据')
      yield put({
        type: 'saveHome',
        payload: response.result,
      });
    },
    *fetchAddHome(_, { call, put }) {
      const response = yield call(addFetchHome);
      yield put({
        type: 'addHome',
        payload: response.result||{},
      });
    },
  },

  reducers: {
    saveHome(state, action) {
      return {
        ...state,
        homeList:action.payload,
      };
    },
    addHome(
      state = {
        homeList: {},
      },
      action,
    ) {
      return {
        ...state,
        homeList: {
          ...state.homeList,
        },
      };
    },
  },
};

export default HomeModel;
