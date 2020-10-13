import { Row, Col } from 'antd';
import Users from '../../pages/imgs/svg/users.svg';
import Icon from '@ant-design/icons';
import Registered from '../../pages/imgs/svg/registered.svg';
import Camera from '../../pages/imgs/svg/camera.svg';
import Safari from '../../pages/imgs/svg/safari.svg';
import Opera from '../../pages/imgs/svg/opera.svg';
import Question from '../../pages/imgs/svg/question.svg';

import React, { useRef } from 'react';

import styles from './index.less';

export interface HeaderListProps {

}

const HeaderList: React.FC<HeaderListProps> = (props) => {
  const {
   
  } = props;


  return (
    <div>
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={8}>
          <div className={`${styles.backgroundbd2130} ${styles.cell} `}>
            <Icon component={Users} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}> 登录用户</h4>
            <h5 className={styles.fontSize125Andcolor}>1300</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.backgroundd39e00} ${styles.cell}`}>
            <Icon component={Registered} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>新增注册</h4>
            <h5 className={styles.fontSize125Andcolor}>1200</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.background17a2b8} ${styles.cell}`}>
            <Icon component={Camera} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>课程新增学员</h4>
            <h5 className={styles.fontSize125Andcolor}>123</h5>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={8}>
          <div className={`${styles.background007bff} ${styles.cell}`}>
            <Icon component={Safari} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>班级新增学员</h4>
            <h5 className={styles.fontSize125Andcolor}>666</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.background17a2b8} ${styles.cell}`}>
            <Icon component={Opera} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>新增会员</h4>
            <h5 className={styles.fontSize125Andcolor}>1122</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.background545b62} ${styles.cell}`}>
            <Icon component={Question} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>未回复问答</h4>
            <h5 className={styles.fontSize125Andcolor}>236</h5>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HeaderList;
