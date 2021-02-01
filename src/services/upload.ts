import request from '@/utils/request';
import qs from 'qs';

export async function postUpload(params: FormData) {
  return request('/api/uploadfile',{
    method: 'POST',
    data: params,
  });
}
export async function postMergeUpload(params: FormData) {
  return request('/api/mergeUploadfile',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: qs.stringify(params),
  });
}


