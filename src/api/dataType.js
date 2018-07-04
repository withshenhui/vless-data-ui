import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/datatype/list',
    method: 'get',
    params: query
  })
}

export function fetchDataType() {
  return request({
    url: '/api/datatype/detail',
    method: 'get'
  })
}

export function createDataType(data) {
  return request({
    url: '/api/datatype/save',
    method: 'post',
    data
  })
}

export function updateDataType(data) {
  return request({
    url: '/api/datatype/update',
    method: 'post',
    data
  })
}

export function removeDataType(id) {
  return request({
    url: `/api/datatype/remove/${id}`,
    method: 'delete'
  })
}
