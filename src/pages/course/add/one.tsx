import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Tabs, Form, Input, Button, Divider, Select } from 'antd';
import { history } from "umi";
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
const CourseOne: React.FC<CourseOneProps> = (props) => {
  const [current, setCurrent] = useState(0);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    history.push({
      pathname:'/course/add_two'
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <PageHeaderWrapper title="课程添加">
      <CourseTop />

      <div className={styles.courseAdd}>
        <div style={{ width: 240, flexGrow: 0, flexBasis: 0, WebkitFlexBasis: 200 }}>
          <CourseLeft stepNumber={0}/>
        </div>
        <div style={{ flex: 'auto' }}>
          <p>课程信息</p>
          <Divider />
          <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
            >
              <Input placeholder="课程主题" />
            </Form.Item>
            <Form.Item
              label="副标题"
              name="subTitle"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
            >
              <Input placeholder="课程副主题" />
            </Form.Item>
            <Form.Item label="讲师" name="teacher">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="连载状态" name="serializeStatus">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="分类" name="category">
              <div style={{display:'flex'}}>
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
              <Select>
                <Select.Option value="demo">Demo2</Select.Option>
              </Select>
              </div>
            </Form.Item>
            <Form.Item
              label="课程简介"
              name="teacher"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
            >
              <TextArea
                placeholder="Autosize height with minimum and maximum number of lines"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item
              label="标签"
              name="tag"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
              help="标签将有利于您的课程被学生检索到"
            >
              <Input />
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

export default CourseOne;
