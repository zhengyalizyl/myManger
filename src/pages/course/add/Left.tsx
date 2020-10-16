import React,{useState} from 'react';
import {Avatar,Tabs,Form,Input,Button,Steps } from 'antd';
import styles from "./one.less";
interface CourseTopProps{
  stepNumber:number
}

const { Step } = Steps;
const CourseTop: React.FC<CourseTopProps> = (props) =>{
  const {stepNumber}=props;

  const [current, setCurrent] = useState(stepNumber);

  const onChange = (index: number) => {
    console.log('onChange:', index);
    setCurrent(index)
  };
  console.log(props,stepNumber,current)
  return(
    <Steps current={current} onChange={onChange} direction="vertical">
    <Step title="Step 1" description="This is a description." />
    <Step title="Step 2" description="This is a description." />
    <Step title="Step 3" description="This is a description." />
  </Steps>
  )

}

export default CourseTop