import {Session} from '/@/utils/storage';
import {useRouter} from "vue-router";
import {useLoginApi} from '/@/api/login/index';
import {useUserInfo} from '/@/stores/userInfo';
import pinia from '/@/stores/index';
export default class UserSdk {
    loginApi = null

    constructor() {
        this.loginApi = new useLoginApi()
    }

    async getUserInfo() {
        // 先获取token
        let token = Session.get("token");
        // token 为空，返回登录界面
        let userInfo = {};
        if (token == null) {
            const router = useRouter();
            router.push("/login")
        } else {
            // 返回数据集
            await this.loginApi.userInfo({}).then(async value => {
                if (value.code == '200') {
                    userInfo = value.data;
                    await useUserInfo(pinia).setUserInfos(value.data);
                }
            })
        }
        return await userInfo;
    }
}
