import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/demand/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(demandId) {
  return request({
    url: `/api/demand/detail/${demandId}`,
    method: 'get'
  })
}

export function createDemand(data) {
  return request({
    url: '/api/demand/save',
    method: 'post',
    data
  })
}

export function updateDemand(data) {
  return request({
    url: '/api/demand/update',
    method: 'post',
    data
  })
}

export function removeDemand(id) {
  return request({
    url: `/api/demand/remove/${id}`,
    method: 'delete'
  })
}
