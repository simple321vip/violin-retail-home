<template>
  <div class="master">
    <el-tabs v-if="editableTabs.length > 1" v-model="editableTabsValue" type="card" class="demo-tabs">
      <el-tab-pane v-if="editableTabs.length > 1" :key="editableTabs[0].Name" :label="editableTabs[0].Title"
        :name="editableTabs[0].Name">
        <el-table :data="currentOrder.OrderGoods" style="width: 100%">
          <el-table-column type="selection" width="30" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="Name" label="货品名称" width="100" />
          <el-table-column prop="BigGoodType" label="大分类" width="100" />
          <el-table-column prop="SmallGoodType" label="小分类" width="100" />
          <el-table-column prop="Brand" label="品牌" width="100" />
          <el-table-column prop="Color" label="颜色" width="100" />
          <el-table-column prop="Size" label="尺寸" width="100" />
          <el-table-column prop="Unit" label="单位" width="60" />
          <el-table-column prop="Price" label="售价" width="100">
            <template #default="scope">
              <el-input v-model="scope.row.Price" />
            </template>
          </el-table-column>
          <el-table-column prop="Amount" label="数量" width="200">
            <template #default="scope">
              <el-input-number v-model="scope.row.Amount" :max=1000 :min=0 :value-on-clear=0 />
            </template>
          </el-table-column>
          <el-table-column label="增加">
            <template #default="scope">
              <!-- <el-button type="primary" @click="handleInsert">加入购物车</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="editableTabs.length > 1" :key="editableTabs[1].Name" :label="editableTabs[1].Title"
        :name="editableTabs[1].Name">
        <div class="tag_list">
          <el-radio-group v-model="goodType.ID" size="large" @change="onSelect(goodType)">
            <el-radio-button :label="item.Name" v-for="(item) in useRetailStore.goodTypes" :value="item.ID" />
          </el-radio-group>
          <!-- <el-tag class="ml-2 click-icon" :type="item.clicked ? 'danger' : 'info'" v-for="(item) in goodTypes"
        @click="onSelect(item)">{{ item.Name }}</el-tag> -->
        </div>
        <div class="tag_list">
          <el-radio-group v-model="goodType.ID" size="large" @change="onSelect(goodType)">
            <el-radio-button :label="item.Name" v-for="(item) in subGoodsType" :value="item.ID" />
          </el-radio-group>
          <!-- <el-tag class="ml-2 click-icon" :type="item.clicked ? 'danger' : 'info'" v-for="(item) in goodTypes"
        @click="onSelect(item)">{{ item.Name }}</el-tag> -->
        </div>
        <div class="tag_list">
          <el-radio-group v-model="goodType.ID" size="large" @change="onSelect(goodType)">
            <el-radio-button :label="item.Name" v-for="(item) in useRetailStore.brands" :value="item.ID" />
          </el-radio-group>
          <!-- <el-tag class="ml-2 click-icon" :type="item.clicked ? 'danger' : 'info'" v-for="(item) in goodTypes"
        @click="onSelect(item)">{{ item.Name }}</el-tag> -->
        </div>
        <el-table :data="useRetailStore.goods" style="width: 100%">
          <el-table-column type="selection" width="30" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="Name" label="货品名称" width="100" />
          <el-table-column prop="GoodType" label="大分类" width="100" :formatter="formatterBig" />
          <el-table-column prop="GoodType" label="小分类" width="100" :formatter="formatterSmall" />
          <el-table-column prop="Brand" label="品牌" width="100" :formatter="formatterBrand" />
          <!-- <el-table-column prop="Amount" label="数量" width="200">
            <el-input-number v-model="order.ID" :max=1000 :min=0 :value-on-clear=0 />
          </el-table-column> -->
          <el-table-column prop="Unit" label="单位" width="60" />
          <el-table-column prop="Price" label="售价" width="100">
            <template #default="scope">
              <el-input v-model="scope.row.Price" />
            </template>
          </el-table-column>
          <el-table-column label="增加">
            <template #default="scope">
              <el-button type="primary" @click="handleInsert(scope.row)">加入购物车</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, h, onMounted } from 'vue'
import { Plus } from "@element-plus/icons-vue"
import { ElNotification, ElButton, ElTable, ElDialog, ElTableColumn, ElTabs, ElTag } from 'element-plus'
import { ElRadioGroup, ElRadioButton, ElFormItem, ElInputNumber, ElTabPane, ElInput } from 'element-plus'
// import Dialog from './dialog.vue'
import { GoodType, Goods, OrderGoods, Order, Tab } from '@/common/entity'
import { retailStore } from '@/store/modules/retail'
import { get, remove } from '@/api/goodType'
import { Operate } from '@/common/enum'
import { useRoute } from 'vue-router'
import { settingsStore } from "@/store/modules/settings"
import { formatterBig, formatterSmall, formatterBrand } from '@/service/formatter'
const useSettingsStore = settingsStore()
const route = useRoute()
// import { GoodType } from '@/common/entity'

const useRetailStore = retailStore()

// 表单格式
let filter = ref("")

// 操作code
let operate = ref<Number>(0)

// 响应式dialog数据
let currentDialogData = ref({})
const subGoodsType = reactive<GoodType[]>([])
const goodType = ref<GoodType>({} as GoodType)
// 全部货物，非显示
const goods = reactive<Goods[]>([])
// 货物，显示用
const selectGoods = reactive<Goods[]>([])
const item = ref<any>(null);
const currentOrder = ref<Order>({} as Order);

// dialog表示flag
let dialogFormVisible = ref(false)
let dialogVisible = ref(false)
const editableTabsValue = ref('2')

const editableTabs = ref<Tab[]>([])
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.Name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.Name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.Name !== targetName)
}
// 操作-》添加
const handleInsert = (target: Goods) => {
  console.log(target)
  console.log(currentOrder.value.OrderGoods)
  if (currentOrder.value.OrderGoods) {
    // TODO how to judge plus or modify
    currentOrder.value.OrderGoods.push({
      ID: 1,
    } as OrderGoods)
  } else {
    currentOrder.value.OrderGoods = []
    currentOrder.value.OrderGoods.push({
      ID: 1,
    } as OrderGoods)
  }
}
// 操作-》删除
const handleDelete = (index: number, target: GoodType) => {
  currentDialogData.value = target
  operate.value = Operate.DELETE;
  dialogVisible.value = true
}
// 操作-》编辑
const handleEdit = (index: number, target: GoodType) => {
  Object.assign(currentDialogData, target)
  operate.value = Operate.UPDATE;
  dialogFormVisible.value = true
}

// 选中 货物大分类
const onSelect = (select: GoodType) => {
  subGoodsType.length = 0
  select.children.forEach(goodsType => {
    subGoodsType.push(goodsType)
  })
}
const doSearch = () => { }
const doSubmit = () => { }
const addToBag = (goods: Goods) => { }

// 数据初始化前，页面不显示
// 1.1 从客户处，新建订单时，如果localStorage内有订单信息，此订单属于同一个人，则不重新创建订单
// 1.2 如果localStorage内有订单信息，但是不是同一个客户的时候，将localStorage内客户存储到order内，然后创建新的订单。
// 1.3 如果localStorage内没有订单信息，则创建新的订单。
// 
// 2.1 从【订单管理】编辑订单时，如果localStorage内有相同订单信息
// 2.2 如果localStorage内有不同订单信息，则保存该订单
// 2.3 如果localStorage内没有订单信息，则编辑该订单。
onMounted(async () => {
  useSettingsStore.activePath = "/order"

  let currentOrder = window.localStorage.getItem("currentOrder")
  if (currentOrder != null) {

  }
  if (route.query.customer == undefined) {
    return
  }
  //这里反序列化获取参数
  item.value = JSON.parse(route.query.customer as string)
  editableTabs.value =
    [
      {
        Title: item.value.Name + '_购物车',
        Name: item.value.Phone + '2',
        Content: 'Tab 2 content',
      } as Tab,
      {
        Title: item.value.Name + '_新建订单',
        Name: item.value.Phone + '1',
        Content: 'Tab 1 content',
      } as Tab,
    ]
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