/**
 * Created by lxh on 2020/4/27
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Input, Table, Button, Tooltip} from 'antd'
import {CheckCircleTwoTone} from '@ant-design/icons'
import Operation from 'components/Operation'
import EditModal from "./EditModal"
import TipModal from 'components/TipModal'
import Tree from 'components/Tree'
import Loading from '../../../Loading'
import {buildTree} from 'common/treeUtil'
import {searchByPy} from "@/common/pinYinUtil";
import folder from '../../../assets/folder.png'
import closeFolder from '../../../assets/closeFolder.png'
import documentPng from '../../../assets/document.png'

const {Search} = Input
const data = [{ID: "ROOT", parentId: "root", Name: "系统字典设置"}]

class Dict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: Math.floor((document.body.clientHeight - 270) / 43), //显示行数
            current: 1, //当前页面
            searchWord: '',//左侧树检索
            keyword: "", //检索关键字
            visible: false, //删除弹窗
        }
    }

    componentDidMount() {
        this.loadData()
    }

    //查询数据
    loadData() {
        const {current, pageSize, keyword} = this.state
        const {dispatch} = this.props
        dispatch({type: 'dict/selectList'}).then(res => {
            if (res) {
                const {selectedDict} = this.props
                dispatch({type: 'dict/setState', payload: {tableLoading: true}})
                dispatch({
                    type: 'dict/getDictById',
                    payload: {section: selectedDict.Code, page: current, limit: pageSize, parm: keyword, pxid: 1}
                })
            }
        })
    }

    //删除框
    showDeleteModal(record) {
        const {visible} = this.state
        const {dispatch} = this.props
        dispatch({type: 'dict/setState', payload: {selectedCode: record}})
        this.setState({visible: !visible})
    }

    //删除
    deleteById() {
        const {keyword, current} = this.state
        const {dispatch, selectedCode, selectedDict} = this.props
        dispatch({type: 'dict/deleteById', payload: {id: selectedCode.ID}}).then(res => {
            if (res) {
                this.selectItem(selectedDict, current, keyword)
            }
        })
        this.showDeleteModal()
    }

    //新增或更新
    addOrUpdate(record) {
        const {dispatch} = this.props
        dispatch({type: 'dict/setState', payload: {selectedCode: record, modalVisible: true}})
    }

    selectItem(record, current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props
        this.setState({current})
        dispatch({type: 'dict/setState', payload: {selectedDict: record, tableLoading: true}})
        dispatch({
            type: 'dict/getDictById',
            payload: {section: record.Code, page: current, limit: limit ? limit : pageSize, parm: keyword, pxid: 1}
        })
    }

    getTreeIcon(record) {
        if (record.parentId === 'root') {
            if (record.open) {
                return folder
            } else {
                return closeFolder
            }
        } else {
            return documentPng
        }
    }

    searchTree(nodeTree, searchWord) {
        let tempTree = []
        nodeTree.filter(one => searchByPy(searchWord, one.Name)).map(item => {
            if (tempTree.filter(temp => temp.ID === item.ID).length == 0) {
                tempTree.push(item)
                searchParent(item)
            }
        })

        function searchParent(one) {
            nodeTree.map(oneList => {
                if (oneList.ID === one.parentId) {
                    if (tempTree.filter(temp => temp.ID === oneList.ID).length == 0) {
                        tempTree.push(oneList)
                        searchParent(oneList)
                    }
                }
            })
        }

        return tempTree
    }

    render() {
        const {pageSize, current, visible, keyword, searchWord} = this.state
        const {dictList, dataList, tableLoading, modalVisible, selectedDict, selectedCode, loading, total} = this.props
        const list = data.concat(dictList)
        const {dataSource} = buildTree(searchWord ? this.searchTree(list, searchWord) : list, 'ID', 'parentId', 'root')
        const columns = [
            {
                key: "IsUse",
                dataIndex: "IsUse",
                title: "是否启用",
                width: 80,
                render: (text) => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                },
            },
            {
                key: "Code",
                dataIndex: "Code",
                title: "代码",
                width: 80,
                ellipsis: true,
            },
            {
                key: "Name",
                dataIndex: "Name",
                title: "名称",
                width: 200,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "Memo",
                dataIndex: "Memo",
                title: "备注",
                width: 200,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "action",
                dataIndex: "action",
                title: "操作",
                width: 100,
                fixed: 'right',
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.addOrUpdate(record)}/>
                        <div><span className={'delete'}
                                   onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ]
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return <div className={styles.pageWrapper}>
            {
                loading ? <Loading/> : <div className={styles.contentWrapper}>
                    <div className={styles.contentLeft}>
                        <div className={styles.tool}>
                            <Search style={{width: 200}}
                                    placeholder={'字典名称'}
                                    onChange={e => this.setState({searchWord: e.target.value})}/>
                        </div>
                        <div className={styles.treeWrap}>
                            <Tree
                                idField="ID"
                                titleContent={(record) => [<img className={styles.icon}
                                                                src={this.getTreeIcon(record)}/>,
                                    <span className={'ellipsis'}>{record.Name}</span>]}
                                dataSource={dataSource}
                                expandedKeys={['ROOT']}
                                unfoldingMode="arrow"
                                defaultKey={selectedDict ? selectedDict.ID : ''}
                                onSelect={(record) => {
                                    if (record.ID !== 'ROOT') {
                                        this.selectItem(record)
                                    }
                                }}
                                editContent={() => {
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.contentRight}>
                        <div className={styles.tool}>
                            <div className={styles.toolLeft}>
                                <Search style={{width: 200}}
                                        placeholder={'名称'}
                                        onSearch={() => this.selectItem(selectedDict, 1, keyword)}
                                        onPressEnter={() => this.selectItem(selectedDict, 1, keyword)}
                                        onChange={e => this.setState({keyword: e.target.value})}/>
                            </div>
                            <div className={styles.toolRight}>
                                <Button onClick={() => this.selectItem(selectedDict, 1, keyword)}>刷新</Button>
                                <Button type={'primary'} onClick={() => this.addOrUpdate()}>新增</Button>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <Table loading={tableLoading}
                                   rowKey={(record) => record.Code}
                                   columns={columns}
                                   dataSource={dataList}
                                   scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                                   pagination={{
                                       pageSize,
                                       current,
                                       total,
                                       onChange: (current) => {
                                           this.selectItem(selectedDict, current, keyword)
                                       },
                                       showSizeChanger: true,
                                       onShowSizeChange: (current, size) => {
                                           this.setState({pageSize: size})
                                           this.selectItem(selectedDict, current, keyword, size)
                                       },
                                   }}
                                   scrollToFirstRowOnChange={true}
                            />
                        </div>
                    </div>
                </div>
            }

            {modalVisible ? <EditModal
                loadData={() => this.selectItem(selectedDict, selectedCode ? current : 1, selectedCode ? keyword : '')}/> : void (0)}
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

export default connect(({dict}) => ({...dict}))(Dict)
