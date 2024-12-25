<template>
  <div class="dashboard">
    <el-form :model="dialog_form">
      <el-form-item label="大分类名:" v-if="dialog_form.Rank > 1" :label-width="formLabelWidth">
        <el-text class="mx-1" type="danger">{{ dialog_form.Parent.Name }}</el-text>
      </el-form-item>
      <el-form-item label="分类名:" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备　注:" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Comment" autocomplete="off" />
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="concel">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { h, toRaw } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElText } from 'element-plus'
import { update, create } from '@/api/goodType'
import { Operate } from '@/common/enum'
import { retailStore } from '@/store/modules/retail'
import { CheckNameExist } from '@/service/search'
import { GoodType } from '@/common/entity'
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
  if (props.dialog_form.Name == "" || props.dialog_form.Name == undefined) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写分类名称'),
      ]),
      type: 'error'
    })
    return
  }
  let nameExist = false
  if (props.dialog_form.Rank == 2) {
    nameExist = CheckNameExist(props.dialog_form.Parent.children, props.dialog_form, props.operate_code)
  } else {
    nameExist = CheckNameExist(useRetailStore.goodTypes, props.dialog_form, props.operate_code)
  }
  if (nameExist) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '分类名称已存在'),
      ]),
      type: 'error'
    })
    return
  }
  // 小分类
  let parent: GoodType
  if (props.dialog_form.Rank == 2) {
    parent = {
      ID: props.dialog_form.Parent.ID,
      Name: props.dialog_form.Parent.Name,
      Comment: props.dialog_form.Parent.Comment,
      Rank: props.dialog_form.Parent.Rank,
      children: Array(0)
    } as GoodType
    props.dialog_form.Parent.children.forEach((item: any) => {
      parent.children.push({
        ID: item.ID,
        Name: item.Name,
        Comment: item.Comment,
        Rank: item.Rank,
      } as GoodType)
    })

    let child = {
      Name: props.dialog_form.Name,
      Rank: props.dialog_form.Rank,
      Comment: props.dialog_form.Comment ? props.dialog_form.Comment : "",
    } as any
    if (parent.children.length == 0) {
      child.ID = 0
    } else {
      child.ID = Math.max(...parent.children.map(goodType => goodType.ID)) + 1
    }
    parent.children.push(child)
    // 大分类
  } else {
    parent = {
      ID: props.dialog_form.ID,
      Name: props.dialog_form.Name,
      Comment: props.dialog_form.Comment,
      Rank: props.dialog_form.Rank,
      children: Array(0)
    } as GoodType
    props.dialog_form.children.forEach((item: any) => {
      parent.children.push({
        ID: item.ID,
        Name: item.Name,
        Comment: item.Comment,
        Rank: item.Rank,
      } as GoodType)
    })
  }
  if (props.operate_code == Operate.UPDATE) {
    update(parent.ID, parent).then((res) => {
      emit('on-submit', res.data)
    })
  } else if (props.operate_code == Operate.CREATE) {
    create(parent).then((res) => {
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