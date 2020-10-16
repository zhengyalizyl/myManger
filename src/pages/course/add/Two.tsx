import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Tabs, Form, Input, Button, Divider, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { history } from 'umi';
import CourseTop from './Top';
import CourseLeft from './Left';
import styles from './one.less';
interface CourseOneProps {}
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 18, span: 6 },
};
const { TextArea } = Input;
const CourseTwo: React.FC<CourseOneProps> = (props) => {
  const [current, setCurrent] = useState(0);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    history.push({
      pathname: '/course/add_three',
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <PageHeaderWrapper title="课程添加">
      <CourseTop />

      <div className={styles.courseAdd}>
        <div style={{ width: 240, flexGrow: 0, flexBasis: 0, WebkitFlexBasis: 200 }}>
          <CourseLeft stepNumber={1} />
        </div>
        <div style={{ flex: 'auto' }}>
          <p>课程封面</p>
          <Divider />
          <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
              name="page"
              rules={[
                {
                  required: true,
                  message:
                    '可上传jpg, gif, png格式文件, 图片建议尺寸大于400x225，文件大小不能超过2M。',
                },
              ]}
            >
              <Upload
                className="avatar-uploader"
                name="logo"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className={styles.marginTop15}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </PageHeaderWrapper>
  );
};

export default CourseTwo;
