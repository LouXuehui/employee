import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Table, Tooltip, Button, Select} from "antd";
import {CheckCircleTwoTone} from '@ant-design/icons'
import moment from "moment";
import {getValueByKey, moneyFormat} from "common/arr";
import Operation from "components/Operation";
import EditModal from './EditModal'
import {IsArchive} from "@/common/domain";

const {Search} = Input;
const {Option} = Select

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            current: 1, //当前页码
            record: "",
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
            isarchive: '2'
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        this.getApprovalList()
        let list = ["ProjectYear", "ProjectClass", "BuyType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getEmployee"}) //人员
        dispatch({type: "dict/getTendType"}) //招标方式
        dispatch({type: 'dict/getDepartment'})
        this.getApprovalList()
    }

    getApprovalList(current = 1, keyword = '') {
        const {pageSize, isarchive} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'approval/setState', payload: {loading: true}})
        dispatch({
            type: "approval/getApprovalList",
            payload: {page: current, pxid: 1, limit: parseInt(pageSize), parm: keyword, isarchive, isArchive: true},
        });
    }

    //归档弹框
    showArchiveModal(record) {
        const {dispatch, archiveModalVisible} = this.props;
        dispatch({type: "approval/setState", payload: {archiveModalVisible: !archiveModalVisible}})
        this.setState({record})
    }

    render() {
        const {keyword, current, pageSize, record, isarchive} = this.state;
        const {archiveList, loading, total, archiveModalVisible, dict} = this.props;
        const {leaderList, ProjectYear, BuyType, ProjectClass, departmentList} = dict
        let columns = [
            {
                key: "IsArchive",
                dataIndex: "IsArchive",
                title: "归档",
                width: 50,
                ellipsis: true,
                render: (text) => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: "ProjectYear",
                dataIndex: "ProjectYear",
                title: "立项年度",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(ProjectYear, text.toString(), 'Code', 'Name')
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
                key: "ArchiveUser",
                dataIndex: "ArchiveUser",
                title: "归档人",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return title;
                },
            },
            {
                key: "ArchiveDate",
                dataIndex: "ArchiveDate",
                title: "归档时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "ExistEntity",
                dataIndex: "ExistEntity",
                title: "存在实体档案",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? '是' : '否'
                }
            },
            {
                key: "Location",
                dataIndex: "Location",
                title: "存放地",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "ArchiveMemo",
                dataIndex: "ArchiveMemo",
                title: "存放备注",
                width: 200,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                title: "操作",
                key: "action",
                width: 80,
                fixed: "right",
                render: (text, record) => (
                    <div className="operation">
                        <Operation name={'编辑'}
                                   onClick={() => this.showArchiveModal(record)}/>
                    </div>
                ),
            },
        ];
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.file}>
                <div className={styles.top}>
                    <div>
                        <Search
                            placeholder="项目名称"
                            onPressEnter={() => this.getApprovalList(current, keyword)}
                            onSearch={() => this.getApprovalList(current, keyword)}
                            onChange={(e) => this.setState({keyword: e.target.value})}
                            style={{width: 200, marginRight: 10}}
                        />
                        <Select style={{width: 120}}
                                value={isarchive}
                                onChange={(value) => this.setState({isarchive: value})}>
                            {IsArchive.map(item => {
                                return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                            })}
                        </Select>
                    </div>
                    <Button onClick={() => this.getApprovalList(1, keyword)}>刷新</Button>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={(record) => record.ID}
                        columns={columns}
                        dataSource={archiveList}
                        loading={loading}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
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
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {
                    archiveModalVisible ?
                        <EditModal modalVisible={archiveModalVisible}
                                   selectedApproval={record}
                                   selectList={() => this.getApprovalList(current, keyword)}
                                   cancelModal={() => this.showArchiveModal()}/> : void (0)
                }
            </div>
        );
    }
}

export default connect(({dict, approval}) => ({dict, ...approval}))(
    File
);

