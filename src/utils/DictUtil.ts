import pinia from '/@/stores/index';
import {dict} from '/@/stores/dict';

export default class DictUtil {
    dictObj = null

    constructor() {
        this.dictObj = dict(pinia);
    }

    async getDictByType(dictType: string) {
        return await this.dictObj.getDictObject(dictType).then(value => {
            //console.log(value)
            return value;
        })

    }

}
