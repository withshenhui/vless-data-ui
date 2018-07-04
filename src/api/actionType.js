import request from '@/utils/request'

export function fetchActionTypeList(query) {
  return request({
    url: '/api/actiontype/list',
    method: 'get',
    params: query
  })
}

export function createActionType(data) {
  return request({
    url: '/api/actiontype/save',
    method: 'post',
    data
  })
}

export function updateActionType(data) {
  return request({
    url: '/api/actiontype/update',
    method: 'post',
    data
  })
}

export function removeActionType(id) {
  return request({
    url: `/api/actiontype/remove/${id}`,
    method: 'delete'
  })
}
