import { SM4Util } from '/@/utils/encrypt/sm4'
import {sm2} from 'sm-crypto';
const publicKey = '0426cd4b6f5c7bc770cdef5131cd660a5bc65694a7a85a9269461fae7fe9034ba2fa652b235aacfa6b9b0a2734c36d055f25d6d5731dce38ab6d4d7c3223039607'
const encryption = {
    //国密sm4加密
    encryptDesCbc(message:string, key:string):object {
        const sm4 = new SM4Util()
        return sm4.encryptCustom_CBC(message, key, key)
    },
    /**
     * 国密sm4,解密
     * @param message
     * @param key
     */
    decryptDesCbc(message:object, key:string):string {
        const sm4 = new SM4Util()
        const res = sm4.decryptCustom_CBC(message, key, key)
        if (res == null) {
            return message+""
        }
        // console.log('解密后的值为:' + res)
        return res
    },
    /**
     * 国密sm2加密
     * @param data
     */
    encryptRsa(data:string):string {
        //
        /*  var jsencrypt = new JSEncrypt({ default_key_size: 2048 })
        jsencrypt.setPublicKey(publicKey)
        // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
        var result = jsencrypt.encrypt(data)
        return result */
        const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
        const encryptData = sm2.doEncrypt(data, publicKey, cipherMode) // 加密结果
        return '04' + encryptData
    },
}
export default encryption
