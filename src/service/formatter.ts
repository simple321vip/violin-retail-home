import { Goods, GoodType, Brand } from "@/common/entity"
import { retailStore } from '@/store/modules/retail'
const useRetailStore = retailStore()

export const formatterBig = (row: Goods) => {
  let bigGoodType = useRetailStore.goodTypes.find((goodType) => goodType.ID == row.GoodType[0]) as GoodType
  return bigGoodType.Name
}

export const formatterSmall = (row: Goods) => {
  let bigGoodType = useRetailStore.goodTypes.find((goodType) => goodType.ID == row.GoodType[0]) as GoodType
  let samllGoodType = bigGoodType.children.find((goodType) => goodType.ID == row.GoodType[0]) as GoodType
  return samllGoodType.Name
}

export const formatterBrand = (row: Brand) => {
  let brand = useRetailStore.brands.find((brand) => brand.ID == row.ID) as Brand
  return brand.Name
}