import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Input, Table, Tooltip, Spin } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import moment from 'moment'
import TipModal from 'components/TipModal'
import Operation from 'components/Operation'
import EditModal from './EditModal'

const { Search } = Input

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
    const { dispatch } = this.props
    this.getDataList()
  }

  getDataList(current = 1, keyword = '', limit) {
    const { pageSize, search } = this.state
    const { dispatch } = this.props
    this.setState({ current })
  }

  //新增
  handleAdd() {
    const { dispatch } = this.props
    dispatch({ type: 'userManagement/setState', payload: { showEditModal: true } })
  }

  //编辑弹框
  showEditModal(record) {
    const { dispatch } = this.props
    dispatch({ type: 'userManagement/getAuthorGroupList', payload: { id: record.ID } }).then(roleList => {
      if (roleList) {
        dispatch({
          type: 'userManagement/setState',
          payload: { showEditModal: true, record: { ...record, roleList } }
        })
      }
    })
  }

  //显示删除提示框
  showDeleteModal(record) {
    const { dispatch } = this.props
    dispatch({ type: 'userManagement/setState', payload: { userVisible: true, record } })
  }

  //关闭删除提示框
  cancelDeleteModal() {
    const { dispatch } = this.props
    dispatch({ type: 'userManagement/setState', payload: { userVisible: false, record: '' } })
  }

  //删除
  handleOk() {
    const { current } = this.state
    const { dispatch, record } = this.props
    dispatch({ type: 'userManagement/deleteUserItem', payload: { id: record.ID } }).then(res => {
      if (res) {
        this.getDataList(current)
      }
    })
    dispatch({ type: 'userManagement/setState', payload: { userVisible: false, record: '' } })
  }

  getWidth() {
    const dom = document.getElementById('table')
    return dom ? dom.clientWidth : ''
  }

  //搜搜角色
  handleSearchRole(page = 1, search = '', limit) {
    const { pageSize } = this.state
    const { dispatch } = this.props
    this.setState({ page })
    dispatch({ type: 'role/setState', payload: { rtbLoading: true } })
    dispatch({
      type: 'role/selectList',
      payload: { page, pxid: 1, limit: limit ? limit : pageSize, parm: search, type: 'user' }
    })
  }

  //点击行样式
  setClassName(record) {
    const { checkedState } = this.props
    return record.ID === checkedState.ID ? 'clickRowStyle' : void 0
  }

  //点击行
  clickRow(record, index) {
    const { dispatch } = this.props
    dispatch({ type: 'userManagement/setState', payload: { checkedState: record, spinning: true } })
    dispatch({ type: 'userManagement/getAuthorGroupList', payload: { id: record.ID } })
  }

  //修改角色保存
  saveRoleData() {
    const { dispatch, selectedRowKeys, checkedState } = this.props
    let roleList = []
    selectedRowKeys && selectedRowKeys.length
      ? selectedRowKeys.map(item => {
          let id = item.toString()
          roleList.push(id)
        })
      : void 0
    dispatch({ type: 'role/setAuthorGroupList', payload: { id: checkedState.ID, group: roleList } })
  }

  render() {
    const { current, pageSize, keyword, page, search } = this.state
    const { dispatch, showEditModal, userList, tableLoading, total, userVisible, record, employee, role, selectedRowKeys, roleList, spinning } = this.props
    const { dataList } = employee
    const { roleList: roleAllList, rtbLoading } = role

    let columns = [
      {
        key: 'IsUse',
        dataIndex: 'IsUse',
        title: '启用',
        width: 50,
        render: text => {
          return text ? <CheckCircleTwoTone /> : <div className={'circle'} />
        }
      },
      {
        key: 'UserCode',
        dataIndex: 'UserCode',
        title: '登录名',
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
        key: 'UserName',
        dataIndex: 'UserName',
        title: '姓名',
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
        key: 'EmployeeNo',
        dataIndex: 'EmployeeNo',
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
        key: 'LoginTimes',
        dataIndex: 'LoginTimes',
        title: '登录次数',
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
        key: 'LastTime',
        dataIndex: 'LastTime',
        title: '最后登录时间',
        width: 120,
        ellipsis: true,
        render: text => {
          return text ? moment(text).format('YYYY-MM-DD') : ''
        }
      },
      {
        key: 'LastIP',
        dataIndex: 'LastIP',
        title: '最后登录IP',
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
        key: 'LastHost',
        dataIndex: 'LastHost',
        title: '最后登录机器',
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
        title: '操作',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <div className="operation">
            <Operation name="编辑" addDivider onClick={() => this.showEditModal(record)} />
            <div>
              <span className={'delete'} onClick={() => this.showDeleteModal(record)}>
                删除
              </span>
            </div>
          </div>
        )
      }
    ]
    const roleColumns = [
      {
        key: 'Name',
        dataIndex: 'Name',
        title: '角色名称',
        ellipsis: true,
        width: 150,
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
        key: 'Memo',
        dataIndex: 'Memo',
        title: '备注',
        ellipsis: true,
        width: 200,
        render: text => {
          return (
            <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
          )
        }
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({ type: 'userManagement/setState', payload: { selectedRowKeys } })
      }
    }
    const limit = Math.floor((document.body.clientHeight - 270) / 43)
    const tableWidth = this.getWidth()

    return (
      <div className={styles.userWrapper}>
        <div className={styles.left}>
          <div className={styles.top}>
            <Search
              placeholder="姓名"
              onPressEnter={() => this.getDataList(current, keyword)}
              onSearch={() => this.getDataList(current, keyword)}
              onChange={e => this.setState({ keyword: e.target.value })}
              style={{ width: 200, marginRight: 10 }}
            />
            <div className={styles.headerRight}>
              <Button onClick={() => this.getDataList(current, keyword)}>刷新</Button>
              <Button type="primary" onClick={() => this.handleAdd()}>
                新增
              </Button>
            </div>
          </div>
          <div id="table" className={styles.content}>
            <Table
              rowKey={record => record.ID}
              columns={columns}
              dataSource={userList}
              loading={tableLoading}
              scroll={{ x: '100%', y: pageSize > limit ? limit * 43 : void 0 }}
              pagination={{
                pageSize,
                current,
                total,
                onChange: current => {
                  this.getDataList(current, keyword)
                },
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  this.setState({ pageSize: size })
                  this.getDataList(current, keyword, size)
                }
              }}
              scrollToFirstRowOnChange={true}
              rowClassName={record => this.setClassName(record)}
              onRow={(record, index) => {
                //表格行点击事件
                return {
                  onClick: () => {
                    this.clickRow(record, index)
                  }
                }
              }}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <Search
              placeholder="请输入角色名称"
              onPressEnter={() => this.handleSearchRole(page, search)}
              onSearch={() => this.handleSearchRole(page, search)}
              onChange={e => this.setState({ search: e.target.value })}
              style={{ width: 200, marginRight: 10 }}
            />
            <div className={styles.rightBtn}>
              <Button onClick={() => this.handleSearchRole(page, search)}>刷新</Button>
              <Button type="primary" onClick={() => this.saveRoleData()}>
                保存
              </Button>
            </div>
          </div>
          <Spin spinning={spinning}>
            <Table rowKey={record => record.ID} columns={roleColumns} dataSource={roleAllList} scrollToFirstRowOnChange={true} rowSelection={rowSelection} loading={rtbLoading} />
          </Spin>
        </div>
        {showEditModal ? <EditModal record={record} addUserList={dataList} getDataList={() => this.getDataList(record ? current : 1, record ? keyword : '')} /> : void 0}
        {userVisible ? <TipModal visible={userVisible} message={'删除'} cancelModal={() => this.cancelDeleteModal()} onOK={() => this.handleOk()} /> : void 0}
      </div>
    )
  }
}

export default connect(state => Object.assign({}, { employee: state.employee }, { role: state.role }, state.userManagement))(Index)
