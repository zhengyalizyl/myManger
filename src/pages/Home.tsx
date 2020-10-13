import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Row, Col } from 'antd';
import Users from '../pages/imgs/svg/users.svg';
import Icon from '@ant-design/icons';
import Registered from '../pages/imgs/svg/registered.svg';
import Camera from '../pages/imgs/svg/camera.svg';
import Safari from '../pages/imgs/svg/safari.svg';
import Opera from '../pages/imgs/svg/opera.svg';
import Question from '../pages/imgs/svg/question.svg';
import styles from './Home.less';
import { Chart, Axis, Tooltip, Geom, Interval, useTheme, registerTheme,
  Coord,
  Label,
  Legend,
  } from 'bizcharts';
  import DataSet from '@antv/data-set';

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

export default (): React.ReactNode => {
  const data = [
    { orderName: 'web', order: 38 },
    { orderName: 'java', order: 52 },
    { orderName: 'phthon', order: 61 },
    { orderName: 'bigdata', order: 45 },
    { orderName: 'ui', order: 48 },
  ];


  const { DataView } = DataSet;
    const data2 = [
      {
        item: '事例一',
        count: 40,
      },
      {
        item: '事例二',
        count: 21,
      },
      {
        item: '事例三',
        count: 17,
      },
      {
        item: '事例四',
        count: 13,
      },
      {
        item: '事例五',
        count: 9,
      },
    ];
    const dv = new DataView();
    dv.source(data2).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: (val:any) => {
          val = val * 100 + '%';
          return val;
        },
      },
    };
    function getXY(c, { index: idx = 0, field = 'percent', radius = 0.5 }) {
      const d = c.get('data');
      if (idx > d.length) return;
      const scales = c.get('scales');
      let sum = 0;
      for (let i = 0; i < idx + 1; i++) {
        let val = d[i][field];
        if (i === idx) {
          val = val / 2;
        }
        sum += val;
      }
      const pt = {
        y: scales[field].scale(sum),
        x: radius,
      };
      const coord = c.get('coord');
      let xy = coord.convert(pt);
      return xy;
    }
  const [theme, setTheme] = useTheme('my-theme');
  return (
    <PageContainer>
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={8}>
          <div className={`${styles.backgroundbd2130} ${styles.cell} `}>
            <Icon component={Users} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}> 登录用户</h4>
            <h5 className={styles.fontSize125Andcolor}>1300</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.backgroundd39e00} ${styles.cell}`}>
            <Icon component={Registered} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>新增注册</h4>
            <h5 className={styles.fontSize125Andcolor}>1200</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.background17a2b8} ${styles.cell}`}>
            <Icon component={Camera} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>课程新增学员</h4>
            <h5 className={styles.fontSize125Andcolor}>123</h5>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={8}>
          <div className={`${styles.background007bff} ${styles.cell}`}>
            <Icon component={Safari} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>班级新增学员</h4>
            <h5 className={styles.fontSize125Andcolor}>666</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.background17a2b8} ${styles.cell}`}>
            <Icon component={Opera} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>新增会员</h4>
            <h5 className={styles.fontSize125Andcolor}>1122</h5>
          </div>
        </Col>
        <Col span={8}>
          <div className={`${styles.background545b62} ${styles.cell}`}>
            <Icon component={Question} className={styles.fontSize80} />
            <h4 className={styles.fontSizeAndcolor}>未回复问答</h4>
            <h5 className={styles.fontSize125Andcolor}>236</h5>
          </div>
        </Col>
      </Row>
      <Row gutter={{ xs: 15, sm: 15, md: 15, lg: 15 }}>
        <Col span={12}>
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
            color='genre'
              position="orderName*order"
              state={{
                active: {
                  style: {
                    stroke: '#c23531',
                  },
                },
              }}
            />
            <Tooltip  />
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
        </Col>
        <Col span={12}>

        <Chart
          height={window.innerHeight}
          data={dv}
          scale={cols}
          padding={[80, 100, 80, 80]}
          forceFit
          onGetG2Instance={(c:any) => {
            const xy = getXY(c, { index: 0 });
            c.showTooltip(xy);
          }}
        >
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" />
          <Legend
            position="right"
            offsetY={-window.innerHeight / 2 + 200}
          />
          <Tooltip
            //triggerOn='none'
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="interval"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = percent * 100 + '%';
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              formatter={(val:any, item:any) => {
                return item.point.item + ': ' + val;
              }}
            />
          </Geom>
        </Chart>


        </Col>
      </Row>
    </PageContainer>
  );
};
