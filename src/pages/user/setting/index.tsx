import React from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Upload, Radio } from 'antd';
import { history, withRouter } from 'umi';
import styles from './index.less';
import { UploadOutlined, InboxOutlined, LockOutlined } from '@ant-design/icons';
import { Link, connect, Dispatch } from 'umi';
import { ConnectState } from '../../../models/connect';
import Icon, { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import User from '../../../pages/imgs/svg/user.svg';
import './index.less';
import 'moment/locale/zh-cn';

interface UserPersonProps {}
const layout = {
  labelCol: { span: 4 },
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

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const getImageUtils = (file: File) => {
  const fileReader = new FileReader();
  return new Promise((reslove) => {
    fileReader.onload = (e) => {
      const { result } = e.target;
      console.log(result, '=========');
      const ret = [...new Uint8Array(result)]
        .map((v) => v.toString(16).toUpperCase())
        .map((v) => v.padStart(2, '0'));
      reslove(ret);
    };
    fileReader.readAsArrayBuffer(file);
  });
};

const isGif = async (file: File) => {
  const result = await getImageUtils(file.slice(0, 6));
  return result.join(' ') === '47 49 46 38 39 61' || result.join(' ') === '47 49 46 38 37 61';
};

const isJpg = async (file: File) => {
  const result1 = await getImageUtils(file.slice(0, 2));
  const result2 = await getImageUtils(file.slice(file.size - 2, file.size));
  return result1.join(' ') === 'FF D8' && result2.join(' ') === 'FF D9';
};

const isPng = async (file: File) => {
  const result = await getImageUtils(file.slice(0, 8));
  return result.join(' ') === '89 50 4E 47 0D 0A 1A 0A';
};

const UserPerson: React.FC<UserPersonProps> = (props) => {
  const { currentUser } = props;
  const {
    e_email,
    icon_url,
    real_name,
    intro_self,
    join_time,
    phone,
    user_name,
    sex,
    user_id,
  } = currentUser;
  const onFinish = (values: any) => {
    const { join_time: user_join_time } = values;
    const new_user_join_time = user_join_time.format();
    const { dispatch } = props;
    dispatch({
      type: 'user/fetchEditCurrent',
      payload: {
        token: user_id,
        ...values,
        join_time: new_user_join_time,
      },
    });
    console.log(values, new_user_join_time);
  };

  const beforeUpload = (file) => {
    console.log(file,'============');
    return true;
  };

  const checkImageSize=async (_,value)=>{
    //判断图片的大小是否满足要求
     //png的宽*高是18-20位*22-24位(不包含20位,24位)
    //jpg的宽*高是a5对应的10进制，即165-167位*a3对应的163-165位(不包含165位和167位)
    //gif的宽和高是6-8位，并且第7位与第6位翻转一下,8-10位并且9位于第8位翻转一下,如6位是89，7位是02， gif就是 0289 而不是8902的值 切分后翻转一下
    try {
      const { file } = value;
      const { originFileObj } = file;
      const isPng=await isPng(originFileObj)
    } catch (error) {
      return Promise.reject('出错了');
    }
   
  }
  const checkIsImge = async (_, value) => {
    //先判断是不是png/jpg/gif
    try {
      const { file } = value;
      const { originFileObj } = file;
      const res =
        (await isPng(originFileObj)) ||
        (await isJpg(originFileObj)) ||
        (await isGif(originFileObj));
      if (res) {
        return Promise.resolve();
      } else {
        return Promise.reject('必须是png或者jpg或者gif');
      }
    } catch (error) {
      return Promise.reject('出错了');
    }
  };

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
          join_time: moment(join_time, 'YYYY-MM-DD'),
        }}
      >
        <Form.Item name="real_name" label="姓名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="头像"
          name="icon_url"
          // help="必须是png或者jpg或者gif"
          rules={[
            { required: true, message: '必循' },
            // {validator:checkImage},
            {
              validator: checkIsImge,
            },
            {
              validator: (_, value, callback) => {
                //判断图片的大小是否满足要求
                //png的宽*高是18-20位*22-24位(不包含20位,24位)
                //jpg的宽*高是a5对应的10进制，即165-167位*a3对应的163-165位(不包含165位和167位)
                //gif的宽和高是6-8位，并且第7位与第6位翻转一下,8-10位并且9位于第8位翻转一下,如6位是89，7位是02， gif就是 0289 而不是8902的值 切分后翻转一下
                // if(_.size>200){
                // }
                callback();
                console.log('头像的代销', value, _);
              },
            },
          ]}
        >
          {/* <div className="ant-upload-drag-container image-hover">
             <p className="ant-upload-drag-icon"> */}
          {/* <Icon component={User}  style={{fontSize:120}}/> */}
          <Upload beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

          {/* <p className="ant-upload-text">点击或者拖拽上传图片</p>
              </p> */}

          {/* </div> */}
        </Form.Item>
        <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="user_name"
          label="用户名"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号码"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="e_email" label="Email" rules={[{ type: 'email' }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="join_time" label="加入日期" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="intro_self" label="自我介绍">
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <a style={{ marginRight: 20 }}>修改密码</a>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {/* </PageHeaderWrapper> */}
    </div>
  );
};

export default withRouter(
  connect(({ user }: ConnectState) => {
    return {
      currentUser: user.currentUser,
    };
  })(UserPerson),
);
