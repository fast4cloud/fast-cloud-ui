import request from '/@/utils/request'

export function sysnoticeApi() {
  return {
    /**
     * 分页查询
     * @param data
     */
    queryPage: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysnotice/queryPage'),
        method: 'post',
        data,
      });
    },
    info: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysnotice/info'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysnotice/save'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysnotice/update'),
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
        url: request.adornUrl('fast-admin/fastadmin/sysnotice/delete'),
        method: 'post',
        data,
      });
    },
    /**
     * 导出
     * @param data
     */
    export: () => {
      return request.adornUrl('fast-admin/fastadmin/sysnotice/export')
    }
  };
}
