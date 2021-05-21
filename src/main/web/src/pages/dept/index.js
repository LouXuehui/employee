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
            current: 1, //当前页码
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
            page: 1,
            search: ''
        }
    }

    componentDidMount() {
        this.getDataList()
    }

    getDataList(current = 1, keyword = '', limit) {
        const {dispatch} = this.props
        dispatch({type: 'dept/selectList'})
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props
        dispatch({type: 'dept/setState', payload: {showEditModal: true}})
    }

    //编辑弹框
    showEditModal(record) {
        const {dispatch} = this.props
        dispatch({type: 'dept/getAuthorGroupList', payload: {id: record.ID}}).then(roleList => {
            if (roleList) {
                dispatch({
                    type: 'dept/setState',
                    payload: {showEditModal: true, record: {...record, roleList}}
                })
            }
        })
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props
        dispatch({type: 'dept/setState', payload: {userVisible: true, record}})
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props
        dispatch({type: 'dept/setState', payload: {userVisible: false, record: ''}})
    }

    //删除
    handleOk() {
        const {current} = this.state
        const {dispatch, record} = this.props
        dispatch({type: 'dept/deleteById', payload: {id: record.id}}).then(res => {
            if (res) {
                this.getDataList(current)
            }
        })
        dispatch({type: 'dept/setState', payload: {userVisible: false, record: ''}})
    }

    getWidth() {
        const dom = document.getElementById('table')
        return dom ? dom.clientWidth : ''
    }

    //搜搜角色
    handleSearchRole(page = 1, search = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props
        this.setState({page})
        dispatch({type: 'role/setState', payload: {rtbLoading: true}})
        dispatch({
            type: 'role/selectList',
            payload: {page, pxid: 1, limit: limit ? limit : pageSize, parm: search, type: 'user'}
        })
    }

    //点击行样式
    setClassName(record) {
        const {checkedState} = this.props
        return record.ID === checkedState.ID ? 'clickRowStyle' : void 0
    }

    //点击行
    clickRow(record, index) {
        const {dispatch} = this.props
        dispatch({type: 'dept/setState', payload: {checkedState: record, spinning: true}})
        dispatch({type: 'dept/getAuthorGroupList', payload: {id: record.ID}})
    }

    //修改角色保存
    saveRoleData() {
        const {dispatch, selectedRowKeys, checkedState} = this.props
        let roleList = []
        selectedRowKeys && selectedRowKeys.length
            ? selectedRowKeys.map(item => {
                let id = item.toString()
                roleList.push(id)
            })
            : void 0
        dispatch({type: 'role/setAuthorGroupList', payload: {id: checkedState.ID, group: roleList}})
    }

    render() {
        const {current, pageSize, keyword} = this.state
        const {showEditModal, userList, tableLoading, userVisible, record, dataList} = this.props
        console.log(dataList, 'dataList222')

        let columns = [
            {
                key: 'isUse',
                dataIndex: 'isUse',
                title: '启用',
                width: 50,
                render: text => {
                    return text==='1' ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: 'name',
                dataIndex: 'name',
                title: '部门名称',
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
                key: 'remark',
                dataIndex: 'remark',
                title: '备注',
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
        ]
        const limit = Math.floor((document.body.clientHeight - 270) / 43)
        let datasource = keyword ? dataList.filter(user => user.name.indexOf(keyword) > -1) : dataList

        return (
            <div className={styles.userWrapper}>
                <div className={styles.top}>
                    <Search
                        placeholder="请输入关键字检索"
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
                <div id="table" className={styles.content}>
                    <Table
                        rowKey={record => record.id}
                        columns={columns}
                        dataSource={datasource}
                        loading={tableLoading}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void 0}}
                        pagination={{
                            pageSize,
                            hideOnSinglePage: true
                        }}
                    />
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

export default connect(state => Object.assign({}, state.dept))(Index)
