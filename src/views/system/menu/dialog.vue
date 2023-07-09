<template>
  <div class="system-menu-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="上级菜单">
              <el-cascader
                  :options="state.menuData"
                  :props="{ checkStrictly: true, value: 'id', label: 'menuName' }"
                  placeholder="请选择上级菜单"
                  clearable
                  class="w100"
                  :id="index"
                  ref="cascaderHandle"
                  v-model="state.ruleForm.parentIds"

              >
                <template #default="{ node, data }">
                  <span>{{ data.menuName }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单类型">
              <el-radio-group v-model="state.ruleForm.menuType">
                <el-radio label="0">目录</el-radio>
                <el-radio label="1">菜单</el-radio>
                <el-radio label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单名称">
              <el-input v-model="state.ruleForm.menuName" placeholder="菜单名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col v-if="state.ruleForm.menuType === '1'||state.ruleForm.menuType === '0'" :xs="24" :sm="12" :md="12"
                  :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单图标">
              <IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.icon"/>
            </el-form-item>
          </el-col>
          <template v-if="state.ruleForm.menuType === '1'||state.ruleForm.menuType === '0'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="路由路径">
                <el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值" clearable></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="state.ruleForm.menuType === '1'">


            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="组件路径">
                <el-input v-model="state.ruleForm.component" placeholder="组件路径" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="路由参数">
                <el-input v-model="state.ruleForm.query" placeholder="路由参数" clearable></el-input>
              </el-form-item>
            </el-col>
            <!--            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                          <el-form-item label="链接地址">
                            <el-input
                                v-model="state.ruleForm.isFrame"
                                placeholder="外链/内嵌时链接地址（http:xxx.com）"
                                clearable

                            >
                            </el-input>
                          </el-form-item>
                        </el-col>-->
          </template>
          <template v-if="state.ruleForm.menuType === '2'||state.ruleForm.menuType === '1'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="权限标识">
                <el-input v-model="state.ruleForm.permission" placeholder="请输入权限标识" clearable></el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单排序">
              <el-input-number v-model="state.ruleForm.orderNum" controls-position="right" placeholder="请输入排序"
                               class="w100"/>
            </el-form-item>
          </el-col>

          <template v-if="state.ruleForm.menuType === '1'||state.ruleForm.menuType === '0'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否隐藏">
                <el-radio-group v-model="state.ruleForm.hasVisible">
                  <el-radio :label="true">隐藏</el-radio>
                  <el-radio :label="false">不隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="菜单状态">
                <el-radio-group v-model="state.ruleForm.hasStatus">
                  <el-radio :label="true">正常</el-radio>
                  <el-radio :label="false">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="备注">
              <el-input v-model="state.ruleForm.remark" placeholder="备注" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import {defineAsyncComponent, reactive, onMounted, ref} from 'vue';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import {useMenuApi} from '/@/api/menu/index';
import {ElMessage} from "element-plus";
// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();
const state = reactive({
  // 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
  ruleForm: {
    parentIds: [],//父级菜单id
    parentId: 0,
    menuName: '',//菜单名称
    id: -1,//菜单id
    orderNum: 0,//排序
    path: '',//路由地址
    //组件路径
    component: '',
    query: '',//路由参数
    isFrame: 0,//是否为外链（0否,1是）
    menuType: '0',//0目录 1菜单,2按钮
    hasVisible: false,//菜单状态（0显示 1隐藏
    hasStatus: true,//菜单状态（0正常 1停用）
    permission: '',//菜单权限标识
    icon: '',//菜单图标
    remark: '',//备注
  },
  menuList: [],//菜单数据
  menuData: [] as RouteItems, // 上级菜单数据
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});
const formatLastOption = (valueArr) => {
  //state.ruleForm.parentId
  let valList = [];
  if (valueArr.length > 1) {
    valList = valueArr[valueArr.length - 1];
  } else {
    valList = valueArr[0];
  }
  return valList;

}

// 获取 pinia 中的路由
const getMenuData = async () => {
  let arr: RouteItems = [];
  const menuApi = await useMenuApi();
  await menuApi.getMenu().then(value => {
    arr = value.data.children
  });
  state.menuList = arr;
  return arr;
};

// 打开弹窗
const openDialog = async (type: string, row?: any) => {
  if (type === 'edit') {
    // 模拟数据，实际请走接口
    //获取详情接口
    const menuApi = await useMenuApi();
    let json = {
      id: row.id
    }
    await menuApi.info(json).then(value => {
      state.ruleForm = value.data;
      //getParentIds(state.menuList, value.parentId);
      state.dialog.isShowDialog = true;
      //state.tableData.data = value.children;
      row.menuType = '0';
      row.menuSort = Math.floor(Math.random() * 100);
      state.dialog.title = '修改菜单';
      state.dialog.submitTxt = '修 改';
    });

  } else {
    state.ruleForm.id = -1;
    state.dialog.title = '新增菜单';
    state.dialog.submitTxt = '新 增';
    state.dialog.isShowDialog = true;
    // 清空表单，此项需加表单验证才能使用
    // nextTick(() => {
    // 	menuDialogFormRef.value.resetFields();
    // });
  }
  state.dialog.type = type;

};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 是否内嵌下拉改变
// const onSelectIframeChange = () => {
//   /* if (state.ruleForm.isIframe) state.ruleForm.isIframe = true;
//    else state.ruleForm.isFrame = false;*/
//   return false;
// };
// 取消
const onCancel = () => {
  closeDialog();
};
//数据清空

// 提交
const onSubmit = async () => {
  let parentId = formatLastOption(state.ruleForm.parentIds);
  state.ruleForm.parentId = parentId;
  const menuApi = await useMenuApi();
  if (state.ruleForm.id == -1) {
    await menuApi.save(state.ruleForm).then(value => {
      let code = value.code;
      if (code != '200') {
        ElMessage.error(value.message);
      } else {
        ElMessage.success(value.message);
      }
    })
  } else {
    await menuApi.update(state.ruleForm).then(value => {
      let code = value.code;
      if (code != '200') {
        ElMessage.error(value.message);
      } else {
        ElMessage.success(value.message);
      }
    })
  }

  closeDialog(); // 关闭弹窗
  emit('refresh');
  // if (state.dialog.type === 'add') { }
  // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
};
// 页面加载时
onMounted(async () => {
  state.menuData = await getMenuData();
});

// 暴露变量
defineExpose({
  openDialog,
});
</script>
