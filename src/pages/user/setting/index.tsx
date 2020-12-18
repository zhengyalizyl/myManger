import React from 'react';
import { Form, Input, InputNumber, Button,DatePicker,Upload,Radio } from 'antd';
import { history, withRouter } from 'umi';
import styles from './index.less';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Link, connect, Dispatch } from 'umi';
import { ConnectState } from "../../../models/connect";
import Icon, { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import User from '../../../pages/imgs/svg/user.svg';
import './index.less'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

interface UserPersonProps {
  
}
const layout = {
  labelCol: { span:4 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const normFile = (e:any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const UserPerson: React.FC<UserPersonProps> = (props) => {
  const {currentUser}=props;
  const {e_email,icon_url,real_name,intro_self,join_time,phone,user_name,sex,user_id}=currentUser;
  const onFinish = (values:any) => {
  const {join_time:user_join_time}=values;
  const  new_user_join_time=user_join_time.format();
  const {dispatch}=props;
  dispatch({
    type:'user/fetchEditCurrent',
    payload:{
      token:user_id,
      ...values,
      join_time:new_user_join_time
    }
  })
    console.log(values,new_user_join_time);
  };

  console.log(props,'用户')
  return (
    <div>
      {/* <PageHeaderWrapper> */}
      <h1>用户信息</h1>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={{
             icon_url,
             e_email,
             real_name,
             user_name,
             phone,
             intro_self,
             sex,
             join_time:moment(join_time, 'YYYY-MM-DD')
          }}
        >
          <Form.Item name="real_name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="头像" name="icon_url"  rules={[{ required: false }]}>
            <div className="ant-upload-drag-container image-hover">
             <p className="ant-upload-drag-icon">
              <Icon component={User}  style={{fontSize:120}}/>
              <p className="ant-upload-text">点击或者拖拽上传图片</p>
              </p>

            </div>
         
          </Form.Item>
          <Form.Item
            name="sex"
            label="性别"
            rules={[{ required: true }]}
          >
           <Radio.Group>
          <Radio value={1}>男</Radio>
          <Radio value={2}>女</Radio>
           </Radio.Group>
          </Form.Item>
          <Form.Item name="user_name" label="用户名" rules={[{ required: true, message: 'Please input your phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号码" rules={[{ required: true, message: 'Please input your phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="e_email" label="Email"  rules={[{ type: 'email' }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="join_time" label="加入日期" rules={[{ required: true}]}>
          <DatePicker/>
          </Form.Item>
          <Form.Item name="intro_self"  label="自我介绍">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <a style={{marginRight:20}}>
               修改密码
            </a>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      {/* </PageHeaderWrapper> */}
    </div>
  );
};

export default withRouter( connect(({user}: ConnectState)=>{
  return {
    currentUser:user.currentUser
  }
   
})(UserPerson));
