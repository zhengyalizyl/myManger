import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input } from 'antd';
import { history,withRouter } from 'umi';
import styles from './index.less';

interface CategoryListProps {}

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
      <Button type="link" onClick={()=>{
       history.push({
         pathname: '/user/center',
         query:{
           id:1
         }
       })
      }}>查看</Button>
        <Button type='link'>锁定</Button>
      </>
    ),
  },
];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    No: i + 1,
    regAccount: i + '@itlike.com',
    userNick: 'haha' + i,
    age: 32,
    sex: '男',
    region: '天津',
    phone: 15369859836,
    point: 12 + i,
    registerTime: new Date().toDateString(),
    loginTime: new Date().toDateString(),
  });
}

const { Search } = Input;
const CategoryList: React.FC<CategoryListProps> = (props) => {
  const [loading, setLoading] = useState(true);
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
        
        </div>
      </div>
      <Table columns={columns} dataSource={data} bordered loading={loading} />
    </PageHeaderWrapper>
  );
};

export default withRouter(CategoryList);
