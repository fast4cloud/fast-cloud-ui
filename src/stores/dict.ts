import {defineStore} from 'pinia';

/**
 * TagsView 路由列表
 * @methods setTagsViewRoutes 设置 TagsView 路由列表
 * @methods setCurrenFullscreen 设置开启/关闭全屏时的 boolean 状态
 */
export const dict = defineStore('dict', {
    state: (): dictState => ({
        dictAll: [],
    }),
    actions: {
        async setDictAll(data: Array<Object>) {
            this.dictAll = data;
        },
        async getDictObject(dictType: string) {
            for (let i = 0; i < this.dictAll.length; i++) {
                let obj = this.dictAll[i];
                if (dictType == obj.dictType) {
                    return obj.list;
                }
            }
            return [];
        },
    },
});
