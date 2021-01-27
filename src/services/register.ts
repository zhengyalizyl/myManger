import request from '@/utils/request';
import qs from 'qs';

export interface RegisterParamsType {
  user_name: string;
  user_pwd: string;
}

export async function fakeAccountRegister(params: RegisterParamsType) {
  return request('/api/user/Register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(params),
  });
}

export async function getCaptcha(mobile: string) {
  return request(`/api/Register/captcha?mobile=${mobile}`,{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}
