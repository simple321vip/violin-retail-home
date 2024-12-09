import { service } from '../utils/request'
import Qs from 'qs'

/**
 * 
 * @param params 
 * @returns 
 */
const get = (params: Object) => {
  return service({
    url: '/retail/api/v1/customer',
    method: 'GET',
    // params: params,
    // paramsSerializer: (params) => {
    //   return Qs.stringify(params, { arrayFormat: 'repeat' })
    // },
  })
}

/**
 * customer create
 * @param data 
 * @returns 
 */
const create = (data: Object) => {
  return service({
    url: '/retail/api/v1/customer',
    method: 'POST',
    data: data
  })
}

/**
 * customer update
 * @param params 
 * @returns 
 */
const update = (ID: string, data: Object) => {
  return service({
    url: '/retail/api/v1/customer/' + ID,
    method: 'PUT',
    data: data
  })
}

const remove = (query: number) => {
  return service({
    url: '/retail/api/v1/customer/' + query,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
}
