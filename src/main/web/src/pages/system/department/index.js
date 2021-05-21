import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Button, Input, Table, Tooltip} from "antd";
import {CheckCircleTwoTone} from '@ant-design/icons'
import moment from "moment";
import TipModal from 'components/TipModal'
import Operation from "components/Operation";
import EditModal from "./EditModal"
import {getValueByKey} from "@/common/arr";
import {OutFlag} from "@/common/domain";

const {Search} = Input;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            current: 1, //当前页码
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let list = ["DepartmentClass"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getProjects'})//项目列表
        dispatch({type: "dict/getCompanyList"}) //公司
        dispatch({type: "dict/getEmployee"}) //人员
        this.getDataList()
    }

    getDataList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'department/setState', payload: {loading: true}})
        dispatch({
            type: "department/getDepartmentList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props;
        dispatch({type: "department/setState", payload: {showEditModal: true}});
    }

    //编辑弹框
    showEditModal(record) {
        const {dispatch} = this.props;
        let itemData = {
            ...record,
            LastTime: moment(record.LastTime),
        }
        dispatch({type: "department/setState", payload: {showEditModal: true, record: itemData}});
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "department/setState", payload: {departmentVisible: true, record}});
    }


    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "department/setState", payload: {departmentVisible: false, record: ''}});
    }

    //删除
    handleOk() {
        const {keyword} = this.state
        const {dispatch, record} = this.props;
        dispatch({type: "department/deleteDepartmentItem", payload: {id: record.ID}}).then(res => {
            if (res) {
                this.getDataList(1, keyword)
            }
        })
        dispatch({type: "department/setState", payload: {departmentVisible: false, record: ''}});

    }

    render() {
        const {current, pageSize, keyword} = this.state;
        const {showEditModal, departmentList, loading, total, departmentVisible, record, dict} = this.props;
        const {DepartmentClass, leaderList} = dict
        let columns = [
            {
                key: "IsUse",
                dataIndex: "IsUse",
                title: "启用",
                width: 50,
                render: (text) => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                },
            },
            {
                key: "Name",
                dataIndex: "Name",
                title: "部门名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "DeptClass",
                dataIndex: "DeptClass",
                title: "科室分类",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(DepartmentClass, text.toString(), 'Code', 'Name')
                    return title
                }
            },
            {
                key: "OutFlag",
                dataIndex: "OutFlag",
                title: "外部标志",
                width: 80,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(OutFlag, text, 'Code', 'Name')
                    return title
                }
            },
            {
                key: "Liaison",
                dataIndex: "Liaison",
                title: "联络人",
                width: 100,
                ellipsis: true,
                render: (text => {
                    let title = getValueByKey(leaderList, text, 'Code', 'Name')
                    return title
                })
            },
            {
                key: "Telephone",
                dataIndex: "Telephone",
                title: "电话",
                width: 120,
                ellipsis: true,
            },
            {
                key: "Memo",
                dataIndex: "Memo",
                title: "备注",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                title: "操作",
                key: "action",
                width: 100,
                fixed: "right",
                render: (text, record) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.showEditModal(record)}/>
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ];
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.file}>
                <div className={styles.top}>
                    <Search
                        placeholder="部门名称"
                        onSearch={() => this.getDataList(1, keyword)}
                        onPressEnter={() => this.getDataList(1, keyword)}
                        onChange={(e) => this.setState({keyword: e.target.value})}
                        style={{width: 200, marginRight: 10}}
                    />
                    <div className={styles.headerRight}>
                        <Button onClick={() => this.getDataList(1, keyword)}>刷新</Button>
                        <Button type='primary' onClick={() => this.handleAdd()}>新增</Button>
                    </div>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={(record) => record.ID}
                        columns={columns}
                        dataSource={departmentList}
                        loading={loading}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                        pagination={{
                            pageSize,
                            current,
                            total,
                            onChange: (current) => {
                                this.getDataList(current, keyword)
                            },
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.getDataList(current, keyword, size)
                            },
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {
                    showEditModal ?
                        <EditModal record={record}
                                   getDataList={() => this.getDataList(record ? current : 1, record ? keyword : '')}
                        /> : void (0)
                }
                {
                    departmentVisible ?
                        <TipModal visible={departmentVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleOk()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.department))(Index);
