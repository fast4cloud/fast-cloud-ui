<template>
  <div class="system-dic-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-form :model="state.tableData.param.data" size="small" :inline="true">
          <el-form-item size="default" label="查询编码" prop="configCode">
            <el-input size="default" v-model="state.tableData.param.data.configCode" placeholder="请输入查询编码" style="max-width: 180px"></el-input>
          </el-form-item>
          <el-form-item size="default"  label="归属系统" prop="sysType">
            <el-select v-model="state.tableData.param.data.sysType"  placeholder="Select" size="large">
              <el-option
                  v-for="item in state.sysTypes"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="getTableData">
              <el-icon>
                <ele-Search/>
              </el-icon>
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDic('add')">
              <el-icon>
                <ele-FolderAdd/>
              </el-icon>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="id" label="" show-overflow-tooltip></el-table-column>
        <el-table-column prop="configCode" label="配置编码" show-overflow-tooltip>
          <template #default="scope">
            <el-link @click="itemClick(scope.row)" :underline="false" type="primary">{{ scope.row.configCode }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dbCode" label="数据源编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="querySql" label="查询sql" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isPage" label="是否分页" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_page" :value="scope.row.isPage"/>
          </template>
        </el-table-column>
        <el-table-column prop="paramType" label="参数类型" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sysParamType" :value="scope.row.paramType"/>
          </template>
        </el-table-column>
        <el-table-column prop="sysType" label="归属系统" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_type" :value="scope.row.sysType"/>
          </template>
        </el-table-column>
        <el-table-column prop="sysType" label="状态" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_common_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" width="200" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" :icon="Edit" text type="primary" @click="onOpenEditDic('edit', scope.row)">修改
            </el-button>
            <el-button size="small" text :icon="Delete" type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="state.tableData.param.currentPage"
          background
          v-model:page-size="state.tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.tableData.total"
      >
      </el-pagination>
    </el-card>
    <DicDialog ref="dicDialogRef" @refresh="getTableData()"/>

  </div>
</template>

<script setup lang="ts" name="systemDic">
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import {defineAsyncComponent, reactive, onMounted, ref} from 'vue';
import {ElMessageBox, ElMessage} from 'element-plus';
import {tbqueryconfigApi} from '/@/api/TbQueryConfig';
import { useRouter } from 'vue-router';
import DictUtil from "/@/utils/DictUtil";

// 定义变量内容
const router = useRouter();
// 引入组件
const DicDialog = defineAsyncComponent(() => import('/@/views/visualmanager/tbqueryconfig/dialog.vue'));
const DictTag = defineAsyncComponent(() => import('/@/components/DictTag/index.vue'));
// 定义变量内容
const dicDialogRef = ref();
const ConditionRef = ref();
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      currentPage: 1,
      pageSize: 10,
      data: {
        configCode: '',
        sysType:''
      }
    },
  },
  sysTypes:[],
});
const initSelect = async () => {
  let dict = new DictUtil();
  await dict.getDictByType("sys_type").then(value => {
    state.sysTypes = value;
  });
}
// 初始化表格数据
const getTableData = async () => {
  state.tableData.loading = true;
  await initSelect();
  const dic = await tbqueryconfigApi();
  await dic.queryPage(state.tableData.param).then(data => {
    // debugger
    const dataList = data.data.records;
    state.tableData.data = dataList;
    state.tableData.total = data.data.total;
    state.tableData.loading = false;
  })

};
// 打开新增弹窗
const onOpenAddDic = (type: string) => {
  dicDialogRef.value.openDialog(type);
};
// 打开修改弹窗
const onOpenEditDic = (type: string, row) => {
  dicDialogRef.value.openDialog(type, row);
};
const onCondition = (type: string, row) => {
  ConditionRef.value.openDialog(type, row);
};
const itemClick = (row) => {
    //跳转解密
  router.push({
    path: '/tbquerycondition',
    query: {
      configCode:row.configCode
    },
  });
}
// 删除字典
const onRowDel = (row) => {
  ElMessageBox.confirm(`此操作将永久删:“${row.id}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(async () => {
        const dic = await tbqueryconfigApi();
        let json = {
          id: row.id
        }
        await dic.delete(json).then(data => {
          if (data.code == '200') {
            ElMessage.success(data.message);
          } else {
            ElMessage.error(data.message);
          }
          getTableData();
        })

      })
      .catch(() => {
      });
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getTableData();
};
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>
<style scoped>
.el-link {
  margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>
