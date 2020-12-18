import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, InputNumber, Button,DatePicker,Upload } from 'antd';
import Profile from '../../../components/User/Profile';
import { history, withRouter } from 'umi';
import styles from './index.less';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

interface UserPersonProps {}
const layout = {
  labelCol: { span: 8 },
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
  const onFinish = (values:any) => {
    console.log(values);
  };
  return (
    <div>
      <PageHeaderWrapper>
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item name="user_name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon_url" label="头像" rules={[{  required: true }]}>
          <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Upload.Dragger>
        </Form.Item>
          </Form.Item>
          <Form.Item
            name="sex"
            label="性别"
            rules={[{ required: true }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item name="phone" label="手机号码" rules={[{ required: true, message: 'Please input your phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="e_email" label="Email" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="join_time" label="加入日期" rules={[{ required: true}]}>
          <DatePicker />
          </Form.Item>
          <Form.Item name="intro_self"  label="自我介绍">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
               修改密码
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </PageHeaderWrapper>
    </div>
  );
};

export default withRouter(UserPerson);
