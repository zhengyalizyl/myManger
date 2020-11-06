import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 红色
  // primaryColor: '#1890ff',  
  primaryColor: '#d9534f',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '管理后台系统',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/font_1475513_4mx81hz4f4f.js',
};

export type { DefaultSettings };

export default proSettings;
