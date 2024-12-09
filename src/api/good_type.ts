import { service } from '../utils/request'
import Qs from 'qs'

/**
 * 
 * @param params 
 * @returns 
 */
const get = (params: Object) => {
  return service({
    url: '/retail/api/v1/goodType',
    method: 'GET',
    // params: params,
    // paramsSerializer: (params) => {
    //   return Qs.stringify(params, { arrayFormat: 'repeat' })
    // },
  })
}

/**
 * door update
 * @param params 
 * @returns 
 */
const create = (data: Object) => {
  return service({
    url: '/retail/api/v1/goodType',
    method: 'POST',
    data: data
  })
}


const update = (query: number, data: Object) => {
  return service({
    url: '/retail/api/v1/goodType/' + query,
    method: 'PUT',
    data: data
  })
}

const remove = (query: number) => {
  return service({
    url: '/retail/api/v1/goodType/' + query,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
}
