import * as services from '../services/index';
import alert from "common/alert";

export default {
    namespace: 'position',
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
            const {data} = yield call(services.selectList, 'position')
            if (data && data.code === 1) {
                yield put({
                    type: 'setState',
                    payload: {dataList: data.payload || []}
                })
            } else {
                alert('查询职位列表', data)
            }
        },
        //新增
        * insert({payload}, {call, put}) {
            const {data} = yield call(services.insert, 'position', payload)
            alert('新增职位', data)
            if (data && data.code === 1) {
                return true
            }
        },

        //编辑
        * updateById({payload}, {call, put}) {
            const {data} = yield call(services.updateById, 'position', payload)
            alert('编辑职位', data)
            if (data && data.code === 1) {
                return true
            }
        },
        //删除
        * deleteById({payload}, {call, put}) {
            const {data} = yield call(services.deleteById, 'position', payload)
            alert('删除职位', data)
            if (data && data.code === 1) {
                return true
            }
        }
    },
};
