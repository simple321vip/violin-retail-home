import { acceptHMRUpdate, defineStore } from "pinia"
import { computed, reactive } from "vue"
import { get, remove } from '@/api/customer'
import { Customer } from "@/common/entity"

export const retailStore = defineStore('customers', () => {

  const customers = reactive<Customer[]>([])

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

  return {
    customers,
    getAllCustomers,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(retailStore, import.meta.hot))
}
