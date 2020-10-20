import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Avatar,
  List,
  Tabs,
  Form,
  Input,
  Button,
  Divider,
  Select,
  Modal,
  Upload,
  Checkbox,
} from 'antd';
import Icon,{PlusOutlined} from '@ant-design/icons';
import { history } from 'umi';
import CourseTop from './Top';
import CourseLeft from './Left';
import styles from './one.less';
import Video from "../../imgs/svg/video.svg";
interface CourseOneProps {}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 18, span: 6 },
};
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 5',
  },
  {
    title: 'Ant Design Title 6',
  },
];
const { TextArea } = Input;
const CourseOne: React.FC<CourseOneProps> = (props) => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const onFinish = (values: any) => {
    console.log('Success:', values);
    history.push({
      pathname: '/course/add_two',
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
          <CourseLeft stepNumber={2} />
        </div>
        <div style={{ flex: 'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between' }}>
        <p>课时管理</p>
          <Button type="primary" onClick={() => setVisible(true)}>
          <PlusOutlined />课时
          </Button>
        </div>
          <Modal
            width={"800px"}
            title="添加任务"
            visible={visible}
            // onOk={handleOk}
            onCancel={() => setVisible(false)}
          >
            <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: 'Please input your courseName!' }]}
              >
                <Form.Item style={{ display: 'inline-block' }}>
                  <Input placeholder="课程主题" />
                </Form.Item>
                <Form.Item name="remember" style={{ display: 'inline-block', marginLeft: '20px' }}>
                  <Checkbox>免费试学</Checkbox>
                </Form.Item>
              </Form.Item>
              <Form.Item
                label="视频"
                name="video"
                rules={[{ required: true, message: 'Please input your courseName!' }]}
              >
                <Upload
                  name="picture"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                >
                  选择文件
                </Upload>
              </Form.Item>
              <Form.Item
                label="课程介绍"
                name="teacher"
                rules={[{ required: true, message: 'Please input your courseName!' }]}
              >
                <TextArea
                style={{width:400}}
                  placeholder="Autosize height with minimum and maximum number of lines"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
              <Form.Item label="时长" name="serializeStatus" help="时长必须为整数" required={true}>
                <Form.Item style={{ display: 'inline-block',marginBottom:0 }}>
                  <div style={{display:"flex",alignItems:'center'}}>
                  <Input />
                  <span className="ant-form-text" style={{marginLeft:20}}>分</span>
                  </div>
                </Form.Item>
                <Form.Item style={{ display: 'inline-block', marginLeft: '20px',marginBottom:0 }}>
                <div style={{display:"flex",alignItems:'center'}}>
                  <Input />
                  <span className="ant-form-text"style={{marginLeft:20}}>秒</span>
                  </div>
                </Form.Item>
              </Form.Item>
              <Form.Item
                label="建议学习时长"
                name="category"
                help="（如未设置，则默认学习时长为视频时长2倍取整。）"
                required={true}
              >
                <div style={{display:"flex",alignItems:'center'}}>
                <Input style={{ display: 'inline-block',marginRight:'20',width:200 }} />
                <span className="ant-form-text" style={{marginLeft:20}}>小时</span>
                </div>
              </Form.Item>
            </Form>
          </Modal>
          <Divider />
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">编辑</a>,
                  <a key="list-loadmore-more">预览</a>,
                  <a key="list-loadmore-more">删除</a>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Icon component={Video} className={styles.fontSize20} />
                  }
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
};

export default CourseOne;
