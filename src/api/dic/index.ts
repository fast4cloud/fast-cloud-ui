import request from '/@/utils/request';

export function dicApi() {
    return {
        /**
         * 分页查询
         * @param data
         */
        queryPage: (data: object) => {
            return request({
                url: request.adornUrl("fast-admin/fastadmin/sysdicttype/queryPage"),
                method: 'post',
                data,
            });
        },
        info: (data: object) => {
            return request({
                url: request.adornUrl("fast-admin/fastadmin/sysdicttype/info"),
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
                url: request.adornUrl("fast-admin/fastadmin/sysdicttype/save"),
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
                url: request.adornUrl("fast-admin/fastadmin/sysdicttype/update"),
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
                url: request.adornUrl("fast-admin/fastadmin/sysdicttype/delete"),
                method: 'post',
                data,
            });
        },
        getDictAll: (data: object) => {
            return request({
                url: request.adornUrl("fast-admin/fastadmin/sysdicttype/getDictAll"),
                method: 'post',
                data,
            });
        }
    };
}
