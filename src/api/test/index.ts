import request from '/@/utils/request';
export function test() {
    return {
        testData: (data: object) => {
            return request({
                url: request.adornUrl("fast-simple/fastsimple/syssecret/queryList"),
                method: 'post',
                data,
            });
        }
    };
}
