import { Alert, Checkbox, notification, AlertType, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';
import login from '../../assets/imgs/login.jpg';
import md5 from 'md5';
const S_KEY = 'WaYjH1314.zylLike.CoM';

const { Tab, UserName, Password, Mobile, EmailCaptcha, Submit, Captcha,Email } = LoginForm;
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
  const { status, type: loginType,captchaCode:newCaptchaCode,errorMsg } = userLogin;
 const [captchaCode,setCaptchaCode]=useState('/api/user/login/captcha?t='+new Date().getTime())
  const [type, setType] = useState<string>('account');
  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type:'login/captcha'
    })
    dispatch({
      type:'login/logout'
    })
  }, []);

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, user_pwd: md5(values.user_pwd + S_KEY) },
    });
  };

  let showMsg;
  let contentMsg = '';
  console.log(status,submitting)
  if (status === 'error' && !submitting) {
    showMsg = 'error';
    contentMsg = errorMsg||'';
  } else if (status === 'ok'&& !submitting) {
    showMsg = 'success';
    contentMsg = '登录成功，正在跳转到别的页面';
  } else {
    showMsg = '';
  }
  return (
    <div className={styles.main}>
      <div className={styles.loginWrap}>
        <img src={login} className={styles.loginImg} />
      </div>
      <div className={styles.padding100}>
        {showMsg && <LoginMessage type={showMsg} content={contentMsg} />}
      </div>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        {/* <UserName
          name="user_name"
          placeholder="邮箱: zyl"
          rules={[
            {
              required: true,
              message: '请输入邮箱',
            },
          ]}
        /> */}
        <Email
          name="email"
          placeholder="邮箱: zyl"
          rules={[
            {
              type: 'email',
              message: '邮箱格式不正确',
            },
            {
              required: true,
              message: '请输入邮箱',
            },
          ]}
        />
        <Captcha
          captchaCode={captchaCode}
          name="captcha"
          placeholder="验证码"
          setCaptchaCode={setCaptchaCode}
          rules={[
            {
              required: true,
              message: '请输入验证码',
            }
          ]}
        />
        <EmailCaptcha
          name="emailCode"
          placeholder="邮箱验证码"
          countDown={60}
          rules={[
            {
              required: true,
              message: '请输入邮箱验证码',
            },
          ]}
        />

        <Password
          name="user_pwd"
          placeholder="密码: zyl"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <Submit loading={submitting}>登录</Submit>
        <a href="">register now!</a>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading}: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
