import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Button, Input, Avatar, List,Tabs } from 'antd';

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
];

function callback(key) {
  console.log(key);
}

const UserCenter: React.FC<UserCenterProps> = (props) => {
  return (
    <div>
      <PageHeaderWrapper>
        <div>
          <div>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <div>
              <h3>zyl学院</h3>
              <span>喜欢IT, 就上来课！</span>
            </div>
          </div>
          <div>
          <Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="Tab 1" key="1">
      Content of Tab Pane 1
    </TabPane>
    <TabPane tab="Tab 2" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="Tab 3" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>

          </div>
        </div>
        <div>12133</div>

        <div>
          <List
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
          ,
        </div>
      </PageHeaderWrapper>
    </div>
  );
};

export default UserCenter;
