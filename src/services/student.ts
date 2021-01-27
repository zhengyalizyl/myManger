import request from '@/utils/request';

export interface StudentParamsType {
  page?: number;
  pageSize: Number;
}

export async function getStudentList(params: StudentParamsType) {
  const {page,pageSize}=params;
  return request(`/api/stu/list?page=${page}&pageSize=${pageSize}`,{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}
  
export async function getStudentCount() {
  return request(`/api/stu/count`,{
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
}
