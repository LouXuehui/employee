import * as services from '../services/index'
import alert from 'common/alert'

export default {
    namespace: 'userManagement',
    state: {
        userList: [{id: '1', name: '1', statusCode: 1, empNo: '123'}] //用户列表
    },
    reducers: {
        setState(state, action) {
            return {...state, ...action.payload}
        }
    },
    effects: {
        //查询列表
        * selectList({payload}, {call, put}) {
            const {data} = yield call(services.selectList, 'user')
            if (data && data.code === 1) {
                yield put({
                    type: 'setState',
                    payload: {userList: data.payload || []}
                })
            } else {
                alert('查询用户列表', data)
            }
        },
        //新增
        * insert({payload}, {call, put}) {
            const {data} = yield call(services.insert, 'user', payload)
            if (data && data.code === 1) {
                yield put({type: 'selectList'})
            }
            alert('新增用户', data)
        },

        //编辑
        * updateById({payload}, {call, put}) {
            const {data} = yield call(services.updateById, 'user', payload)
            if (data && data.code === 1) {
                yield put({type: 'selectList'})
            }
            alert('编辑用户', data)
        },
        //删除
        * deleteById({payload}, {call, put}) {
            const {data} = yield call(services.deleteById, 'user', payload)
            if (data && data.code === 1) {
                yield put({type: 'selectList'})
            }
            alert('删除用户', data)
        }
    }
}
