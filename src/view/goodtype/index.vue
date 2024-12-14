<template>
  <div class="master">
    <div class="create_dialog">
      <el-button type="primary" @click="handleInsert">新建货物分类</el-button>
    </div>

    <el-table ref="multipleTableRef" :data="useRetailStore.goodTypes" style="width: 100%">
      <el-table-column prop="ID" label="序号" width="60" />
      <el-table-column prop="Name" label="分类名称" width="120" />
      <el-table-column prop="Comment" label="备注" width="120" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button class="click-icon" size="small" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="30%" size="small" v-model="dialogFormVisible" :title="operate == Operate.UPDATE ? '分类更新' : '新建分类'">
      <Dialog :dialog_form="currentDialogData" :operate_code="operate" @on-concel="closeDialog"
        @on-submit="submitCallback" />
    </el-dialog>

    <el-dialog width="20%" size="small" v-model="dialogVisible" title="确认删除么？">
      <delete_dialog :delete_id="currentDialogData.ID" @on-submit="doDelete"></delete_dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElButton, ElTable, ElDialog, ElTableColumn } from 'element-plus'
import Dialog from './dialog.vue'
import delete_dialog from '@/components/operate/deleteDialog.vue'
import { retailStore } from '@/store/modules/retail'
import { remove } from '@/api/goodType'
import { Operate } from '@/common/enum'
import { GoodType } from '@/common/entity'

const useRetailStore = retailStore()

// 操作code
let operate = ref<Number>(0)
// 响应式dialog数据
const currentDialogData = reactive<GoodType>({} as GoodType)
// dialog表示flag
let dialogFormVisible = ref(false)
let dialogVisible = ref(false)

// 操作-》添加
const handleInsert = () => {
  operate.value = Operate.CREATE
  currentDialogData.ID = ''
  currentDialogData.Name = ''
  currentDialogData.Comment = ''
  dialogFormVisible.value = true
}
// 操作-》删除
const handleDelete = (target: GoodType) => {
  currentDialogData.ID = target.ID
  operate.value = Operate.DELETE;
  dialogVisible.value = true
}
// 操作-》编辑
const handleEdit = (target: GoodType) => {
  Object.assign(currentDialogData, target)
  operate.value = Operate.UPDATE;
  dialogFormVisible.value = true
}

const doDelete = async (ID: any) => {
  await remove(ID).then((res) => {
    submitCallback(res.data)
  }).finally(() => {
    dialogVisible.value = false
  })
}

const closeDialog = () => {
  dialogFormVisible.value = false
  dialogVisible.value = false
}

// submitCallback 增删改查后的回调
const submitCallback = (data: any) => {
  useRetailStore.goodTypes.length = 0
  data.forEach((goodType: GoodType) => {
    useRetailStore.goodTypes.push(goodType)
  })
  dialogFormVisible.value = false
}

// 数据初始化前，页面不显示
onMounted(async () => {
  if (useRetailStore.goodTypes.length == 0) {
    await useRetailStore.getAllGoodTypes()
  }
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