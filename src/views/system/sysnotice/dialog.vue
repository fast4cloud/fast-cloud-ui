<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="110px">

          <el-form-item label="公告标题" prop="noticeTitle">
            <el-input v-model="state.dataForm.noticeTitle" placeholder="请输入公告标题" clearable></el-input>
          </el-form-item>


          <el-form-item label="公告类型" prop="noticeType">
            <el-select v-model="state.dataForm.noticeType" class="m-2" placeholder="Select" size="large">
              <el-option
                  v-for="item in state.noticeTypeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
              />
            </el-select>
          </el-form-item>


          <el-form-item label="公告内容" prop="noticeContent">
            <Editor v-model:get-html="state.dataForm.noticeContent"
                    :disable="state.editor.disable"/>
          </el-form-item>


          <el-form-item label="公告状态" prop="status">
            <el-select v-model="state.dataForm.status" class="m-2" placeholder="Select" size="large">
              <el-option
                  v-for="item in state.noticeStatusList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="5"   v-model="state.dataForm.remark" placeholder="请输入备注"
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
import {defineAsyncComponent, reactive, ref} from 'vue';
import {sysnoticeApi} from '/@/api/SysNotice';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 引入组件
const Editor = defineAsyncComponent(() => import('/@/components/editor/index.vue'));
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import DictUtil from '/@/utils/DictUtil';
// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  noticeTitle: [
    {
      required: true,
      message: '公告标题不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  noticeType: [
    {
      required: true,
      message: '公告类型（1通知 2公告）不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  noticeContent: [
    {
      required: true,
      message: '公告内容不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  status: [
    {
      required: true,
      message: '公告状态（0正常 1关闭）不能为空!',
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
  remark: [
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
    noticeTitle: '' // 公告标题
    ,
    noticeType: '1' // 公告类型（1通知 2公告）
    ,
    noticeContent: '' // 公告内容
    ,
    status: '0' // 公告状态（0正常 1关闭）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 更新者
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
  noticeTypeList: [],
  noticeStatusList: [],
});
const initSelect = async () => {
  let dict = new DictUtil();
  await dict.getDictByType("sys_notice_type").then(value => {
    state.noticeTypeList = value;
  });
  await dict.getDictByType("sys_notice_status").then(value => {
    state.noticeStatusList = value;
  });

}
// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  await initSelect()
  if (type === 'edit') {
    const dic = await sysnoticeApi();
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
    noticeTitle: '' // 公告标题
    ,
    noticeType: '1' // 公告类型（1通知 2公告）
    ,
    noticeContent: '' // 公告内容
    ,
    status: '0' // 公告状态（0正常 1关闭）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 更新者
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
  const dic = await sysnoticeApi();
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
