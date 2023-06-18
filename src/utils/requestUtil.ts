import encryption from '/@/utils/encrypt/encryption'
import Cookies from "js-cookie";
const request = {
    /**
     * 请求参数处理
     * @param data
     * @param key
     * @param method
     */
    initReqParam(data:object, key:string, method:string):object {
        const param = {
            appId: "",
            head:{},
            data:{},
        }
        param.appId = 'fast_cloud_ui'
        const head = {
            'time': new Date().getTime(),
            'rkey': key,
            'method': method,
            'token': Cookies.get('token')
        }
        // console.log('加密前head:', JSON.stringify(head))
        param.head = encryption.encryptRsa(JSON.stringify(head))
        param.data = encryption.encryptDesCbc(JSON.stringify(data), key)
        return param
    },
    decryptData(data:object, key:string):object {
        try {
            const decData = encryption.decryptDesCbc(data, key)
            return JSON.parse(decData)
        } catch (e) {
            return data
        }
    },
}
export default request
