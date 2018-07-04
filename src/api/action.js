import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/action/list',
    method: 'get',
    params: query
  })
}

export function fetchAction() {
  return request({
    url: '/api/action/detail',
    method: 'get'
  })
}

export function createAction(data) {
  return request({
    url: '/api/action/save',
    method: 'post',
    data
  })
}

export function updateAction(data) {
  return request({
    url: '/api/action/update',
    method: 'post',
    data
  })
}

export function removeAction(id) {
  return request({
    url: `/api/action/remove/${id}`,
    method: 'delete'
  })
}
