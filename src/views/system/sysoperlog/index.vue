<template>
  <div class="system-dic-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input v-model="state.tableData.param.data.title" size="default" placeholder="请输入查询模块标题" style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="getTableData">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="id" label="日志主键" show-overflow-tooltip></el-table-column>
        <el-table-column prop="title" label="模块标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessType" label="业务类型" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_log_type" :value="scope.row.businessType"/>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="方法名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="requestMethod" label="请求方式" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operName" label="操作人员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operUrl" label="请求URL" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operIp" label="主机地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="loginLocation" label="归属地" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operParam" label="请求参数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jsonResult" label="返回参数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="操作状态" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_log_error_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column prop="errorMsg" label="错误消息" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operTime" label="操作时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="costTime" label="消耗时间(ms)" show-overflow-tooltip></el-table-column>

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
  import {sysoperlogApi} from '/@/api/SysOperLog';
  // 引入组件
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
          title:""
        }
      },
    },
  });

  // 初始化表格数据
  const getTableData = async () => {
    state.tableData.loading = true;
    const dic = await sysoperlogApi();
    await dic.queryPage(state.tableData.param).then(data => {
      // debugger
      const dataList = data.data.records;
      state.tableData.data = dataList;
      state.tableData.total = data.data.total;
      state.tableData.loading = false;
    })

  };

  // 打开修改弹窗
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
              const dic = await sysoperlogApi();
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
