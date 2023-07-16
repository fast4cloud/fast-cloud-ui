<template>
  <div class="system-dic-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="1069px"  height="500px">
      <el-table ref="tableRef" :data="state.tableData.data" border class="module-table-uncollected" max-height="200">
        <el-table-column
            v-for="(item, index) in state.tableData.header"
            :key="index"
            show-overflow-tooltip
            :prop="item.prop"
            :width="item.width"
            :label="item.label"
        >
          <template v-slot:header>
            <span v-if="item.isRequired" class="color-danger">*</span>
            <span class="pl5">{{ item.label }}</span>
            <el-tooltip v-if="item.isTooltip" effect="dark" content="这是tooltip" placement="top">
              <i class="iconfont icon-quanxian" />
            </el-tooltip>
          </template>
          <template v-slot="scope">
            <el-form-item
                :prop="`data.${scope.$index}.${item.prop}`"
                :rules="[{ required: item.isRequired, message: '不能为空', trigger: `${item.type}` == 'input' ? 'blur' : 'change' }]"
            >
              <el-select v-if="item.type === 'select'" v-model="scope.row[item.prop]" placeholder="请选择">
                <el-option v-for="sel in state.tableData.option" :key="sel.value" :label="sel.label" :value="sel.value" />
              </el-select>
              <el-date-picker
                  v-else-if="item.type === 'date'"
                  v-model="scope.row[item.prop]"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
              />
              <el-input v-else-if="item.type === 'input'" v-model="scope.row[item.prop]" placeholder="请输入内容" />
              <el-input v-else-if="item.type === 'dialog'" v-model="scope.row[item.prop]" readonly placeholder="请输入内容">
                <template v-slot:suffix>
                  <i class="iconfont icon-shouye_dongtaihui" />
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" :icon="Edit" text type="primary" @click="onOpenEditDic('edit', scope.row)">修改</el-button>
            <el-button size="small" text :icon="Delete" type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">{{
              state.dialog.submitTxt
            }}</el-button>
          <el-button size="default" type="primary" @click="onAddRow">新增一行</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemDicDialog">
import {nextTick, reactive, ref} from 'vue';
import {tbqueryconditionApi} from '/@/api/tbquerycondition/index';
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import DictUtil from '/@/utils/DictUtil';

// 定义变量内容
const ruleFormRef = ref();
const rules = reactive<FormRules>({

  configCode: []
  ,

});
const state = reactive({
  tableData: {
    data: [
      {
        conditionName: '',
        conditionCode: '',
        conditionType: '',
        queryField: '',
        remark: '',
      }
    ],
    header: [
      { prop: 'conditionName', width: '', label: '条件名称', isRequired: true, type: 'input' },
      { prop: 'conditionCode', width: '', label: '条件编码', isRequired: true, type: 'input' },
      { prop: 'conditionType', width: '', label: '条件关联类型', isRequired: true, type: 'select' },
      { prop: 'queryField', width: '', label: '参数字段', isRequired: true, type: 'select' },
      { prop: 'remark', width: '', label: '备注', isRequired: false, type: 'input' },
    ],
    option: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '蚵仔煎' },
    ],
  },
  dataForm: {},
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

}
// 新增一行
const onAddRow = () => {
  state.tableData.data.push({
    a1: '',
    a2: '',
    a3: '',
    a4: '',
    a5: '',
    a6: '',
    a7: '',
    a8: '',
  });
  tableRef.value.doLayout();
  nextTick(() => {
    tableRef.value.setScrollTop(1000000);
  });
};
// 打开弹窗
const openDialog = async (type: string, row) => {
  state.type = type;
  await initSelect();
  if (type === 'edit') {
    const dic = await tbqueryconditionApi();
    await dic.info({id: row.id}).then(value => {
      let data = value.data;
      state.dataForm = data;
    });
    state.dialog.title = '添加值域';
    state.dialog.submitTxt = '保存';
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
  state.dataForm = {};
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
