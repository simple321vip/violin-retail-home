<template>
  <div class="master">
    <div class="create_dialog">
      <el-button type="primary" @click="handleInsert">新建大分类</el-button>
    </div>

    <el-table :row-key="getRowKey" :data="useRetailStore.goodTypes" style="width: 100%">
      <el-table-column prop="ID" label="序号" :formatter="formatID" width="60" />
      <el-table-column prop="Name" label="分类名称" :formatter="formatName" width="200" />
      <el-table-column prop="Comment" label="备注" width="120" />
      <el-table-column label="增加子分类" width="150">
        <template #default="scope">
          <el-button v-show="scope.row.Rank < 2" size="small" @click="handleSub(scope.row)">增加小分类
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button class="click-icon" size="small" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="30%" size="small" v-model="createDialogVisible" title="新建分类">
      <Dialog :dialog_form="currentDialogData" :operate_code="operate" @on-concel="closeDialog"
        @on-submit="submitCallback" />
    </el-dialog>

    <el-dialog width="30%" size="small" v-model="updateDialogVisible" title="分类更新">
      <UpdateDialog :dialog_form="currentDialogData" :operate_code="operate" @on-concel="closeDialog"
        @on-submit="submitCallback" />
    </el-dialog>

    <el-dialog width="20%" size="small" v-model="dialogVisible" title="确认删除么？">
      <delete_dialog :delete_id="currentDialogData.ID" @on-submit="doDelete" @on-concel="closeDialog">
      </delete_dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElButton, ElTable, ElDialog, ElTableColumn } from 'element-plus'
import Dialog from './dialog.vue'
import UpdateDialog from './updateDialog.vue'
import delete_dialog from '@/components/operate/deleteDialog.vue'
import { retailStore } from '@/store/modules/retail'
import { remove, update } from '@/api/goodType'
import { Operate } from '@/common/enum'
import { GoodType } from '@/common/entity'

const useRetailStore = retailStore()

// 操作code
let operate = ref<Number>(0)
// 响应式dialog数据
let currentDialogData = ref({} as any)
// dialog表示flag
let updateDialogVisible = ref(false)
let createDialogVisible = ref(false)
let dialogVisible = ref(false)

// 生成Row-key
const getRowKey = (row: GoodType) => {
  return row.ID + "_" + row.Rank
}
// ID格式化显示
const formatID = (row: any, column: any) => {
  if (row.Rank == 1) {
    return row.ID
  }
  return
}
// 分类格式化显示
const formatName = (row: any, column: any) => {
  if (row.Rank == 1) {
    return row.Name
  }
  if (row.Rank == 2) {
    return row.ID + "　　" + row.Name
  }
}
// handleInsert 一级分类创建
const handleInsert = () => {
  operate.value = Operate.CREATE
  Object.assign(currentDialogData.value = {}, { Rank: 1, children: [] })
  createDialogVisible.value = true
}
// 操作-》删除
const handleDelete = (target: GoodType) => {
  currentDialogData.value = target
  operate.value = currentDialogData.value.Rank == 1 ? operate.value = Operate.DELETE : operate.value = Operate.UPDATE
  dialogVisible.value = true
}
// 操作-》编辑
const handleEdit = (target: GoodType) => {
  Object.assign(currentDialogData.value = {}, target)
  operate.value = Operate.UPDATE;
  updateDialogVisible.value = true
}
// 新增小分类
const handleSub = (target: GoodType) => {
  Object.assign(currentDialogData.value = {}, {
    Rank: target.Rank + 1,
    Parent: target,
  })
  operate.value = Operate.UPDATE;
  createDialogVisible.value = true
}

const doDelete = async (ID: any) => {
  if (operate.value == Operate.DELETE) {
    await remove(ID).then((res) => {
      submitCallback(res.data)
    }).finally(() => {
      dialogVisible.value = false
    })
  } else {
    currentDialogData.value.Parent.children = currentDialogData.value.Parent.children.filter((item: GoodType) => item.ID !== ID)
    const data = {
      ID: currentDialogData.value.Parent.ID,
      Name: currentDialogData.value.Parent.Name,
      Rank: currentDialogData.value.Parent.Rank,
      Comment: currentDialogData.value.Parent.Comment,
      children: Array()
    } as GoodType
    currentDialogData.value.Parent.children.forEach((item: any) => {
      data.children.push({
        ID: item.ID,
        Name: item.Name,
        Comment: item.Comment,
        Rank: item.Rank,
      } as GoodType)
    })
    await update(ID, data).then((res) => {
      submitCallback(res.data)
    }).finally(() => {
      dialogVisible.value = false
    })
  }
}

const closeDialog = () => {
  createDialogVisible.value = false
  updateDialogVisible.value = false
  dialogVisible.value = false
}

// submitCallback 增删改查后的回调
const submitCallback = (data: any) => {
  useRetailStore.goodTypes.length = 0
  data.forEach((item: GoodType) => {
    useRetailStore.goodTypes.push(item)
  })
  useRetailStore.goodTypes.forEach(goodType => {
    goodType.children.forEach(sub => {
      sub.Parent = goodType
    })
  })
  closeDialog()
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