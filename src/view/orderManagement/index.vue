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
    <el-table :data="useRetailStore.orders" style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="Date" label="订单日期" width="100" />
      <el-table-column prop="CustomerName" label="客户名称" width="100" />
      <el-table-column prop="CustomerPhone" label="客户电话" width="100" />
      <el-table-column prop="status" label="订单状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.Status == undefined || scope.row.Status == 0" size="large">进行中</el-tag>
          <el-tag v-if="scope.row.Status == 1" size="large" type="success">完成</el-tag>
          <el-tag v-if="scope.row.Status == 2" size="large">取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-icon :size="20" @click="doView(scope.row)" class="click-icon">
            <FullScreen />
          </el-icon>
          <el-button class="click-icon" size="small" v-if="scope.row.Status == undefined || scope.row.Status == 0"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" v-if="scope.row.Status == undefined || scope.row.Status == 0"
            @click="handleDelete(scope.row)">取消
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="Comment" label="备注" width="60" />
    </el-table>

    <el-dialog width="20%" size="small" v-model="dialogVisible" title="确认删除么？">
      <delete_dialog :delete_id="selectedDialogData.ID" @on-submit="doDelete"></delete_dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { FullScreen } from "@element-plus/icons-vue"
import { ElButton, ElTable, ElDialog, ElTableColumn, ElTag, ElIcon, ElForm, ElFormItem, ElInput } from 'element-plus'
import { Order } from '@/common/entity'
import { retailStore } from '@/store/modules/retail'
import { get, remove } from '@/api/order'
import { Operate } from '@/common/enum'

const useRetailStore = retailStore()

// 表单格式
let filter = ref("")
let dialogVisible = ref(false)

let selectedDialogData = ref({} as any)
const selectedOrders = reactive<Order[]>([])
// 获取柜门表单一览
const doSearch = async () => {
  if (useRetailStore.orders.length == 0) {
    await useRetailStore.getAllOrders()
  }

}
const doView = async (ID: any) => {

}
const doDelete = async (ID: any) => {

}
// 操作-》删除
const handleDelete = (target: Order) => {
  selectedDialogData.value = target
  dialogVisible.value = true
}
// 操作-》编辑
const handleEdit = (target: Order) => {

}
// 数据初始化前，页面不显示
onMounted(async () => {
  if (useRetailStore.orders.length == 0) {
    await useRetailStore.getAllOrders()
  }

  if (filter.value == undefined || filter.value == "") {
    useRetailStore.orders.forEach(order => {
      selectedOrders.push(order)
    })
  } else {
    useRetailStore.orders.forEach(order => {
      if (order.CustomerName == filter.value || order.ID == parseInt(filter.value)) {
        selectedOrders.push(order)
      }
    })
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