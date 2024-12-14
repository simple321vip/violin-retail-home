<template>
  <div class="dashboard">
    <el-form :model="dialog_form">
      <el-form-item v-show="props.operate_code == Operate.UPDATE" label="ID" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.ID" :disabled="true" />
      </el-form-item>
      <el-form-item label="货品名称" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分类名" :label-width="formLabelWidth">
        <el-select v-model="dialog_form.GoodType" placeholder="Select" size="large">
          <el-option v-for="item in useRetailStore.goodTypes" :key="item.ID" :label="item.Name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Brand" autocomplete="off" />
      </el-form-item>
      <el-form-item label="单位" :label-width="formLabelWidth">
        <el-select v-model="dialog_form.Unit" placeholder="Select" size="large">
          <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="单价" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Price" autocomplete="off" />
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
import { ElMessage, ElSelect, ElOption } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { update, create } from '@/api/goods'
import { Operate } from '@/common/enum'
import { retailStore } from '@/store/modules/retail'
const useRetailStore = retailStore()

const formLabelWidth = '80px'

type Props = {
  dialog_form: any,
  operate_code: Number
}
const props = defineProps<Props>()

const options = [
  "个", "袋", "张", "盒", "箱", "捆",
]

const emit = defineEmits(['on-concel', 'on-submit'])
const concel = () => {
  emit('on-concel')
}
const submit = () => {
  const data = {
    ID: props.dialog_form.ID,
    Name: props.dialog_form.Name,
    Unit: props.dialog_form.Unit,
    Comment: props.dialog_form.Comment,
  }

  if (data.Name == "") {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写货品名称'),
      ]),
      type: 'error'
    })
    return
  }

  if (data.Unit == "") {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写货品名称'),
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
    create(data).then(() => {
      emit('on-submit')
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
</style>