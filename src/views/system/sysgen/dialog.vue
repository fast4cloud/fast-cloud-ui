<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">


        <el-form-item label="方法名称" prop="apiMethod">
          <el-input v-model="state.dataForm.apiMethod" placeholder="请输入方法名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="脱敏模板" prop="parseTemp">
          <el-input :rows="10" type="textarea" v-model="state.dataForm.parseTemp" placeholder="请输入脱敏模板" clearable></el-input>
        </el-form-item>
        <el-form-item label="脱敏规则" prop="rulesJson">
          <el-input :rows="10" type="textarea"  v-model="state.dataForm.rulesJson" placeholder="请输入脱敏规则" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否开启" prop="isOpen">
          <el-select v-model="state.dataForm.isOpen" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.options"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :rows="3" type="textarea"  v-model="state.dataForm.remark" placeholder="请输入备注" clearable></el-input>
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
import {sysdatamaskApi} from '/@/api/SysDataMask';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import DictUtil from "/@/utils/DictUtil";
// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  apiMethod: [
    {
      required: true,
      message: '方法名称不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  parseTemp: [
    {
      required: true,
      message: '脱敏模板不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  isOpen: [
    {
      required: true,
      message: '是否开启,1开启,0关闭不能为空!',
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
  rulesJson: [
    {
      required: true,
      message: '脱敏规则不能为空!',
      trigger: 'blur',
    }

  ]


});
const state = reactive({
  dataForm: {
    apiMethod: '' // 方法名称
    ,
    parseTemp: '' // 脱敏模板
    ,
    isOpen: '1' // 是否开启
    ,
    remark: '' // 备注
    ,
    rulesJson: '' // 脱敏规则
    ,

  },
  options:[],
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  type: "",
});

// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  let dict = new DictUtil();
  await dict.getDictByType("sys_open").then(value => {
    state.options = value;
  });
  if (type === 'edit') {
    const dic = await sysdatamaskApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = data;
    });
    state.dialog.title = '修改';
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
    apiMethod: '' // 方法名称
    ,
    parseTemp: '' // 脱敏模板
    ,
    isOpen: '1' // 是否开启
    ,
    remark: '' // 备注
    ,
    rulesJson: '' // 脱敏规则

  };
}
const close = () => {
  closeDialog();
  emit('refresh');
}
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  const dic = await sysdatamaskApi();
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
