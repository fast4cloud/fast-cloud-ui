import request from '/@/utils/request'

export function sysoperlogApi() {
  return {
    /**
     * 分页查询
     * @param data
     */
    queryPage: (data: object) => {
      return request({
        url: request.adornUrl('fast-admin/fastadmin/sysoperlog/queryPage'),
        method: 'post',
        data,
      });
    },
  };
}
