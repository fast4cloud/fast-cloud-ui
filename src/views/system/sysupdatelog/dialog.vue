<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
            <el-form-item label="标题" prop="title">
              <el-input style="width: 90%" size="large" v-model="state.dataForm.title" placeholder="请输入标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="更新内容" prop="logContent">
              <Editor v-model:get-html="state.dataForm.logContent"
                      :disable="state.editor.disable"/>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="5"  style="width: 90%" size="large" v-model="state.dataForm.remark" placeholder="请输入备注" clearable></el-input>
            </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemDicDialog">
import {defineAsyncComponent, reactive, ref} from 'vue';
const Editor = defineAsyncComponent(() => import('/@/components/editor/index.vue'));
  import {sysupdatelogApi} from '/@/api/sysupdatelog/index';
  import {ElMessage} from "element-plus";
  import type {FormInstance, FormRules} from 'element-plus'
  // 定义子组件向父组件传值/事件
  const emit = defineEmits(['refresh']);

  // 定义变量内容
  const ruleFormRef = ref();
  const rules = reactive<FormRules>({

    title:[
    {
      required: true,
      message: '标题不能为空!',
      trigger: 'blur',
    }

  ]
,
    logContent:[
    {
      required: true,
      message: '更新内容不能为空!',
      trigger: 'blur',
    }

  ]
,
    delFlag:[
    {
      required: true,
      message: '删除标志（0代表存在 1代表删除）不能为空!',
      trigger: 'blur',
    }

  ]
,
    createBy:[
    {
      required: true,
      message: '创建者不能为空!',
      trigger: 'blur',
    }

  ]
,
    updateBy:[
    {
      required: true,
      message: '修改者不能为空!',
      trigger: 'blur',
    }

  ]
,
    remark:[
    {
      required: false,
      message: '备注不能为空!',
      trigger: 'blur',
    }

  ]
,

  });
  const state = reactive({
    editor: {
      disable: false,
    },
    dataForm: {
    title: '' // 标题
,
    logContent: '' // 更新内容
,
    remark: '' // 备注
,
    },
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
    if (type === 'edit') {
      const dic = await sysupdatelogApi();
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
            title: '' // 标题
,
            logContent: '' // 更新内容
,
            delFlag: '' // 删除标志（0代表存在 1代表删除）
,
            createBy: '' // 创建者
,
            updateBy: '' // 修改者
,
            remark: '' // 备注
,
};
  }
  const close = () => {
    closeDialog();
    emit('refresh');
  }
  // 提交
  const onSubmit = async (formEl: FormInstance | undefined) => {
    const dic = await sysupdatelogApi();
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
