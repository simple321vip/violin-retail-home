type Tenant = {
  tenant_id: string,
  account: string
}

type Theme = {
  background: string,
  activeBackground: string,
  activeText: string,
  normalText: string,
  hoverBackground: string,
  hoverText: string,
}

// Tab
interface Tab {
  Title: string,
  Name: string,
  Content: string
}

type DataTimeline = {
  from: string,
  title: string,
  showDayAndMonth: boolean,
  message: string,
}

type Event = {
  reminder_date: string,
  title: string,
  info: string,
  type: string[],
}

// 客户定义
interface Filter {
  text: string,
  value: string,
}

// 客户定义
interface Customer {
  ID: string,
  Phone: string,
  Name: string,
  Comment: string,
  [key: string]: any;
}

// 柜门表
interface DoorSheet {
  ID: string,
  Phone: string,
  Name: string,
  Comment: string,
  Amount: number,
  Doors: Door[],
  TotalArea: number,
  [key: string]: any;
}

// 柜门
type Door = {
  ID: number,
  Name: string,
  Length: number,
  Width: number,
  Amount: number,
  Area: number,
  Comment: string,
}

// 货品
interface Goods {
  ID: number,
  Name: string,
  BigGoodType: number,
  SmallGoodType: number | undefined,
  Brand: number,
  Unit: string,
  Price: number,
  Comment: string,
}

// 货品分类
interface GoodType {
  ID: number,
  Parent: GoodType | undefined
  Name: string,
  Rank: number,
  Comment: string,
  children: GoodType[],
}

// 品牌
interface Brand {
  ID: number,
  Name: string,
  Comment: string
}

// 货品
interface OrderGoods {
  ID: number,
  Name: string,
  BigGoodType: string,
  SmallGoodType: string,
  Color: string,
  Size: string,
  Brand: string,
  Unit: string,
  Amount: number,
  Price: number,
  TotalPrice: number,
  Comment: string,
}

// 订单
interface Order {
  ID: number,
  Name: string,
  OrderGoods: Array<OrderGoods>,
  AccountsReceivable: number,
  ActualAccountsReceivable: number,
  Comment: string,
}



export { Tenant, Theme, DataTimeline, Event, Tab, OrderGoods }
export { Customer, Door, Filter, DoorSheet, GoodType, Goods, Order, Brand }