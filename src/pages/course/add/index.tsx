import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from "umi";
import { Form, Input, Button, Row, Col } from 'antd';
import styles from "./index.less";

interface CourseProps {}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 18, span: 6},
};

const Course: React.FC<CourseProps> = (props) => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
    history.push({
      pathname:'/course/add_one'
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <PageHeaderWrapper title="创建课程">
      <Row align="middle">
        <Col span={8}></Col>
        <Col span={8}>
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="课程名称"
              name="courseName"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
              help="注意: 课程名称即对外展示的信息"
            >
              <Input placeholder="请填写课程名称" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className={styles.marginTop15} >
                创建课程
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}></Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default Course;
