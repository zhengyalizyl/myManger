
import React from 'react';
import { Table, Button, Input, Avatar, List, Tabs } from 'antd';
import styles from './index.less';

const data = [
  {
    title: '积分',
  },
  {
    title: '等级',
  },
  {
    title: '金币',
  },
];
interface ProfileProps{
 
}

const Profile: React.FC<ProfileProps> = (props) => {

  return (
    <div>
     <div className={styles.flex}>
          <div className={styles.flexNormal}>
            <Avatar className={styles.img}  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <div>
              <h3 className={styles.name}>zyl学院</h3>
              <span>喜欢IT, 就上来课！</span>
            </div>
          </div>
          <div style={{width:'30%'}}>
            <List
              split
              grid={{
                gutter: 16,
                xs: 4,
                sm: 4,
                md: 4,
                lg: 4,
                xl:4,
                xxl: 4,
              }}
              dataSource={data}
              renderItem={(item) => (
                <List.Item className={`${styles.textCenter}`}>
                  <div>{item.title}</div>
                  <p className={`${styles.borderRight} ${styles.padding10} ${styles.textCenter}`}>1461</p>
                </List.Item>
              )}
            />
          </div>
        </div>
    </div>
  );
};

export default Profile;
