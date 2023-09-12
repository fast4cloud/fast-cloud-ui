import request from '/@/utils/request'

export function uploadApi() {
    return {
        /**
         * 分页查询
         * @param data
         */
        upload: () => {
            return  request.adornUrl('fast-admin/fastadmin/upload/upload')
        },

    };
}
