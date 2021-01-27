import request from '@/utils/request';
import qs from 'qs';

export interface LoginParamsType {
  user_name: string;
  user_pwd: string;
}

export async function query(): Promise<any> {
  return request('/api/users',{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}

export async function queryCurrent(): Promise<any> {
  return request('/api/user/info',{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}
export async function editCurrent(params: LoginParamsType): Promise<any> {
  return request('/api/user/edit',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(params),
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
