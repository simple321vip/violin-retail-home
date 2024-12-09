import { service } from '../utils/request'
import Qs from 'qs'

/**
 * 
 * @param params 
 * @returns 
 */
const get = (ID: Object) => {
  return service({
    url: '/retail/api/v1/doorSheet/' + ID,
    method: 'GET',
  })
}

/**
 * 
 * @param params 
 * @returns 
 */
const getByFilter = (filter: Object) => {
  return service({
    url: '/retail/api/v1/doorSheet',
    method: 'GET',
    params: filter
  })
}

/**
 * door create
 * @param data 
 * @returns 
 */
const create = (data: Object) => {
  return service({
    url: '/retail/api/v1/doorSheet',
    method: 'POST',
    data: data
  })
}

/**
 * door create
 * @param data 
 * @returns 
 */
const update = (ID: any, data: Object) => {
  return service({
    url: '/retail/api/v1/doorSheet/' + ID,
    method: 'PUT',
    data: data
  })
}

const remove = (query: number) => {
  return service({
    url: '/retail/api/v1/doorSheet/' + query,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
  getByFilter,
}
