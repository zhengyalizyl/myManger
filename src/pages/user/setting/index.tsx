/* eslint-disable @typescript-eslint/naming-convention */
import React,{useState} from 'react';
import { Form, Input, Button, DatePicker, Upload, Radio, message,Modal,PageHeader } from 'antd';
import {  withRouter , connect, Dispatch } from 'umi';
import Icon, {  InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ConnectState } from '../../../models/connect';
import User from "../../imgs/svg/user.svg";

import 'moment/locale/zh-cn';
import { isGif, isJpg, isPng } from './checkImg';
import ImageInput from './ImageInput';

interface UserPersonProps {}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const MAX_IMG_SIZE=1024*1024*2;


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


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
const [imgUrl,setImgUrl]=React.useState(icon_url)
const [visiblePreviewImg,setVisiblePreviewImg]=React.useState(false);
const [previewImage,setPreviewImage]=useState('')
const [fileList,setFileList]=useState([])
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

  const beforeUpload = async (file:File) => {
    const isImage = await checkIsImge(file);
    if (!isImage) {
      return Promise.reject();
    }
    if(file.size>MAX_IMG_SIZE){
      message.error('图片尺寸小于2M');
      return Promise.reject();
    }
    console.log(file)
    getBase64(file, imageUrl =>{
      // setImgUrl(imageUrl);
      setVisiblePreviewImg(true);
      setPreviewImage(imageUrl);
    }
  
    );

    return Promise.reject();
  };

  const checkImageSize = async (file: File, size: number): Promise<any> => {
    // 判断图片的大小是否满足要求
    // png的宽*高是18-20位*22-24位(不包含20位,24位)
    // jpg的宽*高是a5对应的10进制，即165-167位*a3对应的163-165位(不包含165位和167位)
    // gif的宽和高是6-8位，并且第7位与第6位翻转一下,8-10位并且9位于第8位翻转一下,如6位是89，7位是02， gif就是 0289 而不是8902的值 切分后翻转一下
    try {
      const isPngImg = await isPng(file);
      const isGifImg = await isGif(file);
      const isJpgImg = await isJpg(file);
      if (isPngImg) {
        // checkPngSizee(file.slice(),size)
      }
    } catch (error) {
      return Promise.reject('出错了');
    }
  };

  const checkIsImge = async (file: File): Promise<any>=> {
    // 先判断是不是png/jpg/gif
    try {
      const res = (await isPng(file)) || (await isJpg(file)) || (await isGif(file));
      if (res) {
        return true;
      } 
        message.error('必须是png或者jpg或者gif');
        return false;
      
    } catch (error) {
      // eslint-disable-next-line no-new
      new Error('出错了');
    }
  };

  const checkImageUrl = async (rule:any, file: File) => {
    if (file) {
      try {
        const res = (await isPng(file)) || (await isJpg(file)) || (await isGif(file));
        if (res) {
          return Promise.resolve();
        } 
          message.error('必须是png或者jpg或者gif');
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('必须是png或者jpg或者gif');
        
      } catch (error) {
        // eslint-disable-next-line no-new
        new Error('出错了');
      }
    }
  };


  const handleChange = (info:any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>{
        setImgUrl(imageUrl);
        console.log(info)
        setFileList(info.fileList)
        setVisiblePreviewImg(true);
        setPreviewImage(imageUrl);
      }
    
      );
    }
  };
  const onPreview = async file => {
    console.log(file)
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setVisiblePreviewImg(true)
    setPreviewImage(src)
    // const image = new Image();
    // image.src = src;
    // const imgWindow = window.open(src);
    // imgWindow.document.write(image.outerHTML);
  };

  const cancelPreview=(e)=>{
    e.stopPropagation();
    setVisiblePreviewImg(false)
  }


  return (
    <div>
      <PageHeader title="个人中心">
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        initialValues={{
          icon_url:imgUrl,
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
          name="img_url"
          label="图片"
          rules={[{ required: true }, { validator: checkImageUrl }]}
        >
          <ImageInput />
        </Form.Item>
        {/* <Form.Item
          label="头像"
          name="icon_url"
          help="必须是png或者jpg或者gif"
          rules={[
            { required: true, message: '必循' },
            {
              validator: (_, value, callback) => {
                callback();
                console.log('头像的代销', value, _);
              },
            },
          ]}
        >
          <Upload beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item> */}
        <Form.Item label="头像">
          <Form.Item
            name="icon_url"
            valuePropName="fileList"
            noStyle
            getValueFromEvent={normFile}
            rules={[
              // { required: true, message: '必须有一个图片' },
              {
                validator: (_, value, callback) => {
                  callback();
                  console.log('头像的代销', value, _);
                },
              },
            ]}
          >
            <Upload.Dragger
              listType="picture-card"
              name="files"
              action="/upload.do"
              beforeUpload={beforeUpload}
              className="avatar-uploader"
              onChange={handleChange}
              fileList={fileList}
              onPreview={onPreview}
              // selectable={files.length < 1}
              multiple={false}
            >
              {fileList.length>0 ? (
                <>
               <img src={imgUrl} style={{ width: '100%' }} />
               {/* 裁剪模态框 */}
                <Modal
                    title='编辑我的头像'
                    visible={ visiblePreviewImg }
                    footer={null}
                    onCancel={cancelPreview}
                >
                    <div style={{
                       marginTop:20,
                       height:470, 
                       display:'flex',
                       justifyContent:'center',
                        alignItems:'center'}}>
                        <img
                            alt="example"
                            style={{width: '100%',height:'100%' }}
                            src={previewImage}
                        />
                    </div>
                    {/* <div style={{clear:'both'}} /> */}
                </Modal>

                </>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或者拖拽图片上传</p>
                </>
              )}
            </Upload.Dragger>
          </Form.Item>
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
      </PageHeader>
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
