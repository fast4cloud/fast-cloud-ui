import request from '/@/utils/request'

export function sysupdatelogApi() {
  return {
    /**
     * 分页查询
     * @param data
     */
    queryPage: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/queryPage'),
        method: 'post',
        data,
      });
    },
    queryList: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/queryList'),
        method: 'post',
        data,
      });
    },
    info: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/info'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/save'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/update'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/delete'),
        method: 'post',
        data,
      });
    },
    /**
     * 导出
     * @param data
     */
    export: (data) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysupdatelog/export'),
        method: 'post',
        data,
        responseType: 'blob',
      });
    }
  };
}
