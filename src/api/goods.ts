import { service } from '../utils/request'
import Qs from 'qs'

/**
 * 
 * @param params 
 * @returns 
 */
const get = () => {
  return service({
    url: '/retail/api/v1/goods',
    method: 'GET',
  })
}

/**
 * door update
 * @param params 
 * @returns 
 */
const create = (data: Object) => {
  return service({
    url: '/retail/api/v1/goods',
    method: 'POST',
    data: data
  })
}


const update = (ID: number, data: Object) => {
  return service({
    url: '/retail/api/v1/goods/' + ID,
    method: 'PUT',
    data: data
  })
}

const remove = (ID: number) => {
  return service({
    url: '/retail/api/v1/goods/' + ID,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
}
