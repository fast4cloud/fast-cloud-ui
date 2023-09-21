<template>
  <div class="personal layout-pd">
    <el-row>


      <!-- 消息通知 -->
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover">
          <template #header>
            <span>联系我们</span>
          </template>
          <div class="personal-info-box">
            <div class="contact-box">
              <div class="qq-box">
                <img :src="qq">
                <span>qq群</span>
              </div>
              <div class="qq-content-box">
                <el-link type="primary"
                         href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=0LYm-vcItk9Oufn8Oizo5992GJLkRScI&authKey=REvMfz35z0CDb%2Fh%2BhT7lf%2F840bQwpZS6Pnj48CE6bDPd9Z5iLl4N%2Fu6qRquO8bsK&noverify=0&group_code=710948085"
                         target="_blank">710948085
                </el-link>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover">
          <template #header>
            <span>更新日志</span>
          </template>
          <div class="personal-info-box">

            <el-collapse>
              <el-collapse-item v-for="(item,index) in state.noticeList" :title="item.title" :name="index">
                <div>
                  <el-text class="mx-1" v-html="item.logContent" type="success">
                  </el-text>
                </div>

              </el-collapse-item>

            </el-collapse>

          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup lang="ts" name="personal">
import {reactive, computed, onMounted} from 'vue';
import {sysupdatelogApi} from '/@/api/sysupdatelog/index';
import qq from '/@/assets/img/QQ.png'

// 定义变量内容
const state = reactive({
  noticeList: [],

});

// 页面加载时
onMounted(async () => {
  const dic = await sysupdatelogApi();
  dic.queryList({}).then(value => {
    let data = value.data;
    state.noticeList = data;
  });
});

</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.personal {
  overflow: scroll;

  .personal-info {
    .contact-box {
      display: flex;

      .qq-box {
        display: flex;
        align-items: center;

      }

      .qq-content-box {
        margin-left: 10px;
        display: flex;
        align-items: center;

      }
    }

    .personal-info-more {
      float: right;
      color: var(--el-text-color-secondary);
      font-size: 13px;

      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }

    .personal-info-box {
      overflow: hidden;

      .personal-info-ul {
        list-style: none;

        .personal-info-li {
          font-size: 13px;
          padding-bottom: 10px;

          .personal-info-li-title {
            display: inline-block;
            @include text-ellipsis(1);
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }

          a {
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }

          & a:hover {
            color: var(--el-color-primary);
            cursor: pointer;
          }
        }
      }
    }


  }
}
</style>
