<template>
  <div class="master">
    <el-tabs v-if="editableTabs.length > 1" v-model="editableTabsValue" type="card" class="demo-tabs">
      <el-tab-pane v-if="editableTabs.length > 1" :key="editableTabs[0].Name" :label="editableTabs[0].Title"
        :name="editableTabs[0].Name">
        <el-table :data="useRetailStore.currentOrder.OrderGoods" style="width: 100%">
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
          <el-text size="large">大分类：</el-text>
          <el-radio-group v-model="bigGoodType.ID" size="large" @change="onSelect('BigGoodType')">
            <el-radio-button :label="item.Name" v-for="(item) in useRetailStore.goodTypes" :value="item.ID" />
          </el-radio-group>
        </div>
        <el-divider />
        <div class="tag_list">
          <el-text size="large">小分类：</el-text>
          <el-radio-group v-model="smallGoodType.ID" size="large" @change="onSelect('BigGoodType')">
            <el-radio-button :label="item.Name" v-for="(item) in subGoodsType" :value="item.ID" />
          </el-radio-group>
        </div>
        <el-divider />
        <div class="tag_list">
          <el-text size="large">品&emsp;牌：</el-text>
          <el-radio-group v-model="selectBrand.ID" size="large" @change="onSelect('Brand')">
            <el-radio-button :label="item.Name" v-for="(item) in useRetailStore.brands" :value="item.ID" />
          </el-radio-group>
        </div>
        <el-divider />
        <el-table :data="selectedGoods" style="width: 100%">
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
          <el-table-column prop="Price" label="售价/元" width="100" />
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
import { ElNotification, ElButton, ElTable, ElDivider, ElTableColumn, ElTabs, ElTag } from 'element-plus'
import { ElRadioGroup, ElRadioButton, ElText, ElInputNumber, ElTabPane, ElInput } from 'element-plus'
// import Dialog from './dialog.vue'
import { GoodType, Goods, OrderGoods, Order, Tab, Brand } from '@/common/entity'
import { retailStore } from '@/store/modules/retail'
import { get, remove, create } from '@/api/order'
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
// 选中大分类
const bigGoodType = ref<GoodType>({} as GoodType)
// 选中大分类时的小分类一览
const subGoodsType = reactive<GoodType[]>([])
// 选中小分类
const smallGoodType = ref<GoodType>({} as GoodType)
// 选中品牌
let selectBrand = ref<Brand>({} as Brand)
// 选中大分类，小分类，品牌时的过滤显示用
const selectedGoods = reactive<Goods[]>([])

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
// 添加商品进入购物车
const handleInsert = (target: Goods) => {
  if (useRetailStore.currentOrder.OrderGoods == undefined) {
    useRetailStore.currentOrder.OrderGoods = []
  }
  let orderGoods = useRetailStore.currentOrder.OrderGoods.find(orderGood => orderGood.ID == target.ID)
  if (orderGoods) {
    useRetailStore.currentOrder.OrderGoods.forEach(orderGood => {
      if (orderGood.ID == target.ID) {
        orderGood.Amount = orderGood.Amount + 1
      }
    })
  } else {
    useRetailStore.currentOrder.OrderGoods.push({
      ID: target.ID,
      Name: target.Name,
      BigGoodType: formatterBig(target),
      SmallGoodType: formatterSmall(target),
      Brand: formatterBrand(target)
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

// 过滤查询
const onSelect = (select: string) => {
  // 变换大分类时，需要清除小分类选中
  if (select == "BigGoodType") {
    let goodType = useRetailStore.goodTypes.find(goodType => goodType.ID == bigGoodType.value.ID)
    subGoodsType.length = 0
    goodType?.children.forEach(goodsType => {
      subGoodsType.push(goodsType)
    })
  }

  selectedGoods.length = 0
  useRetailStore.goods.filter(good => {
    if (bigGoodType.value.ID == undefined) {
      return true
    }
    return good.BigGoodType == bigGoodType.value.ID
  }).filter(good => {
    if (smallGoodType.value.ID == undefined) {
      return true
    }
    return good.SmallGoodType == smallGoodType.value.ID
  }).filter(good => {
    if (selectBrand.value.ID == undefined) {
      return true
    }
    return good.Brand == selectBrand.value.ID
  }).forEach(good => {
    selectedGoods.push(good)
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
  if (useRetailStore.currentOrder.CustomerName == undefined && route.query.customer == undefined) {
    return
  }
  if (useRetailStore.currentOrder.CustomerName != undefined && route.query.customer == undefined) {
    // 暂时什么都不做
  }
  if (useRetailStore.currentOrder.CustomerName != undefined && route.query.customer != undefined) {
    // 这里反序列化获取参数
    let customer = JSON.parse(route.query.customer as string)
    if (useRetailStore.currentOrder.CustomerName == customer.Name) {
      // 暂时什么都不做
    } else {
      // 替换当前订单，保存上一个订单到数据库
      const order = {
        ID: useRetailStore.currentOrder.ID,
        Date: useRetailStore.currentOrder.Date,
        CustomerName: useRetailStore.currentOrder.CustomerName,
        CustomerPhone: useRetailStore.currentOrder.CustomerPhone,
        OrderGoods: useRetailStore.currentOrder.OrderGoods,
        AccountsReceivable: useRetailStore.currentOrder.AccountsReceivable,
        ActualAccountsReceivable: useRetailStore.currentOrder.ActualAccountsReceivable,
        Comment: useRetailStore.currentOrder.Comment,
      } as Order
      create(order)
    }
  }
  if (useRetailStore.currentOrder.CustomerName == undefined && route.query.customer != undefined) {
    // 这里反序列化获取参数
    let customer = JSON.parse(route.query.customer as string)
    useRetailStore.currentOrder.CustomerName = customer.Name
  }

  editableTabs.value =
    [
      {
        Title: useRetailStore.currentOrder.CustomerName + '_购物车',
        Name: useRetailStore.currentOrder.CustomerName + '2',
        Content: 'Tab 2 content',
      } as Tab,
      {
        Title: useRetailStore.currentOrder.CustomerName + '_新建订单',
        Name: useRetailStore.currentOrder.CustomerName + '1',
        Content: 'Tab 1 content',
      } as Tab,
    ]
  useRetailStore.goods.forEach(good => {
    selectedGoods.push(good)
  })


})
</script>

<style scoped>
.tag_list {
  display: flex;
  /* border-top: 1px solid rgba(151, 151, 151, 0.3); */
  /* border-bottom: 1px solid rgba(151, 151, 151, 0.3); */
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