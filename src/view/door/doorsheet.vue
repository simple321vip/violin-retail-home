<template>
  <div class="dashboard">
    <el-form :model="dialog_form">
      <el-form-item label="电话号" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="表单名称" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="种类个数" :label-width="formLabelWidth">
        <el-input-number v-model="dialog_form.Amount" :max=1000 :min=0 :value-on-clear=0>
          <template #suffix>
            <span>个</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="总面积" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.TotalArea" autocomplete="off" disabled />
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
import { update, create } from '@/api/door'
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber, ElMessage } from 'element-plus'
import { Operate } from '@/common/enum';
import { retailStore } from '@/store/modules/retail'
import { ref, h } from 'vue';
import { Door, DoorSheet } from '@/common/entity';

const useRetailStore = retailStore()
const formLabelWidth = '80px'

type Props = {
  dialog_form: DoorSheet,
  operate_code: Number
}
const props = defineProps<Props>()

const emit = defineEmits(['on-concel', 'on-submit'])
const concel = () => {
  emit('on-concel')
}
const submit = () => {
  let phones = useRetailStore.customers.map(item => item.Phone)
  if (phones.includes(props.dialog_form.Phone)) {
    if (props.dialog_form.Name === undefined || props.dialog_form.Name.length == 0) {
      console.log(2)
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
          h('span', null, '表单名称必须输入'),
        ]),
        type: 'error'
      })
      return
    }

    if (props.dialog_form.Amount === undefined || props.dialog_form.Amount < props.dialog_form.Doors.length) {
      console.log(1)
      ElMessage({
        message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
          h('span', null, '柜门数量只能增加不能减少, 或者不能为空'),
        ]),
        type: 'error'
      })
      return
    }
    if (props.operate_code == Operate.UPDATE) {
      update(props.dialog_form.ID, props.dialog_form).then(() => {
        emit('on-submit')
      })
    } else if (props.operate_code == Operate.CREATE) {
      create(props.dialog_form).then((res) => {
        emit('on-submit', res.data)
      })
    }
  } else {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '电话号不存在，请重新输入'),
      ]),
      type: 'error'
    })
    return
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