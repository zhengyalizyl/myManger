import { Alert, Checkbox, notification, AlertType } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { registerStateType } from '@/models/register';
import { RegisterParamsType } from '@/services/register';
import { ConnectState } from '@/models/connect';
import RegisterForm from './components/Register';

import styles from './style.less';
import registerLogo from '../../assets/imgs/login.jpg';
import md5 from "md5"
const  S_KEY="WaYjH1314.zylLike.CoM"


const { Tab, UserName, Password, Mobile, Captcha, Submit } = RegisterForm;
interface RegisterProps {
  dispatch: Dispatch;
  userRegister: registerStateType;
  submitting?: boolean;
}

const RegisterMessage: React.FC<{
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

const Register: React.FC<RegisterProps> = (props) => {
  const { userRegister = {}, submitting } = props;
  const { status, type: RegisterType } = userRegister;
  const [type, setType] = useState<string>('account');
  useEffect(()=>{
    const { dispatch } = props;
    console.log('hhhh')
    dispatch({
      type: 'Register/logout',
    });
  },[])

  const handleSubmit = (values: RegisterParamsType) => {
  
    const { dispatch } = props;
    dispatch({
      type: 'register/register',
      payload: { ...values,user_pwd:md5(values.user_pwd+S_KEY) },
    });
  };
  
  let showMsg;
  let contentMsg = '';
  if (status === 'error' && RegisterType === 'account' && !submitting) {
    showMsg = 'error';
    contentMsg = '用户名或密码错误，请重新输入';
  } else if (status === 'ok' && RegisterType === 'account' && !submitting) {
    showMsg = 'success';
    contentMsg = '登录成功，正在跳转到别的页面';
  }else{
    showMsg=''
  }
  return (
    <div className={styles.main}>
      <div className={styles.RegisterWrap}>
        <img src={registerLogo} className={styles.RegisterImg} />
      </div>
    <div className={styles.padding100}>
      {showMsg && <RegisterMessage type={showMsg} content={contentMsg} />}
      </div>
      <RegisterForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <UserName
          name="user_name"
          placeholder="用户名: zyl"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
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
      </RegisterForm>
    </div>
  );
};

export default connect(({ register, loading }: ConnectState) => ({
  userRegister: register,
  submitting: loading.effects['Register/Register'],
}))(Register);