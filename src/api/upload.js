import request from '@/utils/request'


export function upload(data) {
  return request({
    url: '/rest/upload',
    method: 'post',
    data
  })
}

