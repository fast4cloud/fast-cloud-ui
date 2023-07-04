/**
 * @author lzb
 *
 */
import Sm4 from "/@/utils/encrypt/sm4"
import SM4Context from "/@/utils/encrypt/SM4Context";
import {fromByteArray} from 'base64-js'

export default class Sm4utils {

    constructor() {


    }

    // CBC模式加密，自定义 iv 和 secretKey
    encryptCustom_CBC(plainText, iv, secretKey) {
        try {
            const sm4 = new Sm4();
            const ctx = new SM4Context();
            ctx.isPadding = true;
            ctx.mode = sm4.SM4_ENCRYPT;
            const keyBytes = this.stringToByte(secretKey);
            const ivBytes = this.stringToByte(iv);
            sm4.sm4_setkey_enc(ctx, keyBytes);
            const encrypted = sm4.sm4_crypt_cbc(ctx, ivBytes, this.stringToByte(plainText));
            const cipherText = fromByteArray(encrypted);
            if (cipherText != null && cipherText.trim().length > 0) {
                cipherText.replace(/(\s*|\t|\r|\n)/g, "");
            }
            return cipherText;
        } catch (e) {

            return null;
        }
    }
     stringToBytes(str) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(str);
        return Array.from(encoded);
    }

    //解密_CBC，自定义 iv 和 secretKey
    decryptCustom_CBC(cipherText, iv, secretKey) {
        try {
            let sm4 = new Sm4();
            let ctx = new SM4Context();
            ctx.isPadding = true;
            ctx.mode = sm4.SM4_DECRYPT;
            let keyBytes = this.stringToByte(secretKey);
            let ivBytes = this.stringToByte(iv);
            sm4.sm4_setkey_dec(ctx, keyBytes);
            let decrypted = sm4.sm4_crypt_cbc(ctx, ivBytes, fromByteArray(cipherText));
            return this.byteToString(decrypted);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    byteToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        let str = '',
            _arr = arr;
        for (let i = 0; i < _arr.length; i++) {
            const one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length === 8) {
                const bytesLength = v[0].length;
                let store = _arr[i].toString(2).slice(7 - bytesLength);
                for (let st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    utf8ByteToUnicodeStr(utf8Bytes) {
        var unicodeStr = "";
        for (var pos = 0; pos < utf8Bytes.length;) {
            var flag = utf8Bytes[pos];
            var unicode = 0;
            if ((flag >>> 7) === 0) {
                unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                pos += 1;

            } else if ((flag & 0xFC) === 0xFC) {
                unicode = (utf8Bytes[pos] & 0x3) << 30;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
                unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
                unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 5] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 6;

            } else if ((flag & 0xF8) === 0xF8) {
                unicode = (utf8Bytes[pos] & 0x7) << 24;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
                unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 4] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 5;

            } else if ((flag & 0xF0) === 0xF0) {
                unicode = (utf8Bytes[pos] & 0xF) << 18;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 3] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 4;

            } else if ((flag & 0xE0) === 0xE0) {
                unicode = (utf8Bytes[pos] & 0x1F) << 12;
                ;
                unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 2] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 3;

            } else if ((flag & 0xC0) === 0xC0) { //110
                unicode = (utf8Bytes[pos] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos + 1] & 0x3F);
                unicodeStr += String.fromCharCode(unicode);
                pos += 2;

            } else {
                unicodeStr += String.fromCharCode(utf8Bytes[pos]);
                pos += 1;
            }
        }
        return unicodeStr;
    }

    HexStringToBytes(hexString) {
        if (hexString == null || hexString === "") {
            return null;
        }

        hexString = hexString.toUpperCase();
        var length = hexString.length / 2;
        var hexChars = this.toCharArray(hexString);
        var d = new Uint8Array(length);

        for (var i = 0; i < length; i++) {
            var pos = i * 2;
            d[i] = (this.charToByte(hexChars[pos]) << 4) | this.charToByte(hexChars[pos + 1]);
        }

        return d;

    }
    toCharArray(hexString){
        var hexChars = [];

        for (var i = 0; i < hexString.length; i++) {
            hexChars.push(hexString.charAt(i));
        }
        return hexChars;
    }
    charToByte(c) {
        return "0123456789ABCDEF".indexOf(c);
    }

    stringToByte(str) {
        const bytes = [];
        let len, c;
        len = str.length;
        for (let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }
}

