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

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
