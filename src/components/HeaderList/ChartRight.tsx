import { Row, Col } from 'antd';
import Users from '../../pages/imgs/svg/users.svg';
import Icon from '@ant-design/icons';

import {
  Chart,
  Axis,
  Tooltip,
  Geom,
  PieChart,
  Coordinate,
  Interval,
  Interaction,
  Coord,
  Label,
  Legend,
} from 'bizcharts';
import React, { useRef } from 'react';

import styles from './index.less';

export interface ChartRightProps {}



const ChartRight: React.FC<ChartRightProps> = (props) => {
  const {homeList}=props;
  const {order_counter}=homeList||{order_counter:{}};
  const {web,java,python,bigdata,ui}=order_counter||{web:0,java:0,python:0,bigdata:0,ui:0};
  const data = [
    { orderName: 'web', order: Number(web) },
    { orderName: 'java', order: Number(java) },
    { orderName: 'python', order:Number(python) },
    { orderName: 'bigdata', order:Number(bigdata) },
    { orderName: 'ui', order:Number(ui) },
  ];
  return (
    <div>
      <h2>学科订单来源统计</h2>
      <Chart height={400} data={data} autoFit>
        <Coordinate type="theta" radius={0.8} innerRadius={0.2}/>
        <Tooltip showTitle={false} />
        <Axis visible={false} />
     
        <Interval
          position="order"
          adjust="stack"
          color="orderName"
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
          label={[
            'order',
            {
              content: (data) => {
                return `${data.orderName}: ${data.order}`;
              },
            },
          ]}
        />
        <Interaction type="element-single-selected" />
      </Chart>
    </div>
  );
};

export default ChartRight;
