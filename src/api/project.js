import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/project/list',
    method: 'get',
    params: query
  })
}

export function createProject(data) {
  return request({
    url: '/api/project/save',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/api/project/update',
    method: 'post',
    data
  })
}

export function removeProject(id) {
  return request({
    url: `/api/project/remove/${id}`,
    method: 'delete'
  })
}
