<template>
  <div class="dashboard">
    <el-form :model="dialog_form">
      <el-form-item label="品牌名称" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Comment" autocomplete="off" />
      </el-form-item>
    </el-form>
    <!-- <template #footer> -->
    <span class="dialog-footer">
      <el-button @click="concel">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </span>
    <!-- </template> -->
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { ElMessage } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { update, create } from '@/api/brand'
import { Operate } from '@/common/enum'
import { retailStore } from '@/store/modules/retail'
import { CheckNameExist } from '@/service/search'
const useRetailStore = retailStore()

const formLabelWidth = '80px'

type Props = {
  dialog_form: any,
  operate_code: Number
}
const props = defineProps<Props>()

const emit = defineEmits(['on-concel', 'on-submit'])
const concel = () => {
  emit('on-concel')
}
const submit = () => {
  const data = {
    ID: props.dialog_form.ID,
    Name: props.dialog_form.Name,
    Comment: props.dialog_form.Comment,
  }

  if (data.Name == "") {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写品牌名称'),
      ]),
      type: 'error'
    })
    return
  }
  if (CheckNameExist(useRetailStore.brands, data, props.operate_code)) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '品牌已存在'),
      ]),
      type: 'error'
    })
    return
  }

  if (props.operate_code == Operate.UPDATE) {
    update(data.ID, data).then((res) => {
      emit('on-submit', res.data)
    })
  } else if (props.operate_code == Operate.CREATE) {
    create(data).then((res) => {
      emit('on-submit', res.data)
    })
  }
}


</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}

.el-input {
  width: 150px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>@/api/goodType