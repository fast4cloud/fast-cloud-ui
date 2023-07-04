/**
 * 随机生成字符串
 * @type {string[]}
 */
const pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export default {
    UUID(pasLen:number):string {
        var uuid = ''
        var pasArrLen = pasArr.length
        for (var i = 0; i < pasLen; i++) {
            var x = Math.floor(Math.random() * pasArrLen)
            uuid += pasArr[x]
        }
        // console.log(uuid)
        return uuid
    }
}
