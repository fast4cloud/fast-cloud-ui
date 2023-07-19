<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-form-item label="查询配置表CODE" prop="queryCode">
          <el-input style="width: 90%" disabled size="large" v-model="state.dataForm.queryCode" placeholder="请输入查询配置表CODE"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="条件名称" prop="conditionName">
          <el-input style="width: 90%" size="large" v-model="state.dataForm.conditionName" placeholder="请输入条件名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="条件编码" prop="conditionCode">
          <el-input style="width: 90%" size="large" v-model="state.dataForm.conditionCode" placeholder="请输入条件编码"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="条件关联" prop="conditionType">
          <el-select v-model="state.dataForm.conditionType" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.options"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联语句中字段" prop="queryField">
          <el-input style="width: 90%" size="large" v-model="state.dataForm.queryField" placeholder="请输入关联语句中字段"
                    clearable></el-input>
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
import {tbqueryconditionApi} from '/@/api/TbQueryCondition';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
import {useRouter} from 'vue-router'
import DictUtil from '/@/utils/DictUtil';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const {currentRoute} = useRouter();
const route = currentRoute.value;
// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  queryCode: [
    {
      required: true,
      message: '查询配置表CODE不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  conditionName: [
    {
      required: true,
      message: '条件名称不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  conditionCode: [
    {
      required: true,
      message: '条件编码不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  conditionType: [
    {
      required: true,
      message: '条件关联类型 00:=  01:like 02:> 03:<  04>= 05<=不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  queryField: [
    {
      required: true,
      message: '关联语句中字段不能为空!',
      trigger: 'blur',
    }

  ]
  ,

});
const state = reactive({
  dataForm: {
    queryCode: '' // 查询配置表CODE
    ,
    conditionName: '' // 条件名称
    ,
    conditionCode: '' // 条件编码
    ,
    conditionType: '' // 条件关联类型 00:=  01:like 02:> 03:<  04>= 05<=
    ,
    queryField: '' // 关联语句中字段
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

// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  let dict = new DictUtil();
  await dict.getDictByType("conditionType").then(value => {
    state.options=value;
  });
  state.dataForm.queryCode = route.query.configCode;
  if (type === 'edit') {
    const dic = await tbqueryconditionApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = data;
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
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  clearData();
  closeDialog();
};
const clearData = () => {
  state.dataForm = {
    queryCode: '' // 查询配置表CODE
    ,
    conditionName: '' // 条件名称
    ,
    conditionCode: '' // 条件编码
    ,
    conditionType: '' // 条件关联类型 00:=  01:like 02:> 03:<  04>= 05<=
    ,
    queryField: '' // 关联语句中字段
    ,
  };
}
const close = () => {
  closeDialog();
  emit('refresh');
}
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  const dic = await tbqueryconditionApi();
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
