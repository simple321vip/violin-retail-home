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
      <el-button type="primary" @click="handleInsert" v-show="useTenantStore.tenant">新建分类</el-button>
    </div>

    <el-table ref="multipleTableRef" :data="useRetailStore.customers" @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="Name" label="名称" width="100" />
      <el-table-column prop="Comment" label="备注" width="60" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-icon :size="20" @click="copyNumber(scope.row)" class="click-icon">
            <CopyDocument />
          </el-icon>
          <el-button class="click-icon" size="small" @click="handleEdit(scope.$index, scope.row)"
            v-show="useTenantStore.tenant">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
            v-show="useTenantStore.tenant">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="30%" size="small" v-model="dialogFormVisible" :title="operate == Operate.UPDATE ? '分类更新' : '新建分类'">
      <Dialog :dialog_form="currentDialogData" :operate_code="operate" @on-concel="closeDialog" @on-submit="doSubmit" />
    </el-dialog>

    <el-dialog width="20%" size="small" v-model="dialogVisible" title="确认删除么？">
      <delete_dialog :delete_id="currentDialogData.ID" @on-submit="doDelete"></delete_dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h, onMounted } from 'vue'
import { CopyDocument } from "@element-plus/icons-vue"
import { ElNotification, ElButton, ElTable, ElDialog, ElTableColumn, ElIcon, ElForm, ElRow, ElCol, ElFormItem, ElInput } from 'element-plus'
import Dialog from './dialog.vue'
import delete_dialog from '@/components/operate/deleteDialog.vue'
import { tenantStore } from '@/store/modules/tenant'
import { retailStore } from '@/store/modules/retail'
import { get, remove } from '@/api/good_type'
import { Operate } from '@/common/enum'
import { GoodType } from '@/common/entity'
// obtain user infomation 
const useTenantStore = tenantStore()
const useRetailStore = retailStore()

// 表单格式
let filter = ref("")

// 操作code
let operate = ref<Number>(0)

// 响应式dialog数据
const currentDialogData = reactive<GoodType>({
  ID: "",
  Name: '',
  Comment: '',
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<GoodType[]>([])

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
const handleDelete = (index: number, target: GoodType) => {
  currentDialogData.ID = target.ID
  operate.value = Operate.DELETE;
  dialogVisible.value = true
}
// 操作-》编辑
const handleEdit = (index: number, target: GoodType) => {
  Object.assign(currentDialogData, target)
  operate.value = Operate.UPDATE;
  dialogFormVisible.value = true
}

const handleSelectionChange = (val: GoodType[]) => {
  multipleSelection.value = val
}

const doSearch = () => {

}

const doDelete = (delete_id: any) => {
  let query = delete_id
  remove(query).then((res) => {
    useRetailStore.customers.length = 0
    res.data.forEach((customer: GoodType) => {
      // useRetailStore.customers.push(customer)
    })
  }).finally(() => {
    dialogVisible.value = false
  })
}

const closeDialog = () => {
  dialogFormVisible.value = false
}
const doSubmit = (data: any) => {
  useRetailStore.customers.length = 0
  data.forEach((customer: GoodType) => {
    // useRetailStore.customers.push(customer)
  })
  dialogFormVisible.value = false
}
// 复制转换成功的数值，并提示 复制成功 信息
const copyNumber = (record: GoodType) => {
  ElNotification({
    title: '',
    message: h('i', { style: 'color: teal' }, '复制成功'),
  })
}
// 数据初始化前，页面不显示
onMounted(async () => {
  await useRetailStore.getAllCustomers()
});
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
</style>@/store/modules/retail