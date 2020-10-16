import React from 'react';
import {Avatar,Tabs,Form,Input,Button,Steps } from 'antd';
import styles from "./one.less";
interface CourseTopProps{

}


const CourseTop: React.FC<CourseTopProps> = (props) =>{

  return(
      <div className={styles.flex}>
      <div className={styles.flexNormal}>
            <Avatar className={styles.thumb}  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <div className={styles.marginLeft20}>
              <p>1233</p>
              <p className={styles.name}>讲师:郑亚路老师</p>
              <p>课时:168</p>
            </div>
      </div>
      </div>
  )

}

export default CourseTop