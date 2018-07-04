import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/rest/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/rest/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: `/api/user/${token}`,
    method: 'get'
  })
}

