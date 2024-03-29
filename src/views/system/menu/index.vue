<template>
  <div class="system-menu-container layout-pd">
    <el-card shadow="hover">
      <div class="system-menu-search mb15">
        <el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="getTableData">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增菜单
        </el-button>
      </div>

      <el-table
          :data="state.tableData.data"
          v-loading="state.tableData.loading"
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.icon"/>
            <span class="ml10">{{ $t(scope.row.menuName) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权码" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.permission }}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示" show-overflow-tooltip prop="visible" >
          <template #default="scope">
            <dict-tag dictType="sys_show_hide" :value="scope.row.visible"/>
          </template>
        </el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="类型" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag type="success" size="small">{{ scope.row.menuType == 0 ? '目录' : '菜单' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="190">
          <template #default="scope">
            <div >
              <el-button size="small"  text type="primary" @click="onOpenAddMenu('add')">新增</el-button>
              <el-button size="small" :icon="Edit" text type="primary" @click="onOpenEditMenu('edit', scope.row)">修改</el-button>
              <el-button size="small" v-if="scope.row.id!=1&&scope.row.id!=2" :icon="Delete" text type="danger" @click="onTabelRowDel(scope.row)">删除</el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <MenuDialog ref="menuDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'
import {defineAsyncComponent, ref, onMounted, reactive} from 'vue';
import {RouteRecordRaw} from 'vue-router';
import {ElMessageBox, ElMessage} from 'element-plus';

import {useMenuApi} from '/@/api/menu/index';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/system/menu/dialog.vue'));
const DictTag = defineAsyncComponent(() => import('/@/components/DictTag/index.vue'));


const menuDialogRef = ref();
const state = reactive({
  tableData: {
    data: [] as RouteRecordRaw[],
    loading: true,
  },
  query:{
    menuName:"",
  }
});

// 获取路由数据，真实请从接口获取
const getTableData = async () => {
  state.tableData.loading = true;
  const menuApi = await useMenuApi();
  await menuApi.querymenuRouters().then(value => {
    state.tableData.data = value.data.children;
  });
  setTimeout(() => {
    state.tableData.loading = false;
  }, 100);
};
// 打开新增菜单弹窗
const onOpenAddMenu = (type: string) => {
  menuDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: RouteRecordRaw) => {
  menuDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: RouteRecordRaw) => {
  ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(async () => {
        const menuApi = await useMenuApi();
        await menuApi.delete(row).then(value => {
          let code = value.code;
          if (code != '200') {
            ElMessage.error(value.message);
          } else {
            ElMessage.success(value.message);
          }
        })

        getTableData();
        //await setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
      })
      .catch(() => {
      });
};
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>
