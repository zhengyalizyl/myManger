import request from '@/utils/request';



export async function getHomeList() {
  return request('/api/home/list',{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}

export async function addFetchHome() {
  return request(`/api/home/add`,{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}
