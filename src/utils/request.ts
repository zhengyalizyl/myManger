/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestInterceptor, RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import { stringify } from 'querystring';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: any }): Response => {
  console.log(response, error, '错误处理');
  const { response } = error;

  if (response && response.status_code) {
    const errorText = codeMessage[response.status_code] || response.result;
    if (response.status_code === 401) {
      notification.error({
        message: '请重新登录',
        description: codeMessage[response.status_code],
      });

      localStorage.removeItem('zylManagerToken');
      return response;
    }
    const { status_code, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

const allowDefeaultUrl = [
  '/api/user/login',
  '/api/user/register',
  '/api/user/add',
  '/api/user/login/captcha',
];

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
request.interceptors.request.use((url, options) => {
  const tokenLocalStorage: string | null = localStorage.getItem('zylManagerToken') || '';
  const test = /^\/api\/user\/login\/emailCaptcha/;
  let isAllowDefaultUrl = true;
  console.log(test.test(url),allowDefeaultUrl.indexOf(url))
  if (test.test(url)) {
    isAllowDefaultUrl = true;
  } else {
    isAllowDefaultUrl = allowDefeaultUrl.indexOf(url) > -1;
  }


  if (!tokenLocalStorage && !isAllowDefaultUrl) {
    window.location.href = '/login';
    return;
  }

  if (!isAllowDefaultUrl && tokenLocalStorage) {
    options.headers = {
      Accept: 'application/json',
      // 'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${  tokenLocalStorage}`, // 这里要空一格
      ...options.headers,
    };
  } else {
    options.headers = {
      Accept: 'application/json',
      // 'Content-Type': 'application/json; charset=utf-8',
      ...options.headers,
    };
  }

  // eslint-disable-next-line consistent-return
  return {
    url,
    options: { ...options },
  };
});

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
request.interceptors.response.use(async (response) => {
  let result;
  const data = await response.clone().json();
  console.log(data);
  if (data.status_code && data.status_code !== 200) {
    // 界面报错处理
    result = response;
    if (data.status_code === 401) {
      notification.error({
        message: '请重新登录',
        description: codeMessage[data.err_code],
      });
      localStorage.removeItem('zylManagerToken');
      const queryString = stringify({
        redirect: window.location.href,
      });
      window.location.href = `/login?${queryString}`;
    }
    // result=response;
  } else {
    result = response;
  }
  return result;
});

export default request;
