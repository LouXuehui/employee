import {findIndexById} from "common/array";
import alert from "common/alert";
import * as services from "../services/layout";
import {menuList} from '../common/menu'

const initState = {
    menuList, //菜单列表
    openKeys: [], //默认展开目录
    panes: [], //打开菜单
    activePaneKey: "", //正在使用中的下单
    isNewPane: false, // 判断是否是当前pane,
    pwModalVisible: false, //修改密码弹框

    user: '', //登录后
    isRemembered: false, //是否记住密码
    isLogged: false,//是否已登录
}

export default {
    namespace: "layout",
    state: initState,
    reducers: {
        initState(state) {
            return Object.assign({}, state, initState);
        },
        setState(state, action) {
            return {...state, ...action.payload};
        },
    },
    effects: {
        //新增tab页
        * addPane({payload: {pane, activePaneKey, lastActivePaneKey, lastContent}}, {call, put, select}) {
            const {panes} = yield select((state) => state.layout);
            yield put({type: "setState", payload: {activePaneKey}});
            let tempPanes = panes.slice();
            let isNewPane = false;
            if (findIndexById(tempPanes, pane.key, "key") < 0) {
                tempPanes.push(pane);
                isNewPane = true;
            }
            let resultPanes = [];
            tempPanes.map((item) => {
                if (lastActivePaneKey === item.key) {
                    resultPanes.push({...item, content: lastContent});
                } else {
                    resultPanes.push(item);
                }
            });
            yield put({
                type: "setState",
                payload: {panes: resultPanes, isNewPane},
            });
        },
        //编辑tab页
        * updatePane({payload: {activePaneKey, lastActivePaneKey, lastContent}}, {call, put, select}) {
            const {panes} = yield select((state) => state.layout);
            let tempPanes = panes.slice();
            let lastPane;
            let cursor = -1;
            tempPanes.map((item, index) => {
                if (lastActivePaneKey === item.key) {
                    cursor = index;
                    lastPane = {...item, content: lastContent};
                }
            });
            lastPane ? tempPanes.splice(cursor, 1, lastPane) : void 0;
            yield put({
                type: "setState",
                payload: {panes: tempPanes, isNewPane: false, activePaneKey},
            });
        },

        //修改密码
        * updatePassWord({payload}, {call, put}) {
            const data = yield call(services.updatePassWord, payload);
            let code = data && data.Status && data.Message === '修改成功' ? 1 : 0
            let msg = data && data.Message ? data.Message : ''
            if (code === 1) {
                yield put({type: 'initState'})
                window.sessionStorage.clear()
                window.location.reload()
            }
            alert('修改密码', {code, tips: msg, exception: msg})
            return code === 1
        },

        * getMenuList({payload, history}, {call, put, select}) {
            const data = yield call(services.getMenuList, payload);
            const {panes} = yield select(state => state.layout);
            if (data) {
                let dataList = data.Children || []
                let {menuList, openList} = dataList.length ? getNewMenuList(dataList, []) : []
                yield put({type: 'setState', payload: {menuList, openList}})
                return openList
            } else {
                alert('查询菜单', {code: 0})
            }
        },

        //设置默认页
        * setDefaultPage({payload}, {call, put, select}) {
            const data = yield call(services.setDefaultPage, payload);
            const {user} = yield select(state => state.layout);
            let code = data && data.Status ? 1 : 0
            let msg = data && data.Message ? data.Message : ''
            if (code === 1) {
                yield put({type: 'getMenuList', payload: {usercode: user.userId, id: -3}, history: 'setDefaultPage'})
            }
            alert('设置默认页', {code, tips: msg, exception: msg})
            return code === 1
        }
    },
};

function getNewMenuList(menuList, openList) {
    for (let menu of menuList) {
        menu.TreeID = JSON.stringify(menu.TreeID)
        menu.ItemID = JSON.stringify(menu.ItemID)
        if (menu.AutoOpen) {
            openList.push(menu)
        }
        let children = menu.Children || []
        if (children.length) {
            getNewMenuList(children, openList)
        }
    }
    return {menuList, openList}
}
