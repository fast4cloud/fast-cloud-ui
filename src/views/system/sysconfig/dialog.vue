<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="参数名称" prop="configName">
              <el-input v-model="state.dataForm.configName" placeholder="请输入参数名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="参数键名" prop="configKey">
              <el-input v-model="state.dataForm.configKey" placeholder="请输入参数键名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="参数键值" prop="configValue">
              <el-input v-model="state.dataForm.configValue" placeholder="请输入参数键值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="系统内置" prop="configType">
              <el-select v-model="state.dataForm.configType" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.options"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="备注" prop="remark">
              <el-input :rows="5" type="textarea" v-model="state.dataForm.remark" placeholder="请输入备注" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  import {reactive, ref} from 'vue';
  import {sysconfigApi} from '/@/api/SysConfig';
  import {ElMessage} from "element-plus";
  import type {FormInstance, FormRules} from 'element-plus'
  // 定义子组件向父组件传值/事件
  const emit = defineEmits(['refresh']);
  import DictUtil from '/@/utils/DictUtil';
  // 定义变量内容
  const ruleFormRef = ref();
  const rules = reactive<FormRules>({

    configName:[
    {
      required: true,
      message: '参数名称不能为空!',
      trigger: 'blur',
    }

  ]
,
    configKey:[
    {
      required: true,
      message: '参数键名不能为空!',
      trigger: 'blur',
    }

  ]
,
    configValue:[
    {
      required: true,
      message: '参数键值不能为空!',
      trigger: 'blur',
    }

  ]
,
    configType:[
    {
      required: true,
      message: '系统内置（Y是 N否）不能为空!',
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
      message: '更新者不能为空!',
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
    dataForm: {
    configName: '' // 参数名称
,
    configKey: '' // 参数键名
,
    configValue: '' // 参数键值
,
    configType: '' // 系统内置（Y是 N否）
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
    options:[],
    type: "",
  });

  // 打开弹窗
  const openDialog = async (type: string, row) => {
    state.type = type;
    let dict = new DictUtil();
    await dict.getDictByType("sys_default").then(value => {
      state.options=value;
    });
    if (type === 'edit') {
      const dic = await sysconfigApi();
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
            configName: '' // 参数名称
,
            configKey: '' // 参数键名
,
            configValue: '' // 参数键值
,
            configType: '' // 系统内置（Y是 N否）
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
    const dic = await sysconfigApi();
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
