import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Button, Input, Table, Tooltip, Spin} from 'antd'
import {CheckCircleTwoTone} from '@ant-design/icons'
import moment from 'moment'
import TipModal from 'components/TipModal'
import Operation from 'components/Operation'
import EditModal from './EditModal'

const {Search} = Input

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            selectedRoleId: '0',
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
        }
    }

    componentDidMount() {
        this.getDataList()
    }

    getDataList(current = 1, keyword = '', limit) {
        const {dispatch} = this.props
        dispatch({type: 'userManagement/selectList'})
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props
        dispatch({type: 'userManagement/setState', payload: {showEditModal: true}})
    }

    //编辑弹框
    showEditModal(record) {
        const {dispatch} = this.props
        dispatch({type: 'userManagement/getAuthorGroupList', payload: {id: record.ID}}).then(roleList => {
            if (roleList) {
                dispatch({
                    type: 'userManagement/setState',
                    payload: {showEditModal: true, record: {...record, roleList}}
                })
            }
        })
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props
        dispatch({type: 'userManagement/setState', payload: {userVisible: true, record}})
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props
        dispatch({type: 'userManagement/setState', payload: {userVisible: false, record: ''}})
    }

    //删除
    handleOk() {
        const {current} = this.state
        const {dispatch, record} = this.props
        dispatch({type: 'userManagement/deleteById', payload: {id: record.id}}).then(res => {
            if (res) {
                this.getDataList(current)
            }
        })
        dispatch({type: 'userManagement/setState', payload: {userVisible: false, record: ''}})
    }

    render() {
        const {current, pageSize, keyword, selectedRoleId} = this.state
        const {showEditModal, userList, tableLoading, userVisible, record, employee, layout} = this.props
        const {dataList} = employee
        const {user} = layout

        let columns = [
            {
                key: 'isUse',
                dataIndex: 'isUse',
                title: '启用',
                width: 50,
                render: text => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: 'name',
                dataIndex: 'name',
                title: '登录名',
                ellipsis: true,
                render: text => {
                    return (
                        <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
                    )
                }
            },
            {
                key: 'empId',
                dataIndex: 'empId',
                title: '工号',
                width: 120,
                ellipsis: true,
                render: text => {
                    return (
                        <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
                    )
                }
            },
            {
                key: 'roleId',
                dataIndex: 'roleId',
                title: '角色',
                width: 120,
                ellipsis: true,
                render: text => {
                    return text === '1' ? '管理员' : '员工'
                }
            },
        ]
        if (user && user.roleId === '1') {
            columns.push(
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (text, record) => (
                        <div className="operation">
                            <Operation name="编辑" addDivider onClick={() => this.showEditModal(record)}/>
                            <div>
              <span className={'delete'} onClick={() => this.showDeleteModal(record)}>
                删除
              </span>
                            </div>
                        </div>
                    )
                }
            )
        }

        const limit = Math.floor((document.body.clientHeight - 270) / 43)
        let datasource = keyword ? userList.filter(user => user.name.indexOf(keyword) > -1) : userList
        const roleList = [{
            id: '1',
            name: '管理员',
        },
            {
                id: '0',
                name: '员工',
            },]

        return (
            <div className={styles.userWrapper}>
                <div className={styles.top}>
                    <Search
                        placeholder="请输入关键字"
                        onChange={e => this.setState({keyword: e.target.value})}
                        style={{width: 200, marginRight: 10}}
                    />
                    <div className={styles.headerRight}>
                        <Button onClick={() => this.getDataList()}>刷新</Button>
                        <Button type="primary" onClick={() => this.handleAdd()}>
                            新增
                        </Button>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.title}>角色</div>
                        {
                            roleList.map(role => {
                                return <div
                                    key={role.id}
                                    className={role.id === selectedRoleId ? styles.selectedRole : styles.role}
                                    onClick={() => this.setState({selectedRoleId: role.id})}
                                >
                                    {role.name}
                                </div>
                            })
                        }
                    </div>
                    <div id="table" className={styles.contentRight} key={'2'}>
                        <Table
                            rowKey={record => record.id}
                            columns={columns}
                            dataSource={datasource.filter(data => data.roleId === selectedRoleId)}
                            loading={tableLoading}
                            scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void 0}}
                            pagination={{
                                pageSize,
                                hideOnSinglePage: true
                            }}
                        />
                    </div>
                </div>
                {showEditModal ? <EditModal record={record} addUserList={dataList}
                                            getDataList={() => this.getDataList(record ? current : 1, record ? keyword : '')}/> : void 0}
                {userVisible ?
                    <TipModal visible={userVisible} message={'删除'} cancelModal={() => this.cancelDeleteModal()}
                              onOK={() => this.handleOk()}/> : void 0}
            </div>
        )
    }
}

export default connect(state => Object.assign({}, {employee: state.employee}, {layout: state.layout}, state.userManagement))(Index)
