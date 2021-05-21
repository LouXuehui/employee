import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Button, DatePicker, Input, Select, Table, Tooltip} from "antd";
import moment from "moment";
import Operation from "components/Operation";
import AddModal from "./AddModal";
import {getValueByKey, moneyFormat} from "common/arr";
import TipModal from 'components/TipModal'
import DocumentModal from '../enclosure/EditModal'

const {Search} = Input;
const {RangePicker} = DatePicker;
const {Option} = Select;
const dateFormat = "YYYY-MM-DD";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAnnexModal: false, //上传文件弹框
            keyword: "",
            current: 1, //当前页码
            record: "",
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        this.getApprovalList()
        let list = ["ProjectYear", "ProjectClass", "BuyType", "ProjectFile"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getEmployee"}) //人员
        dispatch({type: "dict/getDepartment"}) //科室
        dispatch({type: 'dict/getProjects'})//项目列表
    }

    getApprovalList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'approval/setState', payload: {loading: true}})
        dispatch({
            type: "approval/getApprovalList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword, isarchive: '0'},
        });
    }

    handleChange(value) {
        this.setState({selectValue: value});
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props;
        dispatch({type: "approval/setState", payload: {showAddModal: true}});
    }

    //编辑
    showEditModal(record) {
        const {dispatch} = this.props;
        let itemData = {
            ...record,
            ApprovalDate: moment(record.ApprovalDate),
            ExpectDate: moment(record.ExpectDate),
            InputDate: moment(record.InputDate),
        };
        dispatch({type: "approval/setState", payload: {showAddModal: true, record: itemData}});
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "approval/setState", payload: {approvalVisible: true, record}});
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "approval/setState", payload: {approvalVisible: false, record: ''}});
    }

    //删除
    handleDelete() {
        const {dispatch, record} = this.props;
        dispatch({type: "approval/deleteApprovalItem", payload: {id: record.ID}}).then(res => {
            res ? this.getApprovalList() : void (0)
        })
        dispatch({type: "approval/setState", payload: {approvalVisible: false, record: ''}});
    }

    //上传弹框
    showAnnexModal(record) {
        const {dispatch} = this.props
        dispatch({type: "approval/setState", payload: {documentModal: true, record}});
    }

    render() {
        const {keyword, current, pageSize} = this.state;
        const {dispatch, showAddModal, record, documentModal, approvalList, loading, total, approvalVisible, dict} = this.props
        const {leaderList, ProjectYear, ProjectClass, BuyType, statusList, departmentList} = dict

        let columns = [
            {
                key: "ProjectYear",
                dataIndex: "ProjectYear",
                title: "立项年度",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(ProjectYear, text, 'Code', 'Name')
                    return title
                }
            },
            {
                key: "Name",
                dataIndex: "Name",
                title: "项目名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "Leader",
                dataIndex: "Leader",
                title: "项目负责人",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return title;
                },
            },
            {
                key: "Assistor",
                dataIndex: "Assistor",
                title: "协助负责人",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return title;
                },
            },
            {
                key: "Class",
                dataIndex: "Class",
                title: "项目类别",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(ProjectClass, text, "Code", "Name") : ''
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                },
            },
            {
                key: "BuyType",
                dataIndex: "BuyType",
                title: "采购方式",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(BuyType, text, "Code", "Name") : ''
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                },
            },
            {
                key: "ApplyDept",
                dataIndex: "ApplyDept",
                title: "申请部门",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(departmentList, text, "Code", "Name") : ''
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                },
            },
            {
                key: "ApprovalDate",
                dataIndex: "ApprovalDate",
                title: "立项时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "Budget",
                dataIndex: "Budget",
                title: "预算金额",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },

            {
                key: "ExpectDate",
                dataIndex: "ExpectDate",
                title: "预计完成时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "AnalyDescribe",
                dataIndex: "AnalyDescribe",
                title: "需求概要",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "Memo",
                dataIndex: "Memo",
                title: "项目需求",
                width: 200,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "PyCode",
                dataIndex: "PyCode",
                title: "拼音码",
                width: 100,
                ellipsis: true,
            },
            {
                key: "WbCode",
                dataIndex: "WbCode",
                title: "五笔码",
                width: 100,
                ellipsis: true,
            },
            {
                key: "InputUser",
                dataIndex: "InputUser",
                title: "录入人",
                width: 100,
                ellipsis: true,
                render: (text) => {
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
                title: "操作",
                key: "action",
                fixed: "right",
                width: 150,
                render: (text, record) => (
                    <div className="operation">
                        <Operation name="上传" addDivider onClick={() => this.showAnnexModal(record)}/>
                        <Operation name="编辑" addDivider onClick={() => this.showEditModal(record)}/>
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ];
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.approval}>
                <div className={styles.header}>
                    <div className={styles.toolLeft}>
                        <Search
                            placeholder="项目名称"
                            onPressEnter={() => this.getApprovalList(1, keyword)}
                            onSearch={() => this.getApprovalList(1, keyword)}
                            onChange={(e) => this.setState({keyword: e.target.value})}
                            style={{width: 200, marginRight: 10}}
                        />
                    </div>
                    <div className={styles.headerRight}>
                        <Button onClick={() => this.getApprovalList(1, keyword)}>刷新</Button>
                        <Button type="primary" onClick={() => this.handleAdd()}>
                            新增
                        </Button>
                    </div>
                </div>
                <div className={styles.tableStyles}>
                    <Table
                        columns={columns}
                        dataSource={approvalList}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                        loading={loading}
                        pagination={{
                            pageSize,
                            current,
                            total,
                            onChange: (current) => {
                                this.getApprovalList(current, keyword)
                            },
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.getApprovalList(current, keyword, size)
                            },
                        }}
                    />
                </div>
                {showAddModal ? (
                    <AddModal
                        visible={showAddModal}
                        record={record}
                        selectList={() => this.getApprovalList(record ? current : 1, record ? keyword : '')}
                    />
                ) : (
                    void 0
                )}
                {documentModal ? (
                    <DocumentModal
                        documentVisible={documentModal}
                        cancelModal={() => dispatch({type: 'approval/setState', payload: {documentModal: false}})}
                        selectedProject={record}
                        record={''}
                        selectList={() => this.getApprovalList(record ? current : 1, record ? keyword : '')}
                    />
                ) : (
                    void 0
                )}
                {
                    approvalVisible ?
                        <TipModal visible={approvalVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleDelete()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect(({dict, approval}) => ({dict, ...approval}))(
    Index
);
