<template>
  <div class="customer">
    <el-form @submit.prevent="doSearch">
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-input v-model="filter" placeholder="输入电话号或者姓名查询" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="doSearch">检索</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="create_dialog">
      <el-button type="primary" @click="handleInsert" v-show="useTenantStore.tenant">新建客户</el-button>
    </div>

    <el-table ref="multipleTableRef" :data="filterSelection" style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="Name" label="客户名称" width="100" />
      <el-table-column prop="Phone" label="客户电话号" width="150" />

      <el-table-column label="新建订单" width="100">
        <template #default="scope">
          <el-icon :size="20" @click="goToOrder(scope.row)" class="click-icon">
            <GoodsFilled />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="修改订单" width="100">
        <template #default="scope">
          <el-icon :size="20" @click="copyNumber(scope.row)" class="click-icon">
            <Edit />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="客户信息操作" width="250">
        <template #default="scope">
          <el-icon :size="20" @click="copyNumber(scope.row)" class="click-icon">
            <CopyDocument />
          </el-icon>
          <el-button class="click-icon" size="small" @click="handleEdit(scope.row)" v-show="useTenantStore.tenant">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-show="useTenantStore.tenant">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="Comment" label="客户备注" width="100" />
    </el-table>

    <el-dialog width="30%" size="small" v-model="dialogFormVisible"
      :title="operate == Operate.UPDATE ? '客户信息更新' : '新建客户'">
      <Dialog :dialog_form="currentDialogData" :operate_code="operate" @on-concel="closeDialog"
        @on-submit="submitCallback" />
    </el-dialog>

    <el-dialog width="20%" size="small" v-model="dialogVisible" title="确认删除么？">
      <delete_dialog :delete_id="currentDialogData.ID" @on-submit="doDelete" @on-concel="closeDialog"></delete_dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h, onMounted } from 'vue'
import { CopyDocument, GoodsFilled, Edit } from "@element-plus/icons-vue"
import { ElNotification, ElButton, ElTable, ElDialog, ElTableColumn, ElIcon, ElForm, ElRow, ElCol, ElFormItem, ElInput } from 'element-plus'
import copy from 'copy-to-clipboard'
import Dialog from './dialog.vue'
import delete_dialog from '@/components/operate/deleteDialog.vue'
import { tenantStore } from '@/store/modules/tenant'
import { retailStore } from '@/store/modules/retail'
import { get, remove } from '@/api/customer'
import { Operate } from '@/common/enum'
import { Customer } from '@/common/entity'
import router from '@/router'
// obtain user infomation 
const useTenantStore = tenantStore()
const useRetailStore = retailStore()

// 表单格式
let filter = ref("")

// 操作code
let operate = ref<Number>(0)

// 响应式dialog数据
const currentDialogData = reactive<Customer>({
} as Customer)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const filterSelection = ref<Customer[]>([])
filterSelection.value = useRetailStore.customers

// dialog表示flag
let dialogFormVisible = ref(false)
let dialogVisible = ref(false)

// Customer 添加
const handleInsert = () => {
  operate.value = Operate.CREATE
  currentDialogData.ID = ''
  currentDialogData.Phone = ''
  currentDialogData.Name = ''
  currentDialogData.Comment = ''
  dialogFormVisible.value = true
}
// Customer 删除
const handleDelete = (target: Customer) => {
  currentDialogData.ID = target.ID
  operate.value = Operate.DELETE;
  dialogVisible.value = true
}
// Customer 编辑
const handleEdit = (target: Customer) => {
  Object.assign(currentDialogData, target)
  operate.value = Operate.UPDATE;
  dialogFormVisible.value = true
}

// doSearch 检索
const doSearch = () => {
  filterSelection.value = useRetailStore.customers.filter(customer => customer.Name.includes(filter.value) || customer.Phone.includes(filter.value))
}

// submitCallback 新增，删除，更新后的Callback
const submitCallback = async () => {
  await useRetailStore.getAllCustomers()
  if (filter.value) {
    filterSelection.value = useRetailStore.customers.filter(customer => customer.Name.includes(filter.value) || customer.Phone.includes(filter.value))
  } else {
    filterSelection.value = useRetailStore.customers
  }
  dialogFormVisible.value = false
  dialogVisible.value = false
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

// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  dialogVisible.value = false
}

// 复制转换成功的数值，并提示 复制成功 信息
const copyNumber = (record: Customer) => {
  copy(record.Phone)
  ElNotification({
    title: '',
    message: h('i', { style: 'color: teal' }, '复制成功'),
  })
}
const goToOrder = (customer: any) => {
  router.push({
    path: 'order',
    query: {
      customer: JSON.stringify(customer),
    },
  })
}

// 数据初始化前，页面不显示
onMounted(async () => {
  // 不存在客户数据时，全件获取客户数据
  if (useRetailStore.customers.length == 0) {
    await useRetailStore.getAllCustomers()
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