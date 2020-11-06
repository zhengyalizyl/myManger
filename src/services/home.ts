import request from '@/utils/request';



export async function getHomeList() {
  return request('/api/home/list');
}

export async function addFetchHome() {
  return request(`/api/home/add`);
}
