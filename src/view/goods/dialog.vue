<template>
  <div class="dashboard">
    <el-form :model="dialog_form">
      <el-form-item label="货品名称" :label-width="formLabelWidth">
        <el-input v-model="dialog_form.Name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="大分类" :label-width="formLabelWidth">
        <el-select v-model="BigGoodType" value-key="ID" placeholder="Select" size="large" @change="OnSelect">
          <el-option v-for="item in useRetailStore.goodTypes" :key="item.ID" :label="item.Name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="小分类" :label-width="formLabelWidth">
        <el-select v-model="SmallGoodType" value-key="ID" placeholder="Select" size="large">
          <el-option v-for="item in smallGoodTypes" :key="item.ID" :label="item.Name" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" :label-width="formLabelWidth">
        <el-select v-model="selectBrand" placeholder="Select" value-key="ID" size="large">
          <el-option v-for="item in useRetailStore.brands" :key="item.ID" :label="item.Name" :value="item" />
        </el-select>
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
import { h, reactive, ref } from 'vue'
import { ElMessage, ElSelect, ElOption } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { update, create } from '@/api/goods'
import { Operate } from '@/common/enum'
import { retailStore } from '@/store/modules/retail'
import { Brand, GoodType } from '@/common/entity'
const useRetailStore = retailStore()

const formLabelWidth = '80px'

type Props = {
  dialog_form: any,
  operate_code: Number
}
const props = defineProps<Props>()
// 大分类选中值
let BigGoodType = ref<GoodType>()
// 小分类选中值
let SmallGoodType = ref<GoodType>()
// 品牌选中值
let selectBrand = ref<Brand>()
// 小分类下拉列表
const smallGoodTypes = reactive<GoodType[]>([])
if (props.operate_code == Operate.UPDATE) {
  BigGoodType.value = useRetailStore.goodTypes.find(goodType => goodType.ID == props.dialog_form.BigGoodType)
  if (props.dialog_form.SmallGoodType != undefined) {
    smallGoodTypes.length = 0
    BigGoodType.value?.children.forEach(child => smallGoodTypes.push(child))
    SmallGoodType.value = BigGoodType.value?.children.find(goodType => goodType.ID == props.dialog_form.SmallGoodType)
  }
  if (props.dialog_form.Brand != undefined) {
    selectBrand.value = useRetailStore.brands.find(brand => brand.ID == props.dialog_form.Brand)
  }
}

const options = [
  "个", "袋", "张", "盒", "箱", "捆",
]

const emit = defineEmits(['on-concel', 'on-submit'])
const concel = () => {
  emit('on-concel')
}
const submit = () => {

  if (props.dialog_form.Name == "" || props.dialog_form.Name == undefined) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写货品名称'),
      ]),
      type: 'error'
    })
    return
  }

  if (BigGoodType.value == undefined) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请选择大分类'),
      ]),
      type: 'error'
    })
    return
  }

  if (selectBrand.value == undefined) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请选择品牌'),
      ]),
      type: 'error'
    })
    return
  }

  if (props.dialog_form.Unit == "" || props.dialog_form.Unit == undefined) {
    ElMessage({
      message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
        h('span', null, '请填写单位'),
      ]),
      type: 'error'
    })
    return
  }

  const data = {
    ID: props.dialog_form.ID,
    Name: props.dialog_form.Name,
    Price: Number(props.dialog_form.Price),
    BigGoodType: BigGoodType.value.ID,
    SmallGoodType: SmallGoodType.value?.ID,
    Brand: selectBrand.value.ID,
    Unit: props.dialog_form.Unit,
    Comment: props.dialog_form.Comment,
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

const OnSelect = (value: any) => {
  let goodType = useRetailStore.goodTypes.find(goodType => goodType.ID == value.ID)
  smallGoodTypes.length = 0
  if (goodType) {
    goodType.children.forEach(item => {
      smallGoodTypes.push(item)
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