import { service } from '../utils/request'

// get
const get = () => {
  return service({
    url: '/retail/api/v1/brand',
    method: 'GET',
  })
}

// create
const create = (data: Object) => {
  return service({
    url: '/retail/api/v1/brand',
    method: 'POST',
    data: data
  })
}

// update
const update = (ID: number, data: Object) => {
  return service({
    url: '/retail/api/v1/brand/' + ID,
    method: 'PUT',
    data: data
  })
}

// remove
const remove = (ID: number) => {
  return service({
    url: '/retail/api/v1/brand/' + ID,
    method: 'DELETE',
  })
}

export {
  get,
  create,
  update,
  remove,
}
