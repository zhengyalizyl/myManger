import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input, Divider,Modal } from 'antd';
import { history,withRouter } from 'umi';
import styles from './index.less';

interface DocentListProps {}

const columns = [
  {
    title: '编号',
    dataIndex: 'No',
  },
  {
    title: '姓名',
    dataIndex: 'user_name',
  },
  {
    title: '昵称',
    dataIndex: 'nick_name',
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
    title: '手机号码',
    dataIndex: 'phone',
  },
  {
    title: '操作时间',
    dataIndex: 'operation',
    render: () => (
      <>
      <Button type='primary'  style={{backgroundColor:'#5bc0de',borderColor:'#46b8da',marginRight:10}}  onClick={()=>{
       
      }}>查看</Button>
      <Button type='primary'  style={{backgroundColor:'#5bc0de',borderColor:'#46b8da',marginRight:10}}  onClick={()=>{
       history.push({
         pathname: '/docent/edit',
         query:{
           id:1
         }
       })
      }}>编辑</Button>
        <Button type='primary'  style={{backgroundColor:'#f0ad4e',borderColor:'#eea236'}}>注销</Button>
      </>
    ),
  },
];

const data:any = [];
for (let i = 0; i < 12; i++) {
  data.push({
    key: i,
    No:'1',
    age:2,
    nick_name:'web前端',
    password:'1',
    phone:'11111',
    position:'讲师',
    sex:'女',
    user_name:'22'
  });
}

const { Search } = Input;
const DocentList: React.FC<DocentListProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <PageHeaderWrapper>
      <div className={`${styles.flex} ${styles.margin40}`}>
        <div className={styles.flex}>
        </div>
        <div>
          <Button type="primary" onClick={()=>{
            history.push({
              pathname:'/docent/add'
            })
          }}>添加用户</Button>
        </div>
      </div>
      <Divider/>
      <Table columns={columns} dataSource={data} bordered loading={loading} />
    </PageHeaderWrapper>
  );
};

export default DocentList;
