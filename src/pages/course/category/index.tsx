import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input, Divider } from 'antd';
import { history,withRouter } from 'umi';
import styles from './index.less';

interface CategoryListProps {}

const columns = [
  {
    title: '分类名称',
    dataIndex: 'main_title',
  },
  {
    title: '课程数量',
    dataIndex: 'main_total_count',
  },
  {
    title: '是否显示',
    dataIndex: 'main_is_show',
  },
  {
    title: '排序',
    dataIndex: 'main_sort',
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
      }}>编辑</Button>
      
      </>
    ),
  },
];

const data:any = [];
for (let i = 0; i < 12; i++) {
  data.push({
    key: i,
    main_sort:'1',
    main_total_count:2,
    main_title:'web前端',
    main_is_show:'1',
    chidren:[
      {
      key: i+1,
      main_sort:'1',
      main_total_count:2,
      main_title:'12',
      main_is_show:'1',
    }
  ]
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
          <Button type="primary" onClick={()=>{
            history.push({
              pathname:'/course/category_edit'
            })
          }}>添加分类</Button>
        </div>
      </div>
      <Divider/>
      <Table columns={columns} dataSource={data} bordered loading={loading} />
    </PageHeaderWrapper>
  );
};

export default CategoryList;
