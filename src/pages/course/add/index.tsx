import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

interface CourseProps{

}


const Course: React.FC<CourseProps> = (props) =>{
  return(
   <PageHeaderWrapper title="创建课程">
     add
   </PageHeaderWrapper>
  )

}

export default Course