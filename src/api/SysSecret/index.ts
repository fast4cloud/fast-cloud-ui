import request from '/@/utils/request'

export function syssecretApi() {
    return {
        /**
         * 分页查询
         * @param data
         */
        queryPage: (data: object) => {
            return request({
                url: request.adornUrl('fast-admin/fastadmin/syssecret/queryPage'),
                method: 'post',
                data,
            });
        },
        info: (data: object) => {
            return request({
                url: request.adornUrl('fast-admin/fastadmin/syssecret/info'),
                method: 'post',
                data,
            });
        },
        /**
         * 添加
         * @param data
         */
        save: (data: object) => {
            return request({
                url: request.adornUrl('fast-admin/fastadmin/syssecret/save'),
                method: 'post',
                data,
            });
        },
        /**
         * 修改
         * @param data
         */
        update: (data: object) => {
            return request({
                url: request.adornUrl('fast-admin/fastadmin/syssecret/update'),
                method: 'post',
                data,
            });
        },
        /**
         * 删除
         * @param data
         */
        delete: (data: object) => {
            return request({
                url: request.adornUrl('fast-admin/fastadmin/syssecret/delete'),
                method: 'post',
                data,
            });
        },
        /**
         * 获取公私钥
         * @param data
         */
        gren: () => {
            return request({
                url: request.adornUrl('fast-admin/fastadmin/syssecret/gren'),
                method: 'get',

            });
        }
    };
}
