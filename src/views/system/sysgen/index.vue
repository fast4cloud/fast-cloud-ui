<template>
  <div class="system-dic-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input v-model="state.tableData.param.table" size="default" placeholder="请输入查询表名" style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="getTableData">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="30"/>
        <el-table-column prop="id" label="" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableName" label="表名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableComment" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" :icon="Suitcase" text type="primary" @click="genTable('gen', scope.row)">生成</el-button>
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
    Suitcase
  } from '@element-plus/icons-vue'
  import {defineAsyncComponent, reactive, onMounted, ref} from 'vue';
  import commonFunction from '/@/utils/commonFunction';
  const { download } = commonFunction();
  import {sysgenApi} from '/@/api/sysgen';
  // 引入组件
  const DicDialog = defineAsyncComponent(() => import('/@/views/system/sysdatamask/dialog.vue'));
  const DictTag = defineAsyncComponent(() => import('/@/components/DictTag/index.vue'));

  // 定义变量内容
  const dicDialogRef = ref();
  const state = reactive({
    tableData: {
      data: [],
      total: 0,
      loading: false,
      param: {
        currentPage: 1,
        pageSize: 5,
        table:"",
      },
    },
  });

  // 初始化表格数据
  const getTableData = async () => {
    state.tableData.loading = true;
    const dic = await sysgenApi();
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
  const genTable = async (type: string, row) => {
    //导出
    const dic = await sysgenApi();
    dic.genCode(row.tableName).then(value => {
      download(value,"rest.zip");
    })

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
