<template>
  <div class="system-dic-container layout-padding layout-content">
    <el-row>

    </el-row>
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-form :model="state.tableData.param.data"  size="small" :inline="true" >
          <el-form-item size="default"  label="用户名称" prop="userName">
            <el-input  clearable v-model="state.tableData.param.data.userName" placeholder="请输入用户名称"
                      ></el-input>
          </el-form-item>
          <el-form-item size="default"  label="状态" prop="status" >
            <el-select size="default"  v-model="state.tableData.param.data.status" clearable  placeholder="Select" >
              <el-option
                  v-for="item in state.sysUserStatusList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item >
          <el-button size="default" type="primary" class="ml10" @click="getTableData">
            <el-icon>
              <ele-Search/>
            </el-icon>
            查询
          </el-button>
          </el-form-item>
          <el-form-item >
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDic('add')">
              <el-icon>
                <ele-FolderAdd/>
              </el-icon>
              新增
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="danger" class="ml10" @click="onExport('export')">
              <el-icon>
                <ele-Download/>
              </el-icon>
              导出
            </el-button>
          </el-form-item>
        </el-form>

      </div>

      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="id" label="用户id" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="用户账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userType" label="用户类型" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_user_type" :value="scope.row.userType"/>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="用户邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="用户性别" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_sex" :value="scope.row.sex"/>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="用户状态" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag dictType="sys_user_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createBy" label="创建者" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" :icon="Edit" text type="primary" @click="onOpenEditDic('edit', scope.row)">
              修改
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
import {sysuserApi} from '/@/api/SysUser';
import {useMenuApi} from "/@/api/menu";
import DictUtil from "/@/utils/DictUtil";
import {sysdeptApi} from "/@/api/SysDept";
import {sysroleApi} from "/@/api/SysRole";
import {tbqueryconfigApi} from "/@/api/TbQueryConfig";
import commonFunction from '/@/utils/commonFunction';
const { download } = commonFunction();
// 引入组件
const DicDialog = defineAsyncComponent(() => import('/@/views/system/sysuser/dialog.vue'));
const DictTag = defineAsyncComponent(() => import('/@/components/DictTag/index.vue'));
// 定义变量内容
const dicDialogRef = ref();
const state = reactive({
  menuData: [] as TreeType[],
  menuProps: {
    children: 'children',
    label: 'menuName',
  },
  roleMenuIds: [],
  sysUserStatusList: [],
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      currentPage: 1,
      pageSize: 10,
      data: {
        userName: "",
        status:''
      }
    },
  },
});
const onExport = async () => {
  const dic = await sysuserApi();
  await dic.export( state.tableData.param.data).then(value => {
    download(value,"用户基本信息.xlsx");
  })
}
const initSelect = async () => {
  let dict = new DictUtil();
  await dict.getDictByType("sys_user_status").then(value => {
    state.sysUserStatusList = value;
  });

}
// 初始化表格数据
const getTableData = async () => {

  state.tableData.loading = true;
  //getMenuData();
  await initSelect();
  const dic = await sysuserApi();
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
// 删除字典
const onRowDel = (row) => {
  ElMessageBox.confirm(`此操作将永久删:“${row.id}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(async () => {
        const dic = await sysuserApi();
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
<style rel="stylesheet/scss" lang="scss">
.layout-content {
  display: flex;
}
</style>
