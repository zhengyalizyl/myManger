import { Row, Col } from 'antd';
import Users from '../../pages/imgs/svg/users.svg';
import Icon from '@ant-design/icons';

import { Chart, Axis, Tooltip, Geom, Interval, useTheme, registerTheme } from 'bizcharts';
import React, { useRef } from 'react';

export interface ChartLeftProps {}

// 注册自己的主题
registerTheme('my-theme', {
  defaultColor: '#bd2130',
  geometries: {
    interval: {
      rect: {
        default: { style: { fill: '#bd2130', fillOpacity: 0.95 } },
        active: { style: { fill: '#c23531', fillOpacity: 1 } },
        inactive: { style: { fillOpacity: 0.3, strokeOpacity: 0.3 } },
        selected: {},
      },
    },
  },
});

const ChartLeft: React.FC<ChartLeftProps> = (props) => {
  const {} = props;
  const data = [
    { orderName: 'web', order: 38 },
    { orderName: 'java', order: 52 },
    { orderName: 'phthon', order: 61 },
    { orderName: 'bigdata', order: 45 },
    { orderName: 'ui', order: 48 },
  ];
  const [theme, setTheme] = useTheme('my-theme');
  return (
    <div>
      <h2>订单统计</h2>
      <Chart
        theme={theme}
        height={400}
        autoFit
        data={data}
        interactions={['active-region', 'element-cursor-pointer', 'element-active']}
        padding={[30, 30, 30, 50]}
      >
        <Interval
          color="genre"
          position="orderName*order"
          state={{
            active: {
              style: {
                stroke: '#c23531',
              },
            },
          }}
        />
        <Tooltip />
        <Geom
          position="orderName*order"
          type="interval"
          tooltip={[
            'orderName*order',
            (orderName: string, order: number) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: orderName,
                title: '销量',
                value: order,
              };
            },
          ]}
        />
      </Chart>
    </div>
  );
};

export default ChartLeft;
