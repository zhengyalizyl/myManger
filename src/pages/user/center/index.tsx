import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input, Avatar, List, Tabs } from 'antd';
import Profile from '../../../components/User/Profile';
import { history,withRouter } from 'umi';
import styles from './index.less';

interface UserCenterProps {}
const { TabPane } = Tabs;
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 5',
  },
  {
    title: 'Ant Design Title 6',
  },
];

function callback(key) {
  console.log(key);
}

const UserCenter: React.FC<UserCenterProps> = (props) => {
  return (
    <div>
      <PageHeaderWrapper>
        <Profile />
        <div>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="全部" key="1">
              <List
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 5,
                }}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="在学" key="2">
              <List
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 5,
                }}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="完成" key="3">
              <List
                pagination={{
                  onChange: (page) => {
                    console.log(page);
                  },
                  pageSize: 5,
                }}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
          ,
        </div>
      </PageHeaderWrapper>
    </div>
  );
};

export default withRouter(UserCenter);
