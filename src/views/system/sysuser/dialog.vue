<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="state.dataForm.userName" placeholder="请输入用户账号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="state.dataForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="关联角色">

              <el-select v-model="state.dataForm.roleId" placeholder="请选择" clearable class="w100">
                <el-option
                    v-for="item in state.roleList"
                    :key="item.id+''"
                    :label="item.roleName"
                    :value="item.id+''"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门id" prop="deptId">
              <el-cascader
                  :options="state.deptData"
                  :props="{ checkStrictly: true, value: 'id', label: 'deptName' }"
                  placeholder="请选择部门"
                  clearable
                  class="w100"
                  v-model="state.dataForm.deptIds"
              >
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
              <!--              <el-input v-model="state.dataForm.deptId" placeholder="请输入部门id" clearable></el-input>-->
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户类型" prop="userType">
              <el-select v-model="state.dataForm.userType" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.sysUserTypeList"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="state.dataForm.email" placeholder="请输入用户邮箱" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="state.dataForm.phone" placeholder="请输入手机号码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="state.dataForm.sex" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.sysSexList"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户状态" prop="status">
              <el-select v-model="state.dataForm.status" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.sysUserStatusList"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" placeholder="请输入用户描述" maxlength="150" v-model="state.dataForm.remark"
                        clearable></el-input>
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
import {sysuserApi} from '/@/api/SysUser';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import {sysroleApi} from '/@/api/sysrole/index';
import {sysdeptApi} from '/@/api/SysDept';
import DictUtil from '/@/utils/DictUtil';
// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  deptId: [
    {
      required: true,
      message: '部门id不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  userName: [
    {
      required: true,
      message: '用户账号不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  nickName: [
    {
      required: true,
      message: '用户昵称不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  userType: [
    {
      required: true,
      message: '用户类型(00系统用户,01演示用户不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  email: [
    {
      type: "email",
      required: true,
      message: '用户邮箱不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  phone: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      required: true,
      message: '手机号码不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  sex: [
    {
      required: true,
      message: '用户性别（0男 1女 2未知）不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  avatar: [
    {
      required: true,
      message: '头像地址不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  status: [
    {
      required: true,
      message: '用户状态0正常,1审核,2冻结不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  remark: [
    {
      required: false,
      message: '备注不能为空!',
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
      message: '修改者不能为空!',
      trigger: 'blur',
    }

  ]
  ,

});
const state = reactive({
  dataForm: {
    deptIds: [],//
    roleId:"",//角色id
    deptId: '' // 部门id
    ,
    userName: '' // 用户账号
    ,
    nickName: '' // 用户昵称
    ,
    userType: '00' // 用户类型(00系统用户,01演示用户
    ,
    email: '' // 用户邮箱
    ,
    phone: '' // 手机号码
    ,
    sex: '0' // 用户性别（0男 1女 2未知）
    ,
    avatar: '' // 头像地址
    ,
    status: '1' // 用户状态0正常,1审核,2冻结
    ,
    remark: '' // 备注
    ,
  },
  sysUserTypeList: [],
  sysSexList: [],
  sysUserStatusList: [],
  deptData: [],
  roleList:[],//角色id
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  type: "",
});
const initSelect = async () => {
  let dict = new DictUtil();
  await dict.getDictByType("sys_user_type").then(value => {
    state.sysUserTypeList = value;
  });
  await dict.getDictByType("sys_sex").then(value => {
    state.sysSexList = value;
  });
  await dict.getDictByType("sys_user_status").then(value => {
    state.sysUserStatusList = value;
  });
  //加载对应的部门数据
  const dic = await sysdeptApi();
  await dic.getDept({}).then(data => {
    // debugger
    // const dataList = data.data.children;
    state.deptData = data.data.children;
  })
  const roleApi = await sysroleApi();
  await roleApi.queryList({}).then(data => {
    // const dataList = data.data.children;
    state.roleList = data.data;
  })
}
// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  await initSelect();
  if (type === 'edit') {
    const dic = await sysuserApi();
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
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  clearData();
  closeDialog();
};
const clearData = () => {
  state.dataForm = {
    deptId: '' // 部门id
    ,
    userName: '' // 用户账号
    ,
    nickName: '' // 用户昵称
    ,
    userType: '00' // 用户类型(00系统用户,01演示用户
    ,
    email: '' // 用户邮箱
    ,
    phone: '' // 手机号码
    ,
    sex: '0' // 用户性别（0男 1女 2未知）
    ,
    avatar: '' // 头像地址
    ,
    password: '' // 密码
    ,
    status: '0' // 用户状态0正常,1审核,2冻结
    ,
    remark: '' // 备注

    ,
  };
}
const close = () => {
  closeDialog();
  emit('refresh');
}
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
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  const dic = await sysuserApi();
  if (!formEl) return
  let deptId = formatLastOption(state.dataForm.deptIds);
  state.dataForm.deptId = deptId
  formEl.validate((valid, fields) => {
    if (valid) {
      if (state.type == 'add') {
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
