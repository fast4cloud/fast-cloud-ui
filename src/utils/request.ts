import axios, {AxiosInstance} from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Session} from '/@/utils/storage';
import Cookies from "js-cookie";
import qs from 'qs';
import requestUtil from '/@/utils/requestUtil'
import uuid from '/@/utils/uuid'
// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    headers: {'Content-Type': 'application/json'},
    paramsSerializer: {
        serialize(params) {
            return qs.stringify(params, {allowDots: true});
        },
    },
});
const adornUrl = (actionName: string): string => {
    // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
    return 'api/' + actionName;
};
service.adornUrl = adornUrl;
// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么 token
        config.headers['token'] = Cookies.get('token')
        config.headers['appId'] = import.meta.env.VITE_SSO_APP_ID;
        if (Session.get('token')) {
            config.headers!['Authorization'] = `${Session.get('token')}`;
        }
        let method = config.method;
        if (method != 'post') {
            return config;
        }
        const data = config.data
        // const baseURL = config.baseURL
        const url = config.url
        const rkey = uuid.UUID(16)
        config.rkey = rkey
        if (config.headers['Content-Type'] === 'multipart/form-data') {
            // 文件上传时,不重写data值
            return config
        }
        config.data = requestUtil.initReqParam(data, rkey, url)
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    async (response) => {
        // 对响应数据做点什么
        const res = response.data;
        let method = response.config.method;
        const url = response.config.url
        if (res.code === '401') {
            // `token` 过期或者账号已在别处登录
            if (res.code === '401' || res.code === '4001') {
                Session.clear(); // 清除浏览器全部临时缓存
                window.location.href = '/'; // 去登录页
                ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
                    .then(() => {
                    })
                    .catch(() => {
                    });
            }
            return Promise.reject(service.interceptors.response);
        } else if (url.indexOf('export') !== -1) {
            // 说明是导出功能,直接返回流
            return res
        } else if (res.code !== '200') {
            ElMessage({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            if (method != 'post') {
                return res;
            }
            let content = await requestUtil.decryptData(res.data, response.config.rkey);
            res.data = content;
            return res;
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else {
            if (error.response.data) ElMessage.error(error.response.statusText);
            else ElMessage.error('接口路径找不到');
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
