import React, { useState } from 'react';
import { Avatar, Tabs, Form, Input, Button, Steps, Row, Col, Select, Radio } from 'antd';
import { history, withRouter } from 'umi';
interface CategoryFormProps {}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 18, span: 6 },
};

const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    console.log(history, 12222222222);
    history.replace({
      pathname: '/course/category',
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    console.log(history)
  };
  return (
    <div>
      <Row align="middle">
        <Col span={8}></Col>
        <Col span={8}>
          <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
              label="名称"
              name="sub_title"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
            >
              <Input placeholder="课程主题" />
            </Form.Item>
            <Form.Item
              label="级别"
              name="mian_title"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
            >
              <Select defaultValue="">
                <Select.Option value="">顶级分类</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="排序"
              name="sort"
              rules={[{ required: true, message: 'Please input your courseName!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="是否显示" name="isShow">
              <Radio.Group defaultValue="1">
                <Radio.Button value="1" style={{marginRight:10}}>是</Radio.Button>
                <Radio.Button value="2">否</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}></Col>
      </Row>
    </div>
  );
};

export default CategoryForm;
