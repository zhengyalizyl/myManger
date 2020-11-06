

import React, { useRef } from 'react';
import { HomeModelState} from "@/models/home";
import { Chart, Axis, Tooltip, Geom, Interval, useTheme, registerTheme } from 'bizcharts';

export interface ChartLeftProps {
  
}

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

const ChartLeft: React.FC<HomeModelState> = (props) => {
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
