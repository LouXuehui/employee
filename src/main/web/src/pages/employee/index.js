import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Input, Table, Tooltip, Button} from 'antd'
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
            record: '',
            pageSize: Math.floor((document.body.clientHeight - 270) / 43)
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props
        dispatch({
            type: 'employee/selectList',
        })
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props
        dispatch({type: 'employee/setState', payload: {showEditModal: true}})
    }

    //编辑弹框
    showEditModal(record) {
        const {dispatch} = this.props
        dispatch({type: 'employee/setState', payload: {showEditModal: true, record}})
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props
        dispatch({type: 'employee/setState', payload: {deleteVisible: true, record}})
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props
        dispatch({type: 'employee/setState', payload: {deleteVisible: false, record: ''}})
    }

    //删除
    handleOk() {
        const {current, keyword} = this.state
        const {dispatch, record} = this.props
        dispatch({
            type: 'employee/deleteById',
            payload: {id: record.id}
        }).then(res => (res ? this.loadData(current, keyword) : void 0))
        dispatch({type: 'employee/setState', payload: {deleteVisible: false, record: ''}})
    }

    render() {
        const {record, current, pageSize, keyword} = this.state
        const {showEditModal, dataList, loading, deleteVisible} = this.props
        let columns = [
            {
                key: 'statusCode',
                dataIndex: 'statusCode',
                title: '状态',
                width: 50,
                render: text => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: 'id',
                dataIndex: 'id',
                title: '工号',
                width: 80,
                ellipsis: true
            },
            {
                key: 'name',
                dataIndex: 'name',
                title: '姓名',
                width: 150,
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
                key: 'sexCode',
                dataIndex: 'sexCode',
                title: '性别',
                width: 50,
                ellipsis: true,
                render: text => {
                    return text === '1' ? '男' : '女'
                }
            },
            {
                key: 'birth',
                dataIndex: 'birth',
                title: '出生日期',
                width: 120,
                ellipsis: true,
                render: text => {
                    return text ? moment(text).format('YYYY-MM-DD') : ''
                }
            },
            {
                key: 'tel',
                dataIndex: 'tel',
                title: '移动电话',
                width: 120,
                ellipsis: true
            },
            {
                key: 'idCard',
                dataIndex: 'idCard',
                title: '身份证号',
                width: 180,
                ellipsis: true
            },
            {
                key: 'place',
                dataIndex: 'place',
                title: '籍贯',
                width: 180,
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
                key: 'address',
                dataIndex: 'address',
                title: '地址',
                width: 150,
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
                width: 150,
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
                fixed: 'right',
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
            <div className={styles.file}>
                <div className={styles.top}>
                    <Search
                        placeholder="请输入检索关键字"
                        onChange={e => this.setState({keyword: e.target.value})}
                        style={{width: 200, marginRight: 10}}
                    />
                    <div className={styles.headerRight}>
                        <Button onClick={() => this.loadData(1, keyword)}>刷新</Button>
                        <Button type="primary" onClick={() => this.handleAdd()}>
                            新增
                        </Button>
                    </div>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={record => record.id}
                        columns={columns}
                        dataSource={datasource}
                        loading={loading.effects['employee/selectList']}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void 0}}
                        pagination={{
                            pageSize,
                            hideOnSinglePage: true,
                        }}
                    />
                </div>
                {showEditModal ?
                    <EditModal selectList={() => this.loadData(record ? current : 1, record ? keyword : '')}/> : void 0}
                {deleteVisible ?
                    <TipModal visible={deleteVisible} message={'删除'} cancelModal={() => this.cancelDeleteModal()}
                              onOK={() => this.handleOk()}/> : void 0}
            </div>
        )
    }
}

export default connect(({dict, employee, loading}) => ({dict, ...employee, loading}))(Index)
