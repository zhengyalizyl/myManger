import { Button, Col, Input, Row, Form, message } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import omit from 'omit.js';
import { FormItemProps } from 'antd/es/form/FormItem';
import { getEmailCaptcha } from '@/services/login';

import ItemMap from './map';
import LoginContext, { LoginContextProps } from './LoginContext';
import styles from './index.less';

export type WrappedLoginItemProps = LoginItemProps;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface LoginItemType {
  UserName: React.FC<WrappedLoginItemProps>;
  Password: React.FC<WrappedLoginItemProps>;
  Mobile: React.FC<WrappedLoginItemProps>;
  EmailCaptcha: React.FC<WrappedLoginItemProps>;
  Captcha: React.FC<WrappedLoginItemProps>;
  Email:React.FC<WrappedLoginItemProps>;
}



export interface LoginItemProps extends Partial<FormItemProps> {
  name?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  buttonText?: React.ReactNode;
  countDown?: number;
  getEmailCaptchaButtonText?: string;
  getEmailCaptchaSecondText?: string;
  updateActive?: LoginContextProps['updateActive'];
  type?: string;
  defaultValue?: string;
  customProps?: { [key: string]: unknown };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tabUtil?: LoginContextProps['tabUtil'];
  captchaCode?:string
  setCaptchaCode?:(e:string)=>void
}

const FormItem = Form.Item;

const getFormItemOptions = ({
  onChange,
  defaultValue,
  customProps = {},
  rules,
}: LoginItemProps) => {
  const options: {
    rules?: LoginItemProps['rules'];
    onChange?: LoginItemProps['onChange'];
    initialValue?: LoginItemProps['defaultValue'];
  } = {
    rules: rules || (customProps.rules as LoginItemProps['rules']),
  };
  if (onChange) {
    options.onChange = onChange;
  }
  if (defaultValue) {
    options.initialValue = defaultValue;
  }
  return options;
};

const LoginItem: React.FC<LoginItemProps> = (props) => {
  const [count, setCount] = useState<number>(props.countDown || 0);
  const [timing, setTiming] = useState(false);
  // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
  const {
    onChange,
    customProps,
    defaultValue,
    rules,
    name,
    getEmailCaptchaButtonText,
    getEmailCaptchaSecondText,
    updateActive,
    type,
    tabUtil,
    captchaCode,
    setCaptchaCode,
    ...restProps
  } = props;

  const onGetEmailCaptcha = useCallback(async (email: string) => {
    const result = await getEmailCaptcha(email);
    const {successfull,result:newResult,status_code}=result;
    if (status_code === 200&&!successfull) {
      message.success(newResult);
      return;
    }
    message.success('获取验证码成功!');
    setTiming(true);
  }, []);

  useEffect(() => {
    let interval: number = 0;
    const { countDown } = props;
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval);

            // 重置秒数
            return countDown || 60;
          }
          return preSecond - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timing]);
  if (!name) {
    return null;
  }
  // get getFieldDecorator props
  const options = getFormItemOptions(props);
  const otherProps = restProps || {};
  if (type === 'EmailCaptcha') {
    const inputProps = omit(otherProps, ['onGetEmailCaptcha', 'countDown']);
    return (
      <FormItem shouldUpdate noStyle>
        {({getFieldValue,getFieldError}) => {
          const disabled=!(getFieldValue('email')&&getFieldError('email').length===0)||timing;
          let  isCount=(count>0)&&timing?true:false;
   return  (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                disabled={disabled}
                className={styles.getCaptcha}
                size="large"
                onClick={() => {
                  //点了，时间没到，disable为true
                  //初始的时候，getFieldValue('email')&&getFieldError('email').length===0,此时diable为true
                  //填入了值,并且值是正确的，此时倒计时，如果此时改变了值，也要等时间到了
                  console.log(timing)
                  const value = getFieldValue('email');
                  setTiming(true)
                  onGetEmailCaptcha(value);
                }}
              >
                {isCount ? `${count} 秒` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        )}}
      </FormItem>
    );
  }

  if (type === 'Captcha') {
    const inputProps = omit(otherProps, ['onGetEmailCaptcha', 'countDown']);

    return (
      <FormItem shouldUpdate noStyle>
        {({ getFieldValue }) => (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                // className={styles.getCaptcha}
                className={styles.captcha}
                size="large"
                onClick={() => {
                  setCaptchaCode&&setCaptchaCode('/api/user/login/captcha?t='+new Date().getTime())
                }}
              >
              <img src={captchaCode||''}/>
              </Button>
            </Col>
          </Row>
        )}
      </FormItem>
    );
  }


  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems: Partial<LoginItemType> = {};

Object.keys(ItemMap).forEach((key) => {
  const item = ItemMap[key];
  LoginItems[key] = (props: LoginItemProps) => (
    <LoginContext.Consumer>
      {(context) => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItems as LoginItemType;
