<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="800px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input v-model="state.dataForm.dictLabel" placeholder="请输入字典标签" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典键值" prop="dictValue">
              <el-input v-model="state.dataForm.dictValue" placeholder="请输入字典键值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="30" :sm="15" :md="12" :lg="15" :xl="12" class="mb20">
            <el-form-item label="字典类型">
              <el-input disabled v-model="state.dataForm.dictType" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典排序" prop="dictSort">
              <el-input-number v-model="state.dataForm.dictSort" controls-position="right" placeholder="请输入字典排序"
                               class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="回显样式">
              <el-select v-model="state.dataForm.listClass" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.options"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
              <!--              <el-input v-model="state.dataForm.listClass" placeholder="请输入表格回显样式" clearable></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="样式属性">
              <el-input v-model="state.dataForm.cssClass" placeholder="请输入样式属性（其他样式扩展）" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否默认">
              <el-radio-group v-model="state.dataForm.hasDefault">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="状态">
              <el-radio-group v-model="state.dataForm.hasStatus">
                <el-radio :label="true">正常</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="备注">
              <el-input v-model="state.dataForm.remark" placeholder="请输入备注" clearable></el-input>
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
import {sysdictdataApi} from '/@/api/sysdictdata/index';
import DictUtil from '/@/utils/DictUtil';
import {ElMessage} from "element-plus";
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const ruleFormRef = ref();
const {currentRoute} = useRouter();
const route = currentRoute.value;
const rules = reactive<FormRules>({

  dictSort: [
    {
      required: true,
      message: '字典排序不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  dictLabel: [
    {
      required: true,
      message: '字典标签不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  dictValue: [
    {
      required: true,
      message: '字典键值不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  dictType: [
    {
      required: true,
      message: '字典类型不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  cssClass: [
    {
      required: true,
      message: '样式属性（其他样式扩展）不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  listClass: [
    {
      required: true,
      message: '表格回显样式不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  isDefault: [
    {
      required: false,
      message: '是否默认（Y是 N否）不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  status: [
    {
      required: false,
      message: '状态（0正常 1停用）不能为空!',
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
      required: true,
      message: '备注不能为空!',
      trigger: 'blur',
    }

  ]
  ,

});
const state = reactive({
  dataForm: {
    hasStatus: true,
    dictSort: '0' // 字典排序
    ,
    dictLabel: '' // 字典标签
    ,
    dictValue: '' // 字典键值
    ,
    dictType: route.query.dictType // 字典类型
    ,
    cssClass: '' // 样式属性（其他样式扩展）
    ,
    listClass: '', // 表格回显样式
    hasDefault: true,
    isDefault: '' // 是否默认（Y是 N否）
    ,
    status: '' // 状态（0正常 1停用）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 更新者
    ,
    remark: '' // 备注
    ,
  },
  // sysOpenList:[],
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  type: "",
  options:[],
});

// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  let dict = new DictUtil();
  await dict.getDictByType("table_class").then(value => {
    state.options=value;
  });
  state.dataForm.dictType = route.query.dictType
  if (type === 'edit') {
    const dic = await sysdictdataApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = data;
      state.dataForm.hasStatus = state.dataForm.status == "0" ? true : false;
      state.dataForm.hasDefault = state.dataForm.isDefault == "Y" ? true : false;
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
  clearData()
  state.dialog.isShowDialog = false;
};
const clearData = () => {
  state.dataForm = {
    hasDefault: true,
    hasStatus: true,
    dictSort: '0' // 字典排序
    ,
    dictLabel: '' // 字典标签
    ,
    dictValue: '' // 字典键值
    ,
    cssClass: '' // 样式属性（其他样式扩展）
    ,
    listClass: '' // 表格回显样式
    ,
    isDefault: '' // 是否默认（Y是 N否）
    ,
    status: '' // 状态（0正常 1停用）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 更新者
    ,
    remark: '' // 备注
    ,
  };
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
  const dic = await sysdictdataApi();
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      state.dataForm.dictType = route.query.dictType
      state.dataForm.status = state.dataForm.hasStatus == true ? '0' : '1';
      state.dataForm.isDefault = state.dataForm.hasDefault == true ? 'Y' : 'N';
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
