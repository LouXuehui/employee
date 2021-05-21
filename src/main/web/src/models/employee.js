import * as services from '../services/index';
import alert from "common/alert";

export default {
    namespace: 'employee',
    state: {
        dataList: [],  //员工列表
        loading: true,  //列表Loading
        showEditModal: false, // 新增编辑弹框
        total: '', //数据总数
        deleteVisible: false,//删除弹框
        selectedEmp: ''
    },
    reducers: {
        setState(state, action) {
            return {...state, ...action.payload};
        },
    },
    effects: {
        //查询列表
        * selectList({payload}, {call, put}) {
            const {data} = yield call(services.selectList, 'emp')
            if (data && data.code === 1) {
                yield put({
                    type: 'setState',
                    payload: {dataList: data.payload || []}
                })
            } else {
                alert('查询用户列表', data)
            }
        },
        //查找
        * selectById({payload}, {call, put}) {
            const {data} = yield call(services.selectById, 'emp', payload)
            if (data && data.code === 1) {
                yield put({type: 'setState', payload: {selectedEmp: data.payload || {}}})
            } else {
                alert('查询', data)
            }
        },
        //新增
        * insert({payload}, {call, put}) {
            const {data} = yield call(services.insert, 'emp', payload)
            alert('新增员工', data)
            if (data && data.code === 1) {
                return true
            }
        },

        //编辑
        * updateById({payload}, {call, put}) {
            const {data} = yield call(services.updateById, 'emp', payload)
            alert('编辑员工', data)
            if (data && data.code === 1) {
                return true
            }
        },
        //删除
        * deleteById({payload}, {call, put}) {
            const {data} = yield call(services.deleteById, 'emp', payload)
            alert('删除员工', data)
            if (data && data.code === 1) {
                return true
            }
        }
    },
};
