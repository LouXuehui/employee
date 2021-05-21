/**
 * Created by lxh on 2020/4/27
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Input, Table, Button, Tooltip, Tree, Empty} from 'antd'
import moment from 'moment'
import Operation from 'components/Operation'
import EditModal from "./EditModal"
import TipModal from 'components/TipModal'
import {getValueByKey} from "@/common/arr";

const {Search} = Input
const {TreeNode} = Tree

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: Math.floor((document.body.clientHeight - 270) / 43), //显示行数
            page: 1, //当前页面
            keyword: "", //检索关键字
            visible: false, //删除弹窗
            treeData: [], //树
            checkedKeys: [], //选中页面
        }
    }

    componentDidMount() {
        const {dispatch} = this.props
        this.loadData()
        dispatch({type: 'role/getAllMenuList'}).then((allMenuList) => {
            this.setState({treeData: allMenuList})
        })
        dispatch({type: "dict/getEmployee"}) //人员
    }

    //查询数据
    loadData(page = 1, parm = '', selectedRole, limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props
        this.setState({current: page})
        dispatch({type: 'role/setState', payload: {tableLoading: true}})
        dispatch({
            type: 'role/selectList',
            payload: {page, pxid: 1, limit: limit ? limit : pageSize, parm, selectedRole}
        })
    }

    //删除框
    showDeleteModal(record) {
        const {visible} = this.state
        const {dispatch} = this.props
        dispatch({type: 'role/setState', payload: {selectedRole: record}})
        this.setState({visible: !visible})
    }

    //删除
    deleteById() {
        const {dispatch, selectedRole} = this.props
        dispatch({type: 'role/deleteById', payload: {id: selectedRole.ID}}).then(res => {
            if (res) {
                this.loadData()
            }
        })
        this.showDeleteModal()
    }

    //新增或更新
    addOrUpdate(record) {
        const {dispatch} = this.props
        dispatch({type: 'role/setState', payload: {selectedRole: record, modalVisible: true}})
    }

    //检索树
    onChangeTree(e) {
        const {value} = e.target;
        const {allMenuList} = this.props
        let treeData = []
        allMenuList.map(item => {
            let MenuItem = item.MenuItem
            if (MenuItem && MenuItem.length) {
                let tempList = []
                MenuItem.map(child => {
                    if (child.Name.indexOf(value) > -1) {
                        tempList.push(child)
                    }
                })
                treeData.push({...item, MenuItem: tempList})
            } else {
                if (item.Name.indexOf(value) > -1) {
                    treeData.push(item)
                }
            }
        })
        this.setState({treeData})
    }

    //保存项目权限
    saveTree() {
        const {dispatch, selectedRole, menuList} = this.props
        dispatch({type: 'role/setMenuList', payload: {id: selectedRole.ID, menu: menuList}})
    }

    //树节点渲染
    renderTreeNode(list) {
        return list.map(data => {
            let MenuItem = data.MenuItem || []
            return <TreeNode key={data.ID} title={data.Name}>
                {this.renderTreeNode(MenuItem)}
            </TreeNode>
        })
    }

    renderFlex() {
        const {pageSize, current, total, treeData, checkedKeys, keyword} = this.state
        const {dispatch, dataList, tableLoading, modalVisible, selectedRole, menuList} = this.props
        const columns = [
            {
                key: "Name",
                dataIndex: "Name",
                title: "角色名称",
                ellipsis: true,
                render: (text) => {
                    return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
            },
            {
                key: "Memo",
                dataIndex: "Memo",
                title: "备注",
                ellipsis: true,
                render: (text) => {
                    return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
            },
            {
                key: "action",
                dataIndex: "action",
                title: "操作",
                width: 100,
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.addOrUpdate(record)}/>
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ]
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return <div className={styles.contentWrapper}>
            <div className={styles.contentLeft}>
                <div className={styles.tool}>
                    <div className={styles.toolLeft}>
                        <Search style={{width: 200}}
                                placeholder={'角色名称'}
                                onChange={e => this.setState({keyword: e.target.value})}/>
                    </div>
                    <div className={styles.toolRight}>
                        <Button onClick={() => this.loadData(1, keyword)}>刷新</Button>
                        <Button type={'primary'} onClick={() => this.addOrUpdate()}>新增</Button>
                    </div>
                </div>
                <Table loading={tableLoading}
                       rowKey={(record) => record.ID}
                       columns={columns}
                       scroll={{y: pageSize > limit ? limit * 43 : void (0)}}
                       dataSource={dataList}
                       pagination={{
                           pageSize,
                           current,
                           total,
                           onChange: (current) => {
                               this.loadData(current, keyword)
                           },
                           showSizeChanger: true,
                           onShowSizeChange: (current, size) => {
                               this.setState({pageSize: size})
                               this.loadData(current, keyword, '', size)
                           },
                       }}
                       scrollToFirstRowOnChange={true}
                       rowClassName={(record) => {
                           return selectedRole &&
                           record.ID === selectedRole.ID
                               ? "clickRowStyle"
                               : void 0;
                       }}
                       onRow={(record, index) => {
                           return {
                               onClick: (event) => {
                                   dispatch({type: 'role/setState', payload: {selectedRole: record}})
                                   dispatch({type: 'role/getMenuList', payload: {id: record.ID}})
                               }, // 点击行
                           };
                       }}
                />
            </div>
            <div className={styles.contentRight}>
                <div className={styles.tool}>
                    <div className={styles.toolLeft}>
                        <Search style={{width: 200}}
                                placeholder={'页面模块'}
                                onChange={::this.onChangeTree}/>
                    </div>
                    <div className={styles.toolRight}>
                        <Button type={'primary'} onClick={() => this.saveTree()}>保存</Button>
                    </div>
                </div>
                <div className={styles.treeWrapper}>
                    {treeData && treeData.length ?
                        <Tree checkable
                              selectable={false}
                              defaultExpandAll={true}
                              checkedKeys={menuList}
                              onCheck={(selectedKeys) => {
                                  dispatch({
                                      type: 'role/setState',
                                      payload: {menuList: selectedKeys}
                                  })
                              }}>{this.renderTreeNode(treeData)}</Tree> :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                </div>
            </div>
        </div>
    }

    render() {
        const {pageSize, current, total, visible, keyword} = this.state
        const {modalVisible, selectedRole, dict} = this.props
        const {leaderList} = dict
        const columns = [
            {
                key: "RoleID",
                dataIndex: "RoleID",
                title: "角色ID",
            },
            {
                key: "Name",
                dataIndex: "Name",
                title: "角色名称",
                ellipsis: true,
                render: (text) => {
                    return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
            },
            {
                key: "InputUser",
                dataIndex: "InputUser",
                title: "录入人",
                width: 100,
                ellipsis: true,
                render: (text, record) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return title;
                },
            },
            {
                key: "InputDate",
                dataIndex: "InputDate",
                title: "录入时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "Memo",
                dataIndex: "Memo",
                title: "备注",
                ellipsis: true,
                render: (text) => {
                    return <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
            },
            {
                key: "action",
                dataIndex: "action",
                title: "操作",
                width: 100,
                fixed: "right",
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.addOrUpdate(record)}/>
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ]

        return <div className={styles.pageWrapper}>
            {this.renderFlex(columns)}
            {modalVisible ? <EditModal
                loadData={() => this.loadData(selectedRole ? current : 1, selectedRole ? keyword : '', selectedRole)}/> : void (0)}
            {
                visible ?
                    <TipModal visible={visible}
                              message={'删除'}
                              cancelModal={() => this.showDeleteModal()}
                              onOK={() => this.deleteById()}
                    /> : void (0)
            }
        </div>
    }
}

export default connect(({dict, role}) => ({dict, ...role}))(Role)
