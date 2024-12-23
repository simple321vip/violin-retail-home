<template>
  <div class="master">
    <el-form>
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-input v-model="filter" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="doSearch">检索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="create_dialog">
      <el-button type="primary" @click="handleInsert">新建货物</el-button>
    </div>
    <el-table :data="filterGoods" style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="Name" label="货品名称" width="100" />
      <el-table-column prop="GoodType" label="大分类" width="100" :formatter="formatterBig" />
      <el-table-column prop="GoodType" label="小分类" width="100" :formatter="formatterSmall" />
      <el-table-column prop="Brand" label="品牌" width="100" :formatter="formatterBrand" />
      <el-table-column prop="Price" label="参考零售价" width="100" />
      <el-table-column prop="Unit" label="单位" width="60" />
      <el-table-column label="操作">
        <template #default="scope">
          <!-- <el-icon :size="20" @click="copyNumber(scope.row)" class="click-icon">
            <CopyDocument />
          </el-icon> -->
          <el-button class="click-icon" size="small" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="30%" size="small" v-model="dialogFormVisible" :title="operate == Operate.UPDATE ? '分类更新' : '新建分类'">
      <Dialog :dialog_form="currentDialogData" :operate_code="operate" @on-concel="closeDialog" @on-submit="doSubmit" />
    </el-dialog>

    <el-dialog width="20%" size="small" v-model="dialogVisible" title="确认删除么？">
      <delete_dialog :delete_id="currentDialogData.ID" @on-submit="doDelete" @on-concel="closeDialog"></delete_dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h, onMounted } from 'vue'
import { CopyDocument } from "@element-plus/icons-vue"
import { ElNotification, ElButton, ElTable, ElDialog, ElTableColumn, ElIcon, ElTag, ElFormItem, ElInput } from 'element-plus'
import Dialog from './dialog.vue'
import delete_dialog from '@/components/operate/deleteDialog.vue'
import { GoodType, Goods, Brand } from '@/common/entity'
import { retailStore } from '@/store/modules/retail'
import { get, remove } from '@/api/goods'
import { Operate } from '@/common/enum'
import { formatterBig, formatterSmall, formatterBrand } from '@/service/formatter'
const useRetailStore = retailStore()

// 表单格式
let filter = ref("")

// 操作code
let operate = ref<Number>(0)

// 响应式dialog数据
let currentDialogData = ref({} as any)

// 全部货物，非显示
const filterGoods = ref<Goods[]>([])


// dialog表示flag
let dialogFormVisible = ref(false)
let dialogVisible = ref(false)

// 操作-》添加
const handleInsert = () => {
  operate.value = Operate.CREATE
  Object.assign(currentDialogData.value = {}, {})
  dialogFormVisible.value = true
}
// 操作-》删除
const handleDelete = (target: GoodType) => {
  currentDialogData.value = target
  operate.value = Operate.DELETE;
  dialogVisible.value = true

}
// 操作-》编辑
const handleEdit = (target: Goods) => {
  console.log(target)
  Object.assign(currentDialogData.value, target)
  operate.value = Operate.UPDATE;
  dialogFormVisible.value = true
}

const closeDialog = () => {
  dialogFormVisible.value = false
  dialogVisible.value = false
}

// doSearch 执行检索
const doSearch = () => {
  filterGoods.value = useRetailStore.goods.filter(good => good.Name.includes(filter.value))
}

// doDelete 执行删除
const doDelete = async (delete_id: any) => {
  let ID = delete_id
  await remove(ID)
    .then(async () => {
      await submitCallback()
    }).finally(() => {
      dialogVisible.value = false
    })
}

// doDelete 执行提交
const doSubmit = async () => {
  useRetailStore.goods.length = 0
  await useRetailStore.getAllGoods()
  closeDialog()
}

// submitCallback 新增，删除，更新后的Callback
const submitCallback = async () => {
  await useRetailStore.getAllGoods()
  if (filter.value) {
    filterGoods.value = useRetailStore.goods.filter(good => good.Name.includes(filter.value))
  } else {
    filterGoods.value = useRetailStore.goods
  }
  dialogFormVisible.value = false
  dialogVisible.value = false
}

// 数据加载
onMounted(async () => {
  if (useRetailStore.goodTypes.length == 0) {
    await useRetailStore.getAllGoodTypes()
  }
  if (useRetailStore.brands.length == 0) {
    await useRetailStore.getAllBrands()
  }
  if (useRetailStore.goods.length == 0) {
    await useRetailStore.getAllGoods()
  }
  filterGoods.value = useRetailStore.goods
})
</script>

<style scoped>
.tag_list {
  display: flex;
  border-top: 1px solid rgba(151, 151, 151, 0.3);
  border-bottom: 1px solid rgba(151, 151, 151, 0.3);
}

.click-icon {
  width: 40px;
  margin: 10px;
  cursor: pointer;
}

.create_dialog {
  margin: 10px;
}
</style>