<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="state.dataForm.title" style="width: 90%"  placeholder="请输入标题" clearable size="large"></el-input>
        </el-form-item>
        <el-form-item label="配置编码" prop="configCode">
          <el-input v-model="state.dataForm.configCode" style="width: 90%" placeholder="请输入配置编码" clearable size="large"></el-input>
        </el-form-item>

        <el-form-item label="数据源" prop="dbCode">
          <el-select v-model="state.dataForm.dbCode" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.dataSources"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="查询sql" prop="querySql">
          <el-input type="textarea" :rows="10" v-model="state.dataForm.querySql" placeholder="请输入查询sql"
                    clearable></el-input>
        </el-form-item>

        <el-form-item label="是否分页" prop="isPage">
          <el-select v-model="state.dataForm.isPage" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.sysPages"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="参数类型" prop="paramType">
          <el-select v-model="state.dataForm.paramType" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.sysParamTypes"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="归属系统" prop="sysType">
          <el-select v-model="state.dataForm.sysType" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.sysTypes"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启" prop="sysType">
          <el-select v-model="state.dataForm.status" class="m-2" placeholder="Select" size="large">
            <el-option
                v-for="item in state.commonStatus"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" style="width: 90%" maxlength="200" v-model="state.dataForm.remark" placeholder="请输入备注"
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
import {tbqueryconfigApi} from '/@/api/TbQueryConfig';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import DictUtil from '/@/utils/DictUtil';

// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  configCode: [
    {
      required: true,
      message: '配置编码不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  title: [
    {
      required: true,
      message: '标题不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  dbCode: [
    {
      required: true,
      message: '数据源编码不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  querySql: [
    {
      required: true,
      message: '查询sql不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  isPage: [
    {
      required: true,
      message: '是否分页 00不分页 01分页不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  paramType: [
    {
      required: true,
      message: '参数类型 01自动拼接 02手动拼接不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  sysType: [
    {
      required: true,
      message: '归属系统0,未知系统不能为空!',
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
      message: '是否删除0未删除，1删除不能为空!',
      trigger: 'blur',
    }

  ]
  ,

});
const state = reactive({
  dataForm: {
    configCode: '' // 配置编码
    ,
    title: '' // 标题
    ,
    dbCode: 'default' // 数据源编码
    ,
    querySql: '' // 查询sql
    ,
    isPage: '00' // 是否分页 00不分页 01分页
    ,
    paramType: '01' // 参数类型 01自动拼接 02手动拼接
    ,
    sysType: '0' // 归属系统0,未知系统
    ,
    remark: '', // 备注
    status: '0' // 0正常1停用
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  type: "",
  sysPages: [],
  sysTypes: [],
  sysParamTypes: [],
  dataSources: [],
  commonStatus:[]
});
const initSelect = async () => {
  let dict = new DictUtil();
  await dict.getDictByType("sys_page").then(value => {
    state.sysPages = value;
  });
  await dict.getDictByType("sys_type").then(value => {
    state.sysTypes = value;
  });
  await dict.getDictByType("sysParamType").then(value => {
    state.sysParamTypes = value;
  });
  await dict.getDictByType("data_source").then(value => {
    state.dataSources = value;
  });
  await dict.getDictByType("sys_common_status").then(value => {
    state.commonStatus = value;
  });
}
// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  await initSelect();
  if (type === 'edit') {
    const dic = await tbqueryconfigApi();
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
    configCode: '' // 配置编码
    ,
    title: '' // 标题
    ,
    dbCode: 'default' // 数据源编码
    ,
    querySql: '' // 查询sql
    ,
    isPage: '00' // 是否分页 00不分页 01分页
    ,
    paramType: '01' // 参数类型 01自动拼接 02手动拼接
    ,
    sysType: '0' // 归属系统0,未知系统
    ,
    remark: '', // 备注
    status: '0' // 0正常1停用
    ,
  };
}
const close = () => {
  closeDialog();
  emit('refresh');
}
// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
  const dic = await tbqueryconfigApi();
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
