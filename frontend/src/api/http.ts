import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload.code !== 'undefined') {
      if (payload.code === 0) {
        return payload.data;
      }
      return Promise.reject(new Error(payload.message || '请求失败'));
    }
    return payload;
  },
  (error) => {
    const message = error?.response?.data?.message || error.message || '网络异常';
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(new Error(message));
  }
);

export default request;
