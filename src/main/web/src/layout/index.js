import React, {Component} from 'react'
import {connect} from 'dva'
import {LocaleProvider, Menu, Avatar, Dropdown, message} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import {SettingOutlined} from '@ant-design/icons'
import styles from './index.less'
import Tabs from './Tabs'
import router from 'umi/router'
import withRouter from 'umi/withRouter'
import UpdatePwdModal from './UpdatePwdModal'
import logo from '../assets/logo.png'
import avatar from '../assets/avatar.png'
import noData from '../assets/no_data.png'
import TipModal from 'components/TipModal'

const {SubMenu} = Menu
var layoutHashChange

class Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false //退出登录
        }
    }

    componentDidMount() {
        const {dispatch, user} = this.props
        let userId = (user && user.id) || window.sessionStorage.getItem('username')
        if (userId) {
            this.loadPage(userId)
            let user = window.sessionStorage.getItem('user')
            let employee = window.sessionStorage.getItem('employee')
            dispatch({type: 'layout/setState', payload: {user: JSON.parse(user)}})
            dispatch({type: 'employee/setState', payload: {selectedEmp: JSON.parse(employee)}})
            layoutHashChange = window.addEventListener('hashchange', e => {
                const {activePaneKey} = this.props
                router.push({
                    pathname: activePaneKey
                })
            })
        } else {
            router.push('/login')
        }

        //禁用浏览器回退功能
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL)
        })
    }

    loadPage(userId) {
        const {dispatch, menuList} = this.props
        let menu = this.getMenu(menuList, 'myPage')
        menu ? this.menuClick(menu) : void 0
    }

    //点击菜单
    menuClick(menu) {
        console.log(menu, 'menu')
        const {dispatch, children, activePaneKey} = this.props
        dispatch({
            type: 'layout/addPane',
            payload: {
                pane: {key: menu.id, title: menu.name, MenuID: menu.id},
                activePaneKey: menu.id,
                lastActivePaneKey: activePaneKey,
                lastContent: children
            }
        })
        router.push({
            pathname: `/${menu.id}`,
            query: {}
        })
        dispatch({type: 'layout/setState', payload: {openKeys: [menu.parentId]}})
    }

    //菜单事件
    handleMenu({item, key, keyPath, domEvent}) {
        console.log({item, key, keyPath, domEvent}, '{item, key, keyPath, domEvent}')
        const {activePaneKey, dispatch, menuList} = this.props
        switch (key) {
            case 'closeCurrentWindow':
                this.remove(activePaneKey)
                break
            case 'closeAllWindow':
                dispatch({type: 'layout/setState', payload: {panes: [], activePaneKey: null}})
                break
            case 'updatePassword':
                this.showPassWordModal()
                break
            case 'exiting':
                this.setState({visible: true})
                break
            default:
                let menu = this.getMenu(menuList, key)
                menu ? this.menuClick(menu) : void 0
                break
        }
    }

    getMenu(menuList, key) {
        if (menuList && menuList.length) {
            for (let menu of menuList) {
                if (menu.id === key) {
                    return menu
                } else {
                    let children = menu.children || []
                    let tempList = children.filter(child => key === child.id)
                    if (tempList.length) {
                        return tempList[0]
                    } else {
                        children.length ? children[0] : ''
                    }
                }
            }
        }
    }

    //关闭页面
    remove(targetKey) {
        let {activePaneKey, dispatch} = this.props
        let lastIndex
        this.props.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1
            }
        })
        const panes = this.props.panes.filter(pane => pane.key !== targetKey)
        if (lastIndex >= 0 && activePaneKey === targetKey) {
            activePaneKey = panes[lastIndex].key
        }
        if (lastIndex === -1) {
            activePaneKey = panes.length ? panes[0].key : ''
        }
        router.push({
            pathname: `/${activePaneKey}`,
            query: {}
        })
        dispatch({type: 'layout/setState', payload: {panes, activePaneKey}})
    }

    //展示修改密码弹框
    showPassWordModal() {
        const {dispatch} = this.props
        dispatch({type: 'layout/setState', payload: {pwModalVisible: true}})
    }

    //退出登录
    signOut() {
        this.setState({visible: false})
        window.sessionStorage.clear()
        window.location.reload()
        layoutHashChange ? window.removeEventListener('hashchange') : void 0
    }

    //渲染菜单
    renderMenu(menu) {
        let children = menu.children || []
        if (children.length) {
            return (
                <SubMenu
                    key={menu.id + ''}
                    title={
                        <div className={styles.menu}>
                            <span>{menu.name}</span>
                        </div>
                    }
                >
                    {children.map(item => {
                        return this.renderMenu(item)
                    })}
                </SubMenu>
            )
        } else {
            return <Menu.Item key={menu.id}>{menu.name}</Menu.Item>
        }
    }

    openSubMenu(openKeys) {
        const {menuList, dispatch, openKeys: keys} = this.props
        let rootSubmenuKeys = []
        menuList.map(menu => {
            rootSubmenuKeys.push(menu.ItemID)
        })
        const latestOpenKey = openKeys.find(key => keys.indexOf(key) === -1)
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            dispatch({type: 'layout/setState', payload: {openKeys}})
        } else {
            dispatch({type: 'layout/setState', payload: {openKeys: latestOpenKey ? [latestOpenKey] : []}})
        }
    }

    render() {
        const {visible} = this.state
        const {panes, pwModalVisible, children, activePaneKey, menuList, employee} = this.props
        const {selectedEmp} = employee

        return (
            <LocaleProvider locale={zhCN}>
                <section className={styles.body}>
                    <div className={styles.left}>
                        <div className={styles.logo}>
                            <img src={logo}/>
                        </div>
                        <div className={styles.menuList}>
                            <Menu
                                theme={'dark'}
                                selectedKeys={[activePaneKey]}
                                openKeys={this.props.openKeys}
                                mode="inline"
                                onClick={e => this.handleMenu(e)}
                                onOpenChange={e => this.openSubMenu(e)}
                                subMenuCloseDelay={0}
                                subMenuOpenDelay={0.1}
                            >
                                {menuList && menuList.length
                                    ? menuList.map(menu => {
                                        return this.renderMenu(menu)
                                    })
                                    : void 0}
                            </Menu>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.top}>
                            <div className={styles.leftHead}>欢迎使用员工管理信息系统</div>
                            <div className={styles.rightHead}>
                                <Dropdown
                                    overlay={
                                        <Menu onClick={::this.handleMenu}>
                                            <Menu.Item key="closeCurrentWindow" disabled={!(panes && panes.length)}>
                                                <span>关闭当前窗口</span>
                                            </Menu.Item>
                                            <Menu.Item key="closeAllWindow" disabled={!(panes && panes.length)}>
                                                <span>关闭所有窗口</span>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    placement="bottomCenter"
                                >
                                    <SettingOutlined style={{color: '#999', marginRight: 10}}/>
                                </Dropdown>
                                <Dropdown
                                    overlay={
                                        <Menu onClick={::this.handleMenu}>
                                            <Menu.Item key={'updatePassword'}>
                                                <span>修改密码</span>
                                            </Menu.Item>
                                            <Menu.Item key={'exiting'}>
                                                <span>退出系统</span>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    placement="bottomCenter"
                                >
                                    <div className={styles.info}>
                                        <Avatar src={selectedEmp.photoUrl || avatar} size={26}/>
                                        <span style={{marginLeft: 5}}>{selectedEmp ? selectedEmp.name : '未命名'}</span>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                        <div className={styles.content}>
                            {panes && panes.length ? (
                                <Tabs menuList={menuList} removePane={::this.remove} openSubMenu={::this.openSubMenu}>
                                    {children}
                                </Tabs>
                            ) : (
                                <div className={styles.normal}>
                                    <img src={noData}/>
                                    请选择对应功能页面
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                {pwModalVisible ? <UpdatePwdModal/> : void 0}
                {visible ? <TipModal visible={visible} content={<div>确定退出登录吗？</div>}
                                     cancelModal={() => this.setState({visible: false})}
                                     onOK={() => this.signOut()}/> : void 0}
            </LocaleProvider>
        )
    }
}

function mapStateToProps(state) {
    return Object.assign({}, state.layout, {employee: state.employee}, {
        loading: state.loading.models.layout
    })
}

export default withRouter(connect(mapStateToProps)(Layout))
