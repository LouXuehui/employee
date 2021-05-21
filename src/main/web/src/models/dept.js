import * as services from '../services/index';
import alert from "common/alert";

export default {
    namespace: 'dept',
    state: {
        dataList: [],  //列表
        loading: true,  //列表Loading
        showEditModal: false, // 新增编辑弹框
        deleteVisible: false,//删除弹框
    },
    reducers: {
        setState(state, action) {
            return {...state, ...action.payload};
        },
    },
    effects: {
        //查询列表
        * selectList({payload}, {call, put}) {
            const {data} = yield call(services.selectList, 'dept')
            if (data && data.code === 1) {
                yield put({
                    type: 'setState',
                    payload: {dataList: data.payload || []}
                })
            } else {
                alert('查询用户列表', data)
            }
        },
        //新增
        * insert({payload}, {call, put}) {
            const {data} = yield call(services.insert, 'dept', payload)
            if (data && data.code === 1) {
                yield put({type: 'selectList'})
            }
            alert('新增', data)
        },

        //编辑
        * updateById({payload}, {call, put}) {
            const {data} = yield call(services.updateById, 'dept', payload)
            if (data && data.code === 1) {
                yield put({type: 'selectList'})
            }
            alert('编辑', data)
        },
        //删除
        * deleteById({payload}, {call, put}) {
            const {data} = yield call(services.deleteById, 'dept', payload)
            if (data && data.code === 1) {
                yield put({type: 'selectList'})
            }
            alert('删除', data)
        }
    },
};
