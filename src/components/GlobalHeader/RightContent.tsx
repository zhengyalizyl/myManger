import { Tooltip, Tag } from 'antd';
import { Settings as ProSettings } from '@ant-design/pro-layout';
import Icon, { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectProps, SelectLang, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import Yelp from '../../pages/imgs/svg/yelp.svg';
import CloudUpload from '../../pages/imgs/svg/cloud-upload.svg';
import Xing from '../../pages/imgs/svg/xing.svg';
import User from '../../pages/imgs/svg/user.svg';
import Bell from '../../pages/imgs/svg/bell.svg';
import Exit from '../../pages/imgs/svg/exit.svg';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const clickType = {
  cloud: (dispatch?: Dispatch) => {
  
  },
  yelp: (dispatch?: Dispatch) => {
  
  },
  xing: (dispatch?: Dispatch) => {
  
  },
  userCenter: (dispatch?: Dispatch) => {
  
  },
  exit:(dispatch?:Dispatch)=>{
    dispatch &&
    dispatch({
      type: 'login/logout',
    });
  }
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, dispatch } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  console.log(props, 'GlobalHeaderRight');

  const onclick = (key: string) => {
    clickType[key](dispatch);
  };
  return (
    <div className={styles.header}>
      <div className={className}>
        <div onClick={() => onclick('cloud')}>
          <Icon component={CloudUpload} />
          教育云中心
        </div>
        <div onClick={() => onclick('yelp')}>
          <Icon component={Yelp} />
          分销中心
        </div>
        <div onClick={() => onclick('xing')}>
          <Icon component={Xing} />
          CRM对接中心
        </div>
        <div onClick={() => onclick('userCenter')}>
          <Icon component={User} />
          个人中心
        </div>
        <div>
          <Icon component={Bell} />
          <span>20</span>
        </div>
        <div onClick={() => onclick('exit')}>
          <Icon component={Exit} />
          退出
        </div>
        {/* <Avatar /> */}
        <SelectLang className={styles.action} />
      </div>
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
