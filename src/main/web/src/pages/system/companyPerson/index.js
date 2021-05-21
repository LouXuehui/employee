import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Table, Tooltip, Button} from "antd";
import {CheckCircleTwoTone} from '@ant-design/icons'
import moment from "moment";
import TipModal from 'components/TipModal'
import Operation from "components/Operation";
import EditModal from "./EditModal"
import {getValueByKey} from "@/common/arr";

const {Search} = Input;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            current: 1, //当前页码
            record: "",
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let list = ["SexCode", "EmployeeTitle"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getDepartment'})
        this.loadData()
    }

    loadData(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'employee/setState', payload: {loading: true}})
        dispatch({
            type: "employee/selectList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props;
        dispatch({type: "employee/setState", payload: {showEditModal: true}});
    }

    //编辑弹框
    showEditModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "employee/setState", payload: {showEditModal: true, record}});
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "employee/setState", payload: {deleteVisible: true, record}});
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "employee/setState", payload: {deleteVisible: false, record: ''}});
    }

    //删除
    handleOk() {
        const {current, keyword} = this.state
        const {dispatch, record} = this.props
        dispatch({
            type: "employee/deleteById",
            payload: {id: record.ID}
        }).then(res => res ? this.loadData(current, keyword) : void (0))
        dispatch({type: "employee/setState", payload: {deleteVisible: false, record: ''}});
    }

    render() {
        const {record, current, pageSize, keyword} = this.state;
        const {showEditModal, dataList, loading, total, deleteVisible, dict} = this.props
        const {SexCode, departmentList, EmployeeTitle} = dict
        let columns = [
            {
                key: "Status",
                dataIndex: "Status",
                title: "状态",
                width: 50,
                render: (text) => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: "Code",
                dataIndex: "Code",
                title: "工号",
                width: 80,
                ellipsis: true,
            }, {
                key: "Name",
                dataIndex: "Name",
                title: "姓名",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "CardID",
                dataIndex: "CardID",
                title: "卡号",
                width: 150,
                ellipsis: true,
            },
            {
                key: "Title",
                dataIndex: "Title",
                title: "职务",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(EmployeeTitle, text.toString(), 'Code', 'Name')
                    return title
                }
            },
            {
                key: "Age",
                dataIndex: "Age",
                title: "年龄",
                width: 50,
                ellipsis: true,
            },
            {
                key: "DeptCode",
                dataIndex: "DeptCode",
                title: "科室",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(departmentList, text.toString(), 'Code', 'Name')
                    return title
                }
            },
            {
                key: "Sex",
                dataIndex: "Sex",
                title: "性别",
                width: 50,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(SexCode, text.toString(), 'Code', 'Name')
                    return title
                }
            },
            {
                key: "BirthDate",
                dataIndex: "BirthDate",
                title: "出生日期",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format('YYYY-MM-DD') : ''
                }
            },
            {
                key: "Mobile",
                dataIndex: "Mobile",
                title: "移动电话",
                width: 120,
                ellipsis: true,
            },
            {
                key: "HomeTel",
                dataIndex: "HomeTel",
                title: "家庭电话",
                width: 120,
                ellipsis: true,
            },
            {
                key: "OfficeTel",
                dataIndex: "OfficeTel",
                title: "办公电话",
                width: 120,
                ellipsis: true,
            }, {
                key: "IDNumber",
                dataIndex: "IDNumber",
                title: "身份证号",
                width: 150,
                ellipsis: true,
            },
            {
                key: "BirthPlace",
                dataIndex: "BirthPlace",
                title: "籍贯",
                width: 180,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            }, {
                key: "Address",
                dataIndex: "Address",
                title: "地址",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
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
        ]
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.file}>
                <div className={styles.top}>
                    <Search
                        placeholder="请输入检索条件"
                        onPressEnter={() => this.loadData(1, keyword)}
                        onSearch={() => this.loadData(1, keyword)}
                        onChange={(e) => this.setState({keyword: e.target.value})}
                        style={{width: 200, marginRight: 10}}
                    />
                    <div className={styles.headerRight}>
                        <Button onClick={() => this.loadData(1, keyword)}>刷新</Button>
                        <Button type='primary' onClick={() => this.handleAdd()}>新增</Button>
                    </div>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={(record) => record.ID}
                        columns={columns}
                        dataSource={dataList}
                        loading={loading}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
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
                                this.loadData(current, keyword, size)
                            },
                        }}
                        // scrollToFirstRowOnChange={true}
                    />
                </div>
                {showEditModal ? <EditModal
                    selectList={() => this.loadData(record ? current : 1, record ? keyword : '')}/> : void (0)}
                {
                    deleteVisible ?
                        <TipModal visible={deleteVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleOk()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect(({dict, employee}) => ({dict, ...employee}))(Index);
