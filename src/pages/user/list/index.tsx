import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input } from 'antd';
import UserSelcect from '../../../components/User/Select';
import { history,withRouter } from 'umi';
import styles from './index.less';
import { Link, connect, Dispatch } from 'umi';
import { ConnectState } from "../../../models/connect";
import { StudentModelType } from "../../../models/student";

interface UserListProps {
  dispatch:Dispatch,
  student:StudentModelType
}

const columns = [
  {
    title: '编号',
    dataIndex: 'No',
  },
  {
    title: '注册账号',
    dataIndex: 'regAccount',
  },
  {
    title: '昵称',
    dataIndex: 'userNick',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '性别',
    dataIndex: 'sex',
  },
  {
    title: '地区',
    dataIndex: 'region',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
  },
  {
    title: '积分',
    dataIndex: 'point',
  },
  {
    title: '注册时间',
    dataIndex: 'registerTime',
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
  },
  {
    title: '操作时间',
    dataIndex: 'operation',
    render: () => (
      <>
      <Button type='primary'  style={{backgroundColor:'#5bc0de',borderColor:'#46b8da',marginRight:10}}  onClick={()=>{
       history.push({
         pathname: '/user/center',
         query:{
           id:1
         }
       })
      }}>查看</Button>
        <Button type='primary'  style={{backgroundColor:'#f0ad4e',borderColor:'#eea236'}}>锁定</Button>
      </>
    ),
  },
];



const { Search } = Input;
const UserList: React.FC<UserListProps> = (props) => {
  const {dispatch,student}=props;
  const [loading, setLoading] = useState(true);
  const [page,setPage]=useState(1);
  const [pageSize,setPageSize]=useState(5);
  const data :any= [];
  const {studentCount,studentList}=student;
  for (let i = 0; i < studentList.length; i++) {
    data.push({
      key: i,
      No: (page-1)*pageSize + 1+i,
      regAccount: studentList[i].reg_account,
      userNick: studentList[i].user_name,
      age: studentList[i].user_age,
      sex: studentList[i].user_sex,
      region: studentList[i].area,
      phone: studentList[i].phone,
      point:studentList[i].points,
      registerTime: (new Date(studentList[i].reg_time)).toLocaleString(),
      loginTime:(new Date(studentList[i].last_login_time)).toLocaleString(),
    });
  }

  useEffect(() => {
   setLoading(true)
    dispatch({
      type:'student/fetchStudentCount',
      callback:(count:number)=>{
       dispatch({
         type:'student/fetchStudentList',
         payload:{
           page,
           pageSize
         }
       }).then(()=>{
         setLoading(false)
       })
      }
    })
  }, []);
  return (
    <PageHeaderWrapper>
      <div className={`${styles.flex} ${styles.margin40}`}>
        <div className={styles.flex}>
          <UserSelcect defaultValue="按年龄" />
          <UserSelcect defaultValue="按性别" />
          <UserSelcect defaultValue="按地区" />
          <UserSelcect defaultValue="按日期" />
          <Button type="primary" danger>筛选</Button>
        </div>
        <div>
          <Search
            placeholder="input search text"
            enterButton="搜索"
            onSearch={(value) => console.log(value)}
          />
        </div>
      </div>
      <Table columns={columns} dataSource={data} bordered loading={loading} />
    </PageHeaderWrapper>
  );
};

export default connect(({student}: ConnectState)=>{
  return {
    student
  }
   
})(UserList);
