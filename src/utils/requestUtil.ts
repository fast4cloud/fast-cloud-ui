import encryption from '/@/utils/encrypt/encryption'
import Cookies from "js-cookie";

const request = {
    /**
     * 请求参数处理
     * @param data
     * @param key
     * @param method
     */
    initReqParam(data: object, key: string, method: string): object {
        const param = {
            appId: "",
            head: {},
            data: {},
        }
        param.appId = 'fast_cloud_ui'
        const head = {
            'time': new Date().getTime(),
            'rkey': key,
            'method': method,
            'token': Cookies.get('token')
        }

        let noEncrypt = import.meta.env.VITE_NO_ENCRYPE
        if (noEncrypt=='true') {
            param.head = encryption.encryptRsa(JSON.stringify(head))
            param.data = encryption.encryptDesCbc(JSON.stringify(data), key)
        } else {
            param.head = head
            param.data = data
        }

        return param
    },
    async decryptData(data: object, key: string): string {
        let noEncrypt = import.meta.env.VITE_NO_ENCRYPE;
        let decData = "";
        if (noEncrypt=='true') {
            decData = await encryption.decryptDesCbc(data, key)
           // console.log("解密后的值,e" + decData)
            try {
                return JSON.parse(decData)
            } catch (e) {
                console.log(e);
                return "";
            }
        } else {
            return data;
        }
        /*
                let decData = "";
                try {
                    decData = await encryption.decryptDesCbc(data, key)
                   /!* if (decData.indexOf("") != -1) {
                        decData = decData.replace("", "");

                    } else if (decData.indexOf("") != -1) {
                        decData = decData.replace("", "");

                    }*!/
                    return JSON.parse(decData)
                } catch (e) {
                    console.log(e);
                    return "";
                }*/
    },
}
export default request
