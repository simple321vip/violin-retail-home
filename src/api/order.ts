import { service } from '../utils/request'

/**
 * 
 * @param params 
 * @returns 
 */
const get = () => {
  return service({
    url: '/retail/api/v1/orders',
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
    url: '/retail/api/v1/order',
    method: 'POST',
    data: data
  })
}


const update = (ID: number, data: Object) => {
  return service({
    url: '/retail/api/v1/order/' + ID,
    method: 'PUT',
    data: data
  })
}

const remove = (ID: number) => {
  return service({
    url: '/retail/api/v1/order/' + ID,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
}
