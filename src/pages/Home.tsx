import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';
import HeaderList from '../components/HeaderList/index';
import ChartLeft from '../components/HeaderList/ChartLeft';
import ChartRight from '../components/HeaderList/ChartRight';

export default (): React.ReactNode => {
  return (
    <PageContainer>
      <HeaderList />
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={12}>
          <ChartLeft />
        </Col>
        <Col span={12}>
          <ChartRight />
        </Col>
      </Row>
    </PageContainer>
  );
};
