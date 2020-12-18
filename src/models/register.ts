import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountRegister } from '@/services/register';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface registerStateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface registerModelType {
  namespace: string;
  state: registerStateType;
  effects: {
    register: Effect;
    logout: Effect;
  };
  reducers: {
    changeregisterStatus: Reducer<registerStateType>;
  };
}

const Model: registerModelType = {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(fakeAccountregister, payload);
      yield put({
        type: 'changeregisterStatus',
        payload: response,
      });
      // register successfully
      if (response.status_code === 200) {
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
    },

    *logout(a,{put}) {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/register' && !redirect) {
        history.replace({
          pathname: '/register',
          search: stringify({
            redirect: window.location.href,
          }),
        });
          yield put({
            type:'changeregisterOut'
          })
      }else if(window.location.pathname.includes('/register')){
        history.replace({
          pathname: '/register',
        });
        yield put({
          type:'changeregisterOut'
        })
      }
    },
  },

  reducers: {
    changeregisterOut(state){
      localStorage.removeItem('zylManagerToken')
      return {
        ...state,
        status: undefined,
      }
    },
    changeregisterStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);

      return {
        ...state,
        status: payload.successfull?'ok':'error',
      };
    },
  },
};

export default Model;
