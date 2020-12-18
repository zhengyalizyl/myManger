import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin,getCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  errorMsg?:string;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  captchaCode?:''
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status_code === 200&&response.successfull) {
        const urlParams = new URL(window.location.href);
        const token=response.result.token;
        window.localStorage.setItem('zylManagerToken',token)
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
      else if(response.status_code === 200&&!response.successfull){
        window.location.href = '/login';
      }
    },

    *logout(a,{put}) {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
          // yield put({
          //   type:'changeloginOut'
          // })
      }
      else if(window.location.pathname.includes('/login')){
        history.replace({
          pathname: '/login',
        });
        yield put({
          type:'changeloginOut'
        })
      }
    },
  },

  reducers: {
    changeloginOut(state){
      localStorage.removeItem('zylManagerToken')
      return {
        ...state,
        status: undefined,
      }
    },
    changeLoginStatus(state, { payload }) {
      let currentAuthority='user';
      const {successfull,result,status_code,user_role}=payload;
      if(successfull&&status_code===200){
        currentAuthority=user_role===1?'user':'admin'
      }
      setAuthority(currentAuthority);

      return {
        ...state,
        status: payload.successfull?'ok':'error',
        currentAuthority:currentAuthority,
        errorMsg:payload.successfull?'':payload.result
      };
    },
  },
};

export default Model;
