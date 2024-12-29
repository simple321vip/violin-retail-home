<template>
  <div class="dashboard" title="xxx">
    <el-form :model="dialog_form" text="xxxx">
      <el-form-item v-show="props.operate_code == Operate.UPDATE" label="ID" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.ID" :disabled="true" />
      </el-form-item>
      <el-form-item label="电话号" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Comment" autocomplete="off" />
      </el-form-item>
    </el-form>
    <!-- <template #footer> -->
    <span class="dialog-footer">
      <el-button @click="concel">取消</el-button>
      <el-button type="primary" :disabled="isClicked" @click="submit">提交</el-button>
    </span>
    <!-- </template> -->
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { ElMessage } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { update, create } from '@/api/customer'
import { Operate } from '@/common/enum'
import { isPhoneNumber } from '@/utils/number'
import { CheckPhoneExist } from '@/service/search'
import { retailStore } from '@/store/modules/retail'
const useRetailStore = retailStore()

const formLabelWidth = '80px'

type Props = {
  dialog_form: any,
  operate_code: Number
}
const props = defineProps<Props>()
let isClicked = ref(false)

const emit = defineEmits(['on-concel', 'on-submit'])
const concel = () => {
  emit('on-concel')
}
const submit = () => {
  isClicked.value = true
  setTimeout(() => {
    isClicked.value = false;
  }, 2000)

  const data = {
    ID: props.dialog_form.ID,
    Phone: props.dialog_form.Phone,
    Name: props.dialog_form.Name,
    Comment: props.dialog_form.Comment,
  }


  if (data.Name == "" || data.Phone == "") {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写电话号和姓名'),
      ]),
      type: 'error'
    })
    return
  }
  if (!isPhoneNumber(data.Phone)) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '电话格式不正确，请输入正确的11位电话号'),
      ]),
      type: 'error'
    })
    return
  }

  if (CheckPhoneExist(useRetailStore.customers, data, props.operate_code)) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '电话号已存在'),
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
      emit('on-submit', res)
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