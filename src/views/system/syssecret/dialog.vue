<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="110px">

        <el-form-item label="appId" prop="appId">
          <el-input  v-model="state.dataForm.appId" placeholder="请输入分配给客户端的唯一标识" clearable></el-input>
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="state.dataForm.appName" placeholder="请输入应用名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="accessRole">
          <el-input v-model="state.dataForm.accessRole" placeholder="请输入用户角色" clearable></el-input>
        </el-form-item>
        <el-form-item label="访问IP限制" prop="accessIp">
          <el-input type="textarea" v-model="state.dataForm.accessIp" placeholder="请输入访问IP限制" clearable></el-input>
        </el-form-item>

        <el-form-item label="公钥" prop="publicKey">
          <el-input :rows="5" type="textarea" v-model="state.dataForm.publicKey" placeholder="请输入公钥"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="私钥" prop="privateKey">
          <el-input :rows="5" type="textarea" v-model="state.dataForm.privateKey" placeholder="请输入私钥"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="grenClick">生成公私钥</el-button>
        </el-form-item>
        <el-form-item label="是否开启" prop="hasTop">
          <el-select v-model="state.dataForm.hasTop" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.options"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
<!--          <el-input v-model="state.dataForm.hasTop" placeholder="请输入0停止使用,1开启" clearable></el-input>-->
        </el-form-item>

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
import {syssecretApi} from '/@/api/SysSecret';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
import DictUtil from '/@/utils/DictUtil';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  appId: [
    {
      required: true,
      message: '分配给客户端的唯一标识不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  appName: [
    {
      required: true,
      message: '应用名称不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  accessRole: [
    {
      required: false,
      message: '用于控制此用户是否能访问特定接口不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  accessIp: [
    {
      required: false,
      message: '访问IP限制不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  publicKey: [
    {
      required: true,
      message: '公钥不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  privateKey: [
    {
      required: true,
      message: '私钥不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  hasTop: [
    {
      required: true,
      message: '0停止使用,1开启不能为空!',
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
  updateB: [
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
    appId: '' // 分配给客户端的唯一标识
    ,
    appName: '' // 应用名称
    ,
    accessRole: '' // 用于控制此用户是否能访问特定接口
    ,
    accessIp: '' // 访问IP限制
    ,
    publicKey: '' // 公钥
    ,
    privateKey: '' // 私钥
    ,
    hasTop: '0' // 1停止使用,0开启
    ,
    createBy: '' // 创建者
    ,
    updateB: '' // 修改者
    ,
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  type: "",
  options:[],
});
const grenClick = async () => {
  //获取公私钥
  const dic = await syssecretApi();
  await dic.gren().then(value => {
    let data = value.data;
    state.dataForm.privateKey=data.privatekey
    state.dataForm.publicKey=data.pubKey
  })
}
// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  let dict = new DictUtil();
  await dict.getDictByType("sys_open").then(value => {
    state.options=value;
  });
  if (type === 'edit') {
    const dic = await syssecretApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = data;
      state.dataForm.hasTop = data.hasTop+'';
    });
    state.dialog.title = '修改';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '新增';
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
    appId: '' // 分配给客户端的唯一标识
    ,
    appName: '' // 应用名称
    ,
    accessRole: '' // 用于控制此用户是否能访问特定接口
    ,
    accessIp: '' // 访问IP限制
    ,
    publicKey: '' // 公钥
    ,
    privateKey: '' // 私钥
    ,
    hasTop: '' // 0停止使用,1开启
    ,
    createBy: '' // 创建者
    ,
    updateB: '' // 修改者
    ,
  };
}
const close = () => {

  closeDialog();
  emit('refresh');
}
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  const dic = await syssecretApi();
  if (!formEl) return
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
