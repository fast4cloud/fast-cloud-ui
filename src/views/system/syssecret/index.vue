<template>
  <div class="system-dic-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input v-model="state.tableData.param.data.appName" size="default" placeholder="请输入字典名称" style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="getTableData">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddDic('add')">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="id" label="" show-overflow-tooltip></el-table-column>
        <el-table-column prop="appId" label="appId" show-overflow-tooltip></el-table-column>
        <el-table-column prop="appName" label="应用名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accessRole" label="角色访问" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accessIp" label="访问IP限制" show-overflow-tooltip></el-table-column>
        <el-table-column prop="publicKey" label="公钥" show-overflow-tooltip></el-table-column>
        <el-table-column prop="privateKey" label="私钥" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hasTop" label="是否开启" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_open" :value="scope.row.hasTop"/>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateB" label="修改者" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150"
        >
          <template #default="scope">
            <el-button size="small" :icon="Edit" text type="primary" @click="onOpenEditDic('edit', scope.row)">修改</el-button>
            <el-button size="small" text :icon="Delete" type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
  import {syssecretApi} from '/@/api/SysSecret';
  // 引入组件
  const DicDialog = defineAsyncComponent(() => import('/@/views/system/syssecret/dialog.vue'));
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
        pageSize: 10,
        data:{
          appName:"",
        }
      },
    },
  });

  // 初始化表格数据
  const getTableData = async () => {
    state.tableData.loading = true;
    const dic = await syssecretApi();
    await dic.queryPage(state.tableData.param).then(data => {
      // debugger
      const dataList = data.data.records;
      state.tableData.data = dataList;
      state.tableData.total = data.data.total;
      state.tableData.loading = false;
    })

  };
  // 打开新增
  const onOpenAddDic = (type: string) => {
    dicDialogRef.value.openDialog(type);
  };
  // 打开修改
  const onOpenEditDic = (type: string, row) => {
    dicDialogRef.value.openDialog(type, row);
  };
  // 删除字典
  const onRowDel = (row) => {
    ElMessageBox.confirm(`此操作将永久删:“${row.id}”，是否继续?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
            .then(async () => {
              const dic = await syssecretApi();
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
