import { Goods, GoodType, Brand } from "@/common/entity"
import { retailStore } from '@/store/modules/retail'
const useRetailStore = retailStore()

export const formatterBig = (row: Goods) => {
  let bigGoodType = useRetailStore.goodTypes.find((goodType) => goodType.ID == row.BigGoodType) as GoodType
  return bigGoodType.Name
}

export const formatterSmall = (row: Goods) => {
  let bigGoodType = useRetailStore.goodTypes.find((goodType) => goodType.ID == row.BigGoodType) as GoodType
  let samllGoodType = bigGoodType.children.find((goodType) => goodType.ID == row.SmallGoodType) as GoodType
  return samllGoodType.Name
}

export const formatterBrand = (row: Goods) => {
  let brand = useRetailStore.brands.find((brand) => brand.ID == row.Brand) as Brand
  return brand.Name
}