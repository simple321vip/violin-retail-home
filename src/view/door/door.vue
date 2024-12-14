<template>
  <div class="dashboard">
    <el-form :model="door">
      <el-form-item label="柜门名称" :label-width="formLabelWidth">
        <el-input v-model="door.Name" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="柜门长度" :label-width="formLabelWidth">
        <el-input-number v-model="door.Length" :max=3000 :min=0 :value-on-clear=0 @change="calculateArea()">
          <template #suffix>
            <span>mm</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="柜门宽度" :label-width="formLabelWidth">
        <el-input-number v-model="door.Width" :max=3000 :min=0 :value-on-clear=0 @change="calculateArea()">
          <template #suffix>
            <span>mm</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="柜门数量" :label-width="formLabelWidth">
        <el-input-number v-model="door.Amount" :max=1000 :min=0 :value-on-clear=0 @change="calculateArea()">
          <template #suffix>
            <span>个</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="柜门面积" :label-width="formLabelWidth">
        <el-input-number v-model="door.Area" disabled>
          <template #suffix>
            <span>m2</span>
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="door.Comment" autocomplete="off" />
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
import { update } from '@/api/door'
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber } from 'element-plus'
import { Door } from '@/common/entity';

const formLabelWidth = '80px'

type Props = {
  door: Door,
  operate_code: Number
}
const props = defineProps<Props>()

const emit = defineEmits(['on-concel', 'on-submit'])
const concel = () => {
  emit('on-concel')
}
const submit = () => {
  emit('on-submit', props.door)
}

const calculateArea = () => {
  if (typeof props.door.Length === "number" && typeof props.door.Width === "number" && typeof props.door.Amount === "number") {
    let area = props.door.Width * props.door.Length * props.door.Amount / 1000 / 1000
    props.door.Area = Number(area.toFixed(2))
  }
}
</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}

.el-input {
  width: 250px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>