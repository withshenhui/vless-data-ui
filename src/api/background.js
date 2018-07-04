import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/background/list',
    method: 'get',
    params: query
  })
}

export function fetchBackground() {
  return request({
    url: '/api/background/detail',
    method: 'get'
  })
}

export function createBackground(data) {
  return request({
    url: '/api/background/save',
    method: 'post',
    data
  })
}

export function updateBackground(data) {
  return request({
    url: '/api/background/update',
    method: 'post',
    data
  })
}

export function removeBackground(id) {
  return request({
    url: `/api/background/remove/${id}`,
    method: 'delete'
  })
}
