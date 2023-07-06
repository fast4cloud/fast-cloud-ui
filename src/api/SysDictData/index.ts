import request from '/@/utils/request'

export function sysdictdataApi() {
  return {
    /**
     * 分页查询
     * @param data
     */
    queryPage: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysdictdata/queryPage'),
        method: 'post',
        data,
      });
    },
    info: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysdictdata/info'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysdictdata/save'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysdictdata/update'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysdictdata/delete'),
        method: 'post',
        data,
      });
    }
  };
}
