import { service } from '../utils/request'

/**
 * 
 * @param params 
 * @returns 
 */
const get = () => {
  return service({
    url: '/retail/api/v1/goodType',
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
    url: '/retail/api/v1/goodType',
    method: 'POST',
    data: data
  })
}


const update = (ID: number, data: Object) => {
  return service({
    url: '/retail/api/v1/goodType/' + ID,
    method: 'PUT',
    data: data
  })
}

const remove = (ID: number) => {
  return service({
    url: '/retail/api/v1/goodType/' + ID,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
}
