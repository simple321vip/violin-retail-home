import { Operate } from "@/common/enum"
import { toRaw } from 'vue'

export const CheckNameExist = (data: any, nameData: any, operate: Number) => {
  let originList = toRaw(data) as []
  if (operate == Operate.CREATE) {
    if (originList.find((item: any) => item.Name == nameData.Name)) {
      return true
    }
  }
  if (operate == Operate.UPDATE) {
    if (originList.filter((item: any) => item.ID != nameData.ID).find((item: any) => item.Name == nameData.Name)) {
      return true
    }
  }
  return false
}

export const CheckPhoneExist = (data: any, phoneData: any, operate: Number) => {
  let originList = toRaw(data) as []
  if (operate == Operate.CREATE) {
    if (originList.find((item: any) => item.Phone == phoneData.Phone)) {
      return true
    }
  }
  if (operate == Operate.UPDATE) {
    if (originList.filter((item: any) => item.ID != phoneData.ID).find((item: any) => item.Phone == phoneData.Phone)) {
      return true
    }
  }
  return false
}