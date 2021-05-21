import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Button, Table, Checkbox, Tooltip} from "antd";
import {CheckCircleTwoTone} from '@ant-design/icons'
import Operation from "components/Operation";
import TenderEditModal from "../tender/EditModal";
import EditModal from "./EditModal";
import TipModal from 'components/TipModal'
import {getValueByKey} from "common/arr"
import moment from 'moment'
import {moneyFormat} from "@/common/arr";

const {Search} = Input;
const clientHeight = document.body.clientHeight;

class Bid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "", //筛选值
            wrapperHeight: "",
            current: 1,
            page: 5,
            visible: false, //删除的确认弹框
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let list = ["TendType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getProjects'})//项目列表
        dispatch({type: "dict/getCompanyList"}) //公司
        dispatch({type: "dict/getEmployee"}) //人员
        this.changeMasterTableHeight();
        this.getTenderList()
    }

    componentWillReceiveProps(nextProps) {
    }

    changeMasterTableHeight() {
        let dom = document.getElementById("tableWrapper");
        let wrapperHeight = dom ? dom.clientHeight : "";
        this.setState({wrapperHeight});
    }

    //获取招标列表
    getTenderList(current = 1, searchValue = '') {
        const {dispatch, selectedTender} = this.props
        this.setState({current})
        dispatch({type: 'tender/setState', payload: {tableLoading: true}})
        dispatch({
            type: "tender/getTenderList",
            payload: {page: current, pxid: 1, limit: 5, parm: searchValue},
        }).then(res => {
            const {dataList} = this.props.tender
            if (res) {
                if (selectedTender) {
                    this.getBidList(selectedTender)
                } else {
                    let list = dataList ? JSON.parse(JSON.stringify(dataList)) : []
                    let selectedTender = list.length ? list[0] : ''
                    dispatch({type: 'bid/setState', payload: {selectedTender, bidList: []}})
                }
            }
        })
    }

    //获取投标列表
    getBidList(record) {
        const {dispatch} = this.props
        dispatch({
            type: "bid/setState",
            payload: {selectedTender: record, tableLoading: true},
        })
        dispatch({
            type: "bid/getBidList",
            payload: {id: record.TenderID,},
        });
    }

    //新增
    add() {
        const {dispatch} = this.props
        dispatch({
            type: "bid/setState",
            payload: {childModalVisible: true, selectedBid: ''},
        })
    }

    //删除投标
    delete() {
        const {dispatch, selectedBid, selectedTender} = this.props
        dispatch({
            type: "bid/delete",
            payload: {id: selectedBid.BidID}
        }).then(res => res ? this.getBidList(selectedTender) : void (0))
        this.showDeleteModal()
    }

    //删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props
        const {visible} = this.state
        this.setState({visible: !visible})
        dispatch({type: 'bid/setState', payload: {selectedBid: record}})
    }

    //编辑招标
    updateTender(record) {
        const {dispatch} = this.props
        let itemData = {
            ...record,
            PublicityDate: moment(record.PublicityDate),
            TenderDate: moment(record.TenderDate),
        };
        dispatch({
            type: "bid/setState",
            payload: {masterModalVisible: true, selectedTender: record},
        })
        dispatch({
            type: "tender/setState",
            payload: {record: itemData},
        })
    }

    render() {
        const {wrapperHeight, current, visible, searchValue} = this.state;
        const {dispatch, bidList, masterModalVisible, childModalVisible, tableLoading, tender, selectedTender, dict} = this.props
        const {dataList, tableLoading: loading, total} = tender
        const {companyList, projectList, TendType, leaderList} = dict
        const columns = [
            {
                key: "ProjectName",
                dataIndex: "ProjectName",
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
                key: "Name",
                dataIndex: "Name",
                title: "招标名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "ApprovalNumber",
                dataIndex: "ApprovalNumber",
                title: "批准文号",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "TenderType",
                dataIndex: "TenderType",
                title: "招标方式",
                ellipsis: true,
                width: 150,
                render: (text) => {
                    let title = text ? getValueByKey(TendType, text, 'Code', 'Name') : ''
                    return <span> <Tooltip placement="topLeft" title={title}>{title}</Tooltip> </span>
                }
            },
            {
                key: "Budget",
                dataIndex: "Budget",
                title: "预算金额",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: "PublicityDate",
                dataIndex: "PublicityDate",
                title: "公告时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : '';
                },
            },
            {
                key: "PublicityType",
                dataIndex: "PublicityType",
                title: "公告方式",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "PublicityChannel",
                dataIndex: "PublicityChannel",
                title: "发告渠道",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "UseRule",
                dataIndex: "UseRule",
                title: "评标方法",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "action",
                dataIndex: "action",
                title: "操作",
                width: 60,
                fixed: 'right',
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" onClick={() => this.updateTender(record)}/>
                    </div>
                ),
            },
        ]
        const bidColumns = [
            {
                key: "IsWin",
                dataIndex: "IsWin",
                title: "中标",
                width: 50,
                ellipsis: true,
                render: (text) => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: "CompanyID",
                dataIndex: "CompanyID",
                title: "公司名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(companyList, text, 'ID', 'Name') : ''
                    return <span> <Tooltip placement="topLeft" title={title}>{title}</Tooltip> </span>
                }
            },
            {
                key: "FirstMoney",
                dataIndex: "FirstMoney",
                title: "投标报价",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: "LastMoney",
                dataIndex: "LastMoney",
                title: "最后价格",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: "BidDescribe",
                dataIndex: "BidDescribe",
                title: "投标过程记要",
                ellipsis: true,
                width: 150,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
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
                key: "action",
                dataIndex: "action",
                title: "操作",
                width: 100,
                fixed: "right",
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation
                            name="编辑"
                            addDivider
                            onClick={() => {
                                dispatch({
                                    type: "bid/setState",
                                    payload: {
                                        childModalVisible: true,
                                        selectedBid: record,
                                    },
                                });
                            }}
                        />
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ];
        return (
            <div className={styles.bid}>
                <div className={styles.top}>
                    <div className={styles.tool}>
                        <Search
                            placeholder="招标名称"
                            style={{width: 200}}
                            onPressEnter={() => this.getTenderList(1, searchValue)}
                            onSearch={() => this.getTenderList(1, searchValue)}
                            onChange={(e) => this.setState({searchValue: e.target.value})}
                        />
                    </div>
                    <div className={styles.btn}>
                        <Button onClick={() => this.getTenderList(1, searchValue)}>刷新</Button>
                    </div>
                </div>
                <div id="tableWrapper" className={styles.tableWrapper}>
                    <div id="masterTable" className={styles.masterTable}>
                        <Table
                            loading={loading}
                            rowKey={(record) => record.TenderId}
                            columns={columns}
                            dataSource={dataList}
                            scroll={{x: '100%'}}
                            pagination={{
                                pageSize: 5,
                                current,
                                total,
                                onChange: (current) => {
                                    this.getTenderList(current, searchValue)
                                },
                                showSizeChanger: false
                            }}
                            rowClassName={(record) => {
                                return selectedTender &&
                                record.TenderID === selectedTender.TenderID
                                    ? "clickRowStyle"
                                    : void 0;
                            }}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        this.getBidList(record)
                                    }, // 点击行
                                };
                            }}
                        />
                    </div>
                    <div className={styles.childTable}>
                        <div className={styles.registerTop}>
                            <div className={styles.registerTitle}>
                                <span>投标列表</span>
                            </div>
                            <div className={styles.btn}>
                                <Button type="primary" onClick={() => this.add()}>
                                    新增
                                </Button>
                            </div>
                        </div>
                        <Table
                            rowKey={(record) => record.BidId}
                            columns={bidColumns}
                            dataSource={bidList}
                            loading={tableLoading}
                            scroll={{x: '100%'}}
                            pagination={{
                                showSizeChanger: false,
                                pageSize: wrapperHeight - 467 - 45 * 5 > 0 ? Math.floor((wrapperHeight - 467) / 45) : 5
                            }}
                            scrollToFirstRowOnChange={true}
                        />
                    </div>
                </div>
                {masterModalVisible ? (
                    <TenderEditModal
                        tenderVisible={masterModalVisible}
                        record={selectedTender}
                        cancelModal={() =>
                            dispatch({
                                type: "bid/setState",
                                payload: {masterModalVisible: false},
                            })
                        }
                        getTenderList={() => this.getTenderList(selectedTender ? current : 1, selectedTender ? searchValue : '')}
                    />
                ) : (
                    void 0
                )}

                {childModalVisible ? <EditModal/> : void (0)}
                {
                    visible ?
                        <TipModal visible={visible}
                                  message={'删除'}
                                  cancelModal={() => this.showDeleteModal()}
                                  onOK={() => this.delete()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect(({dict, tender, bid}) => ({dict, tender, ...bid}))(
    Bid
);
