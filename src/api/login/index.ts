import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
    return {
        LoginMode: (data: object) => {
            return request({
                url: request.adornUrl("fast-user/user/LoginMode"),
                method: 'post',
                data,
            });
        }, signIn: (data: object) => {
            return request({
                url: request.adornUrl("fast-user/user/login"),
                method: 'post',
                data,
            });
        },
        signOut: (data: object) => {
            return request({
                url: request.adornUrl("fast-user/user/loginOut"),
                method: 'post',
                data,
            });
        },
        userInfo: (data: object) => {
            return request({
                url: request.adornUrl("fast-user/user/getUserInfo"),
                method: 'post',
                data,
            });
        },
        getCaptcha: () => {
            return request({
                url: request.adornUrl("fast-user/user/getCaptcha"),
                method: 'get',
            });

        },
    };
}
