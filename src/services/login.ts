import request from '@/utils/request';
import qs from 'qs';

export interface LoginParamsType {
  user_name: string;
  user_pwd: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(params),
  });
}



export async function getEmailCaptcha(email: string) {
  return request(`/api/user/login/emailCaptcha?email=${email}`,{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}

