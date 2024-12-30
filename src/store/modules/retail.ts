import { acceptHMRUpdate, defineStore } from "pinia"
import { reactive, ref } from "vue"
import { get } from '@/api/customer'
import { get as getGoods } from '@/api/goods'
import { get as getGoodType } from '@/api/goodType'
import { get as getBrands } from '@/api/brand'
import { get as getOrders } from '@/api/order'
import { Customer, Goods, GoodType, Brand, Order } from "@/common/entity"

export const retailStore = defineStore('customers', () => {

  const customers = reactive<Customer[]>([])
  const goods = reactive<Goods[]>([])
  const goodTypes = reactive<GoodType[]>([])
  const brands = reactive<Brand[]>([])
  const currentOrder = reactive<Order>({} as Order);
  const orders = reactive<Order[]>([]);

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
          goodTypes.push(item)
        })
        goodTypes.forEach(goodType => {
          if (goodType.children) {
            goodType.children.forEach(sub => {
              sub.Parent = goodType
            })
          }
        })
      }
    })
  }

  const getAllBrands = async () => {
    brands.length = 0
    getBrands().then(res => {
      if (res) {
        res.data.forEach((item: Brand) => {
          brands.push(item)
        })
      }
    })
  }

  const getAllOrders = async () => {
    orders.length = 0
    getOrders().then(res => {
      if (res) {
        res.data.forEach((item: Order) => {
          orders.push(item)
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
    getAllGoodTypes,
    brands,
    getAllBrands,
    currentOrder,
    getAllOrders,
    orders,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(retailStore, import.meta.hot))
}
