<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="state.dataForm.roleName" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色状态">
              <el-select v-model="state.dataForm.status" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.options"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="角色描述">
              <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入角色描述"
                        maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序">
              <el-input-number v-model="state.dataForm.roleSort" :min="0" :max="999" controls-position="right"
                               placeholder="请输入排序" class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单权限">
              <el-tree ref="treeRef" node-key="id" :data="state.menuData"
                       :default-checked-keys="state.dataForm.roleMenuIds" :props="state.menuProps" show-checkbox
                       class="menu-data-tree"/>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">{{
              state.dialog.submitTxt
            }}</el-button>
				</span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts" name="systemDicDialog">
import {reactive, ref} from 'vue';
import {sysroleApi} from '/@/api/sysrole/index';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import {useMenuApi} from '/@/api/menu/index';
// 定义变量内容
import DictUtil from '/@/utils/DictUtil';
const ruleFormRef = ref();
const treeRef = ref<InstanceType<typeof ElTree>>()
const rules = reactive<FormRules>({

  roleName: [
    {
      required: true,
      message: '角色名称不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  roleSort: [
    {
      required: true,
      message: '显示顺序不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  status: [
    {
      required: true,
      message: '角色状态（0正常 1停用）不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  delFlag: [
    {
      required: true,
      message: '删除标志（0代表存在 1代表删除）不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  createBy: [
    {
      required: true,
      message: '创建者不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  updateBy: [
    {
      required: true,
      message: '更新者不能为空!',
      trigger: 'blur',
    }

  ]
  ,

});
const state = reactive({
  menuData: [] as TreeType[],
  menuProps: {
    children: 'children',
    label: 'menuName',
  },
  dataForm: {
    roleMenuIds: [],
    roleName: '' // 角色名称
    ,
    roleSort: '0' // 显示顺序
    ,
    status: '' // 角色状态（0正常 1停用）
    ,
    delFlag: '' // 删除标志（0代表存在 1代表删除）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 更新者
    ,
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  options:[],
  type: "",
});
const getMenuData = async () => {
  const menuApi = await useMenuApi();
  await menuApi.getMenu().then(value => {
    state.menuData = value.data.children;
  });
}
// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  let dict = new DictUtil();
  await dict.getDictByType("sys_role_status").then(value => {
    state.options=value;
  });
  //加载菜单
  await getMenuData();
  if (type === 'edit') {
    const dic = await sysroleApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = data;
    });
    state.dialog.title = '修改字典';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '新增字典';
    state.dialog.submitTxt = '新 增';
    // 清空表单，此项需加表单验证才能使用
    // nextTick(() => {
    // 	dicDialogFormRef.value.resetFields();
    // });
  }
  state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
  clearData();
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
const clearData = () => {
  state.dataForm = {
    roleName: '' // 角色名称
    ,
    roleSort: '0' // 显示顺序
    ,
    status: '' // 角色状态（0正常 1停用）
    ,
    delFlag: '' // 删除标志（0代表存在 1代表删除）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 更新者
    ,
  };
}
const close = () => {
  clearData()
  closeDialog();
  emit('refresh');
}
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  const dic = await sysroleApi();
  if (!formEl) return
  state.dataForm.roleMenuIds = treeRef.value.getCheckedKeys();
  formEl.validate((valid, fields) => {
    if (valid) {
      if (state.type == 'add') {
        // console.log(treeRef.value.getCheckedKeys().join())
        dic.save(state.dataForm).then(value => {
          if (value.code == '200') {
            ElMessage.success(value.message);
          } else {
            ElMessage.error(value.message);
          }
          close();
        })
      } else {
        //修改
        dic.update(state.dataForm).then(value => {
          if (value.code == '200') {
            ElMessage.success(value.message);
          } else {
            ElMessage.error(value.message);
          }
          close();
        })
      }
    }
  })

};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
