<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">

      <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="父部门id" prop="parentId">
              <el-cascader
                  :options="state.deptData"
                  :props="{ checkStrictly: true, value: 'id', label: 'deptName' }"
                  placeholder="请选择部门"
                  clearable
                  class="w100"
                  v-model="state.dataForm.parentIds"
              >
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="state.dataForm.deptName" placeholder="请输入部门名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="state.dataForm.sortOrder" :min="0" :max="999" controls-position="right"
                               placeholder="请输入排序" class="w100"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="state.dataForm.leader" placeholder="请输入负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="联系电话" prop="phone">
              <el-input maxlength="11" v-model="state.dataForm.phone" placeholder="请输入联系电话" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="state.dataForm.email" placeholder="请输入邮箱" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="描述">
              <el-input v-model="state.dataForm.remark" type="textarea" placeholder="请输入描述"
                        maxlength="100"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门状态" prop="status">
              <el-select v-model="state.dataForm.status" class="m-2" placeholder="Select" size="large">
                <el-option
                    v-for="item in state.options"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                />
              </el-select>
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
import {sysdeptApi} from '/@/api/SysDept';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
import DictUtil from "/@/utils/DictUtil";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  parentId: [
    {
      required: true,
      message: '父部门id不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  deptName: [
    {
      required: true,
      message: '部门名称不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  sortOrder: [
    {
      required: true,
      message: '排序不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  leader: [
    {
      required: true,
      message: '负责人不能为空!',
      trigger: 'blur',
    }

  ]
  ,
  phone: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      required: true,
      message: '请输入正确的手机号码!',
      trigger: 'blur',
    }

  ]
  ,
  email: [
    {
      type: "email",
      required: true,
      message: '请输入正确的邮箱地址!',
      trigger: 'blur',
    }

  ]
  ,
  status: [
    {
      required: true,
      message: '部门状态（0正常 1停用）不能为空!',
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
  deptData: [],
  dataForm: {
    parentIds: [],
    parentId: '' // 父部门id
    ,
    deptName: '' // 部门名称
    ,
    sortOrder: '0' // 排序
    ,
    leader: '' // 负责人
    ,
    phone: '' // 联系电话
    ,
    email: '' // 邮箱
    ,
    status: '0' // 部门状态（0正常 1停用）
    ,

    createBy: '' // 创建者
    ,
    updateBy: '' // 修改者
    ,
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  options: [],
  type: "",
});

// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  let dict = new DictUtil();
  await dict.getDictByType("sys_dept_status").then(value => {
    state.options = value;
  });
  //加载对应的部门数据
  const dic = await sysdeptApi();
  await dic.getDept({}).then(data => {
    // debugger
    // const dataList = data.data.children;
    state.deptData = data.data.children;
  })

  if (type === 'edit') {
    const dic = await sysdeptApi();
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
  clearData();
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
const clearData = () => {
  state.dataForm = {
    parentIds: [],
    parentId: '' // 父部门id
    ,
    deptName: '' // 部门名称
    ,
    sortOrder: '0' // 排序
    ,
    leader: '' // 负责人
    ,
    phone: '' // 联系电话
    ,
    email: '' // 邮箱
    ,
    status: '0' // 部门状态（0正常 1停用）
    ,
    createBy: '' // 创建者
    ,
    updateBy: '' // 修改者
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
  let parentId = formatLastOption(state.dataForm.parentIds);
  const dic = await sysdeptApi();
  state.dataForm.parentId=parentId;
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
          clearData();
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
          clearData();
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
