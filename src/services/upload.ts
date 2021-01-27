import request from '@/utils/request';

export async function postUpload(params: FormData) {
  return request('/api/uploadfile',{
    method: 'POST',
    data: params,
  });
}
export async function postMergeUpload(params: FormData) {
  return request('mergeUploadfile',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: params,
  });
}


