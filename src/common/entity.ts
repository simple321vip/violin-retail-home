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
  ID: string,
  Phone: string,
  Name: string,
  Comment: string,
  Amount: number,
  Doors: Door[],
  TotalArea: number
}

// 货品分类
interface GoodType {
  ID: string,
  Name: string,
  Comment: string
}



export { Tenant, Theme, DataTimeline, Event, Customer, Door, Filter, DoorSheet, GoodType }
