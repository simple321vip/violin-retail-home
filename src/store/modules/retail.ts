import { acceptHMRUpdate, defineStore } from "pinia"
import { computed, reactive } from "vue"
import { get, remove } from '@/api/customer'
import { get as getGoods } from '@/api/goods'
import { get as getGoodType } from '@/api/goodType'
import { Customer, Goods, GoodType } from "@/common/entity"

export const retailStore = defineStore('customers', () => {

  const customers = reactive<Customer[]>([])
  const goods = reactive<Goods[]>([])
  const goodTypes = reactive<GoodType[]>([])

  const getAllCustomers = async () => {
    customers.length = 0
    get({}).then(res => {
      if (res) {
        res.data.forEach((item: Customer) => {
          const row = {
            ID: item.ID,
            Name: item.Name,
            Phone: item.Phone,
            Comment: item.Comment,
          }
          customers.push(row)
        })
      }
    })
  }

  const getAllGoods = async () => {
    goods.length = 0
    getGoods().then(res => {
      if (res) {
        res.data.forEach((item: Goods) => {
          goods.push(item)
        })
      }
    })
  }

  const getAllGoodTypes = async () => {
    goodTypes.length = 0
    getGoodType().then(res => {
      if (res) {
        res.data.forEach((item: GoodType) => {
          // const row = {
          //   ID: item.ID,
          //   Name: item.Name,
          //   Phone: item.Phone,
          //   Comment: item.Comment,
          // }
          // goods.push(row)
        })
      }
    })
  }

  return {
    customers,
    getAllCustomers,
    goods,
    getAllGoods,
    goodTypes,
    getAllGoodTypes
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(retailStore, import.meta.hot))
}
