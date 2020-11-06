import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';
import HeaderList from '../components/HeaderList/index';
import ChartLeft from '../components/HeaderList/ChartLeft';
import ChartRight from '../components/HeaderList/ChartRight';
import { Link, connect, Dispatch } from 'umi';
import { HomeModelState } from '@/models/home';
// import { LoginParamsType } from '@/services/home';
import { ConnectState } from '@/models/connect';

interface HomeProps {
  dispatch: Dispatch;
  home: HomeModelState;
}

const Home: React.FC<HomeProps> = (props) => {
  const {dispatch,home}=props;
 
  useEffect(() => {
    dispatch({
      type:'home/fetchHomeList'
    })
  }, []);

  const homeList=home&&home.homeList?home.homeList:{}
  return (
    <PageContainer>
      <HeaderList homeList={homeList}/>
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={12}>
          <ChartLeft homeList={homeList} />
        </Col>
        <Col span={12}>
          <ChartRight  homeList={homeList} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default connect(({ home }: ConnectState) =>{
  return {
   home
  }

})(Home);
