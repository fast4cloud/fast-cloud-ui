<template>
  <div>
    <template v-for="(item, index) in state.options">
      <template v-if="values.includes(item.dictValue)">
        <span
            v-if="item.listClass == 'default' || item.listClass == ''"
            :key="item.dictValue"
            :index="index"
            :class="item.cssClass"
        >{{ item.dictLabel + ' ' }}</span
        >
        <el-tag
            v-else
            :disable-transitions="true"
            :key="item.dictValue"
            :index="index"
            :type="item.listClass == 'primary' ? '' : item.listClass"
            :class="item.cssClass"
        >
          {{ item.dictLabel + ' ' }}
        </el-tag>
      </template>
    </template>

  </div>
</template>
<script setup lang="ts" name="dictTag">
import {reactive, ref, onMounted, computed} from 'vue';
import DictUtil from '/@/utils/DictUtil';
// 定义父组件传过来的值
const props = defineProps({
  dictType: {
    type: String,
    default: "",
  },
  value: [Number, String, Array],
  // 当未找到匹配的数据时，显示value
  showValue: {
    type: Boolean,
    default: true,
  }

});
const state = reactive({
  unmatchArray: [],
  options:[]
});
const values = computed(() => {
  // https://gitee.com/lyt-top/ fast-cloud-ui/issues/I6AF8P
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  } else {
    return [];
  }
});
onMounted(async () => {
  let dictType = props.dictType;
  let dict = new DictUtil();
  await dict.getDictByType(dictType).then(value => {
    state.options = value;
  });
})
const dictType = computed(() => {

  return false;
});

</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
