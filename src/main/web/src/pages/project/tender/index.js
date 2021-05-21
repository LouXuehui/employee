import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Button, Table, Tooltip} from "antd";
import Operation from "components/Operation";
import EditModal from "./EditModal";
import moment from "moment";
import TipModal from 'components/TipModal'
import {getValueByKey, moneyFormat} from "@/common/arr";

const {Search} = Input;
const clientHeight = document.body.clientHeight;

class Tender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
            current: 1,
            keyword: "",

        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let list = ["TendType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getProjects'})
        dispatch({type: "dict/getEmployee"}) //人员
        this.getTenderList()
    }

    getTenderList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'tender/setState', payload: {tableLoading: true}})
        dispatch({
            type: "tender/getTenderList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    add() {
        const {dispatch} = this.props;
        dispatch({type: "tender/setState", payload: {tenderModalVisible: true, record: ""},});
    }

    //编辑
    update(record) {
        const {dispatch} = this.props;
        let itemData = {
            ...record,
            PublicityDate: moment(record.PublicityDate),
            TenderDate: moment(record.TenderDate),
        };
        dispatch({type: "tender/setState", payload: {tenderModalVisible: true, record: itemData}});
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "tender/setState", payload: {tenderDeleteVisible: true, record}});
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "tender/setState", payload: {tenderDeleteVisible: false, record: ''}});
    }

    //删除
    handleDelete() {
        const {dispatch, record} = this.props;
        dispatch({
            type: "tender/deleteTenderItem",
            payload: {id: record.TenderID}
        }).then(res => res ? this.getTenderList() : void (0))
        dispatch({type: "tender/setState", payload: {tenderDeleteVisible: false, record: ''}});
    }

    render() {
        const {pageSize, current, keyword} = this.state;
        const {dispatch, dataList, tenderModalVisible, record, tableLoading, total, tenderDeleteVisible, dict} = this.props;
        const {projectList, TendType,leaderList} = dict
        const columns = [
            {
                key: "ProjectName",
                dataIndex: "ProjectName",
                title: "项目名称",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "Name",
                dataIndex: "Name",
                title: "招标名称",

                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "ApprovalNumber",
                dataIndex: "ApprovalNumber",
                title: "批准文号",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "TenderType",
                dataIndex: "TenderType",
                title: "招标方式",
                width: 120,
                 ellipsis:true,
                render: (text) => {
                    let title = text ? getValueByKey(TendType, text, "Code", "Name") : ''
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                }
            },
            {
                key: "Budget",
                dataIndex: "Budget",
                title: "预算金额",
                width: 100,
                 ellipsis:true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: "PublicityDate",
                dataIndex: "PublicityDate",
                title: "公告时间",
                width: 120,
                 ellipsis:true,
                render: (text) => {
                    return moment(text).format("YYYY-MM-DD");
                },
            },
            {
                key: "PublicityType",
                dataIndex: "PublicityType",
                title: "公告方式",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "PublicityChannel",
                dataIndex: "PublicityChannel",
                title: "发告渠道",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "UseRule",
                dataIndex: "UseRule",
                title: "评标方法",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "TenderDate",
                dataIndex: "TenderDate",
                title: "开标时间",
                width: 120,
                 ellipsis:true,
                render: (text) => {
                    return moment(text).format("YYYY-MM-DD");
                },
            },
            {
                key: "Address",
                dataIndex: "Address",
                title: "开标地点",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "TenderDescribe",
                dataIndex: "TenderDescribe",
                title: "招标说明",
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
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
                width: 150,
                 ellipsis:true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "action",
                dataIndex: "action",
                title: "操作",
                fixed: "right",
                width: 100,
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.update(record)}/>
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ];
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.action}>
                <div className={styles.top}>
                    <Search
                        placeholder="招标名称"
                        onPressEnter={() => this.getTenderList(1, keyword)}
                        onSearch={() => this.getTenderList(1, keyword)}
                        onChange={(e) => this.setState({keyword: e.target.value})}
                        style={{width: 200, marginRight: 10}}
                    />
                    <div>
                        <Button onClick={() => this.getTenderList(1, keyword)}>刷新</Button>
                        <Button type="primary" onClick={() => this.add()}>新增</Button>
                    </div>
                </div>
                <div id="project" className={styles.project}>
                    <Table
                        loading={tableLoading}
                        rowKey={(record) => record.TenderId}
                        columns={columns}
                        dataSource={dataList}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                        pagination={{
                            pageSize,
                            current,
                            total,
                            onChange: (current) => {
                                this.getTenderList(current, keyword)
                            },
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.getTenderList(current, keyword, size)
                            },
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {tenderModalVisible ? (
                    <EditModal
                        tenderVisible={tenderModalVisible}
                        record={record}
                        cancelModal={() =>
                            dispatch({
                                type: "tender/setState",
                                payload: {tenderModalVisible: false, record: ""},
                            })
                        }
                        getTenderList={() => this.getTenderList(record ? current : 1, record ? keyword : '')}
                    />
                ) : (
                    void 0
                )}
                {
                    tenderDeleteVisible ?
                        <TipModal visible={tenderDeleteVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleDelete()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.tender))(Tender);
