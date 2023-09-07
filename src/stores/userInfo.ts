import {defineStore} from 'pinia';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: (): UserInfosState => <UserInfosState>({
        userInfos: {
            deptInfo: {},
            menuInfo: {},
            roleInfo: {},
            userInfo: {},
            ssoAppId: '',
            ssoType: ''
        },
    }),
    actions: {
        async setUserInfos(userInfo) {
            // 存储用户信息到浏览器缓存
            this.userInfos = userInfo
        }
    },
});
