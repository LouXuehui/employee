/**
 * Created by lxh on 2020/4/29
 */
import axios from 'axios'
import {domain} from "@/common/domain";

//修改密码
export function updatePassWord(payload) {
    return axios.post(`${domain}/Home/UpdatePassword`, payload).then(res => {
        return res.data || {}
    })
}

//获取菜单列表
export function getMenuList(payload) {
    return axios.post(`${domain}/Home/GetMenuItemTree`, payload).then(res => {
        return res.data || {}
    })
}

//设置默认页
export function setDefaultPage(payload) {
    return axios.get(`${domain}/User/setDefaultPage?usercode=${payload.usercode}&item1=${payload.item1}&item2=${payload.item2}&item3=${payload.item3}`).then(res => {
        return res.data || {}
    })
}