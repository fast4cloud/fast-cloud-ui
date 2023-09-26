<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="dicDialogFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item prop="dictName" label="字典名称">
              <el-input v-model="state.dataForm.dictName" placeholder="请输入字典名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典类型" prop="dictType">
              <el-input v-model="state.dataForm.dictType" placeholder="字典类型" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="字典状态">
              <el-switch v-model="state.dataForm.hasStatus" inline-prompt active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="字典描述">
              <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入字典描述"
                        maxlength="150"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(dicDialogFormRef)" size="default">{{
              state.dialog.submitTxt
            }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemDicDialog">
import {reactive, ref} from 'vue';
import {dicApi} from '/@/api/dic/index';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dicDialogFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  dictName: [
    {
      required: true,
      message: '请输入字典名称',
      trigger: 'blur',
    }

  ],
  dictType: [
    {
      required: true,
      message: '请输入字典类型',
      trigger: 'blur',
    }

  ],
});
const state = reactive({
  dataForm: {
    dictName: '', // 字典名称
    dictType: '', // 字段名
    hasStatus: true, // 字典状态
    status: '0',
    remark: '', // 字典描述
    id: -1
  }
  ,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  type: "",
});

// 打开弹窗
const openDialog = async (type: string, row: RowDicType) => {
  state.type = type;
  if (type === 'edit') {
    const dic = await dicApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = value.data;
      state.dataForm.hasStatus = data.status == "0" ? true : false;
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
  clearData()
  state.dialog.isShowDialog = false;
};
const clearData = () => {
  state.dataForm = {dictName: "", dictType: "", id: -1, remark: "", status: '0', hasStatus: true};
}
// 取消
const onCancel = () => {
  closeDialog();
};
const close = () => {
  closeDialog();
  emit('refresh');
}
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const dic = await dicApi();
  formEl.validate((valid, fields) => {
    if (valid) {
      state.dataForm.status = state.dataForm.hasStatus == true ? "0" : "1";
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
