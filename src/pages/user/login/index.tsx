import {
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { Alert, Checkbox, notification, AlertType } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';
import login from '../../../assets/imgs/login.jpg';
import { string } from 'prop-types';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
  type: AlertType;
}> = ({ content, type }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type={type}
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState<string>('account');

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  let showMsg;
  let contentMsg = '';
  if (status === 'error' && loginType === 'account' && !submitting) {
    showMsg = 'error';
    contentMsg = '用户名或密码错误，请重新输入';
  } else if (status === 'ok' && loginType === 'account' && !submitting) {
    showMsg = 'success';
    contentMsg = '登录成功，正在跳转到别的页面';
  }
  return (
    <div className={styles.main}>
      <div className={styles.loginWrap}>
        <img src={login} className={styles.loginImg} />
      </div>
      {showMsg && <LoginMessage type={showMsg} content={contentMsg} />}
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <UserName
          name="userName"
          placeholder="用户名: admin or user"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码: ant.design"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />

        <Submit loading={submitting}>登录</Submit>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
