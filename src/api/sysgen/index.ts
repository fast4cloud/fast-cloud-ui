import request from '/@/utils/request'

//代码生成
export function sysgenApi() {
    return {
        /**
         * 分页查询
         * @param data
         */
        queryPage: (data: object) => {
            return request({
                url: request.adornUrl('fast-generator/sys/generator/list'),
                method: 'post',
                data,
            });
        },
        genCode: (data: object) => {
            return request({
                url: request.adornUrl('fast-generator/sys/generator/export?tables='+data),
                method: 'get',
                data,
                responseType: 'blob',
            });
            // return request.adornUrl('fast-generator/sys/generator/code?tables='+data);
        },

    };
}
