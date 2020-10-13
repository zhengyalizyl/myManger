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

// 数据源
const data = [
  { orderName: 'web', order: 38 },
  { orderName: 'java', order: 52 },
  { orderName: 'phthon', order: 61 },
  { orderName: 'bigdata', order: 45 },
  { orderName: 'ui', order: 48 },
];

const ChartRight: React.FC<ChartRightProps> = (props) => {
  const {} = props;

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
