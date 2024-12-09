<template>
  <div class="door">
    <!-- 解决回车键 刷新页面问题@submit.native.prevent -->
    <el-form @submit.prevent="doSearchDoorSheets">
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-input v-model="filter" placeholder="请输入手机号，或者客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="doSearchDoorSheets">柜门查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="create_dialog">
      <el-button type="primary" @click="createDoorSheet" v-show="useTenantStore.tenant">新建柜门表单</el-button>
    </div>

    <el-table :data="doorSheets" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="ID" label="序号" width="60" />
      <el-table-column prop="Name" label="表单名称" width="100" />
      <el-table-column prop="Phone" label="电话号" width="180" />
      <el-table-column prop="Amount" label="总柜门量" width="100" />
      <el-table-column prop="TotalArea" label="总面积/m2" width="100" />
      <el-table-column prop="Comment" label="备注" width="200" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button class="click-icon" size="small" @click="editDoorSheet(scope.row)" v-show="useTenantStore.tenant">编辑
          </el-button>
          <el-button class="click-icon" size="small" @click="deleteDoorSheet(scope.row)" v-show="useTenantStore.tenant">删除
          </el-button>
          <el-button class="click-icon" size="small" @click="getDoorSheet(scope.row)" v-show="useTenantStore.tenant">查看明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="doors" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column prop="Name" label="名称" width="100" />
      <el-table-column prop="Length" label="长/cm" width="100" />
      <el-table-column prop="Width" label="宽/cm" width="100" />
      <el-table-column prop="Amount" label="数量/张" width="100" />
      <el-table-column prop="Area" label="面积m2" width="100" />
      <el-table-column prop="Comment" label="备注" width="180" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button class="click-icon" size="small" @click="editDoor(scope.row)" v-show="useTenantStore.tenant">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="30%" size="small" v-model="doorSheetDialogVisible" :title="title">
      <DoorsheetDialog :dialog_form="currentDoorSheet" :operate_code="operate" @on-concel="closeDialog"
        @on-submit="doSearchDoorSheets" />
    </el-dialog>

    <el-dialog width="30%" size="small" v-model="doorDialogVisible" :title="title">
      <DoorDialog :door="currentDoor" :operate_code="operate" @on-concel="closeDialog" @on-submit="doSubmitDoor" />
    </el-dialog>

    <el-dialog width="20%" size="small" v-model="deleteDialogVisible" title="确认删除么？">
      <DeleteDialog :delete_id="currentDoorSheet.ID" @on-submit="doDelete" @on-concel="closeDialog" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h } from 'vue'
import { CopyDocument } from "@element-plus/icons-vue"
import { ElButton, ElTable, ElDialog, ElTableColumn, ElForm, ElRow, ElCol, ElFormItem, ElInput } from 'element-plus'
import copy from 'copy-to-clipboard'
import DoorsheetDialog from './doorsheet.vue'
import DoorDialog from './door.vue'
import DeleteDialog from '@/components/operate/deleteDialog.vue'
import { tenantStore } from '@/store/modules/tenant'
import { retailStore } from '@/store/modules/retail'
import { get, update, remove, getByFilter } from '@/api/Door'
import { Operate } from '@/common/enum'
import { Door, DoorSheet } from '@/common/entity'

// obtain user infomation 
const useTenantStore = tenantStore()
const useRetailStore = retailStore()

// query
let filter = ref("")
// title
let title = ref("")
// 操作code
let operate = ref<Number>(0)

// 柜门相应数据
const doorSheets = reactive<DoorSheet[]>([])
const doors = reactive<Door[]>([])

// 响应式dialog数据
let currentDoorSheet = ref<DoorSheet>({} as DoorSheet)
let currentDoor = ref<Door>({} as Door)

// 
let doorDialogVisible = ref(false)
let doorSheetDialogVisible = ref(false)
let deleteDialogVisible = ref(false)

// DoorSheet 增加
const createDoorSheet = () => {
  title.value = "新建柜门表单"
  operate.value = Operate.CREATE
  currentDoorSheet.value = {} as DoorSheet
  doorSheetDialogVisible.value = true
}
// DoorSheet 删除
const deleteDoorSheet = (target: DoorSheet) => {
  currentDoorSheet.value = target
  operate.value = Operate.DELETE;
  deleteDialogVisible.value = true
}
// DoorSheet 编辑
const editDoorSheet = (doorSheet: DoorSheet) => {
  title.value = "修改柜门表单"
  Object.assign(currentDoorSheet.value, doorSheet)
  operate.value = Operate.UPDATE;
  doorSheetDialogVisible.value = true
}
// DoorSheet 查看
const getDoorSheet = (doorSheet: DoorSheet) => {
  doorSheets.length = 0
  doorSheets.push(doorSheet)
  doors.length = 0
  doorSheet.Doors.forEach(door => {
    doors.push(door)
  })
}

// Door 编辑
const editDoor = (door: Door) => {
  title.value = "修改柜门"
  Object.assign(currentDoor.value, door)
  operate.value = Operate.UPDATE;
  doorDialogVisible.value = true
}

const handleSelectionChange = (val: Door[]) => {
  // multipleSelection.value = val
}

const handleEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    // 触发 el-button 的点击事件
    doSearchDoorSheets()
  }
};

// 获取柜门表单一览
const doSearchDoorSheets = async () => {
  if (useRetailStore.customers.length == 0) {
    await useRetailStore.getAllCustomers()
  }
  getByFilter({ "Phone": filter.value }).then((resp => {
    doorSheets.length = 0
    resp.data.forEach((element: DoorSheet) => {
      doorSheets.push(element)
    });
    doors.length = 0
  }))
  doorSheetDialogVisible.value = false
}

// DoorSheet 删除执行
const doDelete = (ID: any) => {
  remove(ID).then(async () => {
    deleteDialogVisible.value = false
    await doSearchDoorSheets()
  })
}

const closeDialog = () => {
  doorDialogVisible.value = false
  doorSheetDialogVisible.value = false
  deleteDialogVisible.value = false
}

const doSubmitDoor = async (door: Door) => {
  let doorSheet = doorSheets[0]
  let index = doorSheet.Doors.findIndex(d => d.ID == door.ID)
  doorSheet.Doors[index] = door
  doorSheet.TotalArea = doorSheet.Doors.reduce((accumulator, currentValue) => accumulator + currentValue.Area, 0);
  await update(doorSheet.ID, doorSheet).catch((error) => {
    return
  })
  await get(doorSheet.ID).then(resp => {
    doorSheets.length = 0
    doorSheets.push(resp.data)
    doors.length = 0
    doorSheets[0].Doors.forEach((door: any) => {
      doors.push(door)
    })
  })
  doorDialogVisible.value = false
}
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