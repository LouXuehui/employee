import axios from 'axios'

export function selectList(url) {
    return axios.get(`api/${url}/selectList`)
}

export function selectById(url, payload) {
    return axios.get(`api/${url}/selectById?empId=${payload.empId}`)
}

export function insert(url, payload) {
    console.log(payload, 'payload')
    return axios.post(`api/${url}/insert`, payload)
}

export function updateById(url, payload) {
    return axios.post(`api/${url}/updateById`, payload)
}

export function deleteById(url, payload) {
    return axios.get(`api/${url}/deleteById?id=${payload.id}`)
}

export function updatePassWord(url, payload) {
    return axios.post(`api/${url}/updatePassWord`, payload)
}
