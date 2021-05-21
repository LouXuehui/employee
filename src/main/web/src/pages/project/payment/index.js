import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Input, Button, Table, Tooltip} from 'antd'
import Operation from 'components/Operation'
import PayEditModal from "./EditModal"
import ReceiptEditModal from "./ReceiptEditModal"
import moment from 'moment'
import TipModal from 'components/TipModal'
import {CheckCircleTwoTone} from '@ant-design/icons'
import {getValueByKey, moneyFormat} from "@/common/arr";

const {Search} = Input;

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '', //筛选值
            current: 1, //当前页码
            visible: false, //删除弹窗
            record: '',//删除对象
            isDeleteReceipt: false, //发票删除
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch({type: 'dict/getProjects'})//项目列表
        dispatch({type: "dict/getCompanyList"}) //公司
        dispatch({type: "dict/getEmployee"}) //人员
        this.changeMasterTableHeight()
        this.getPaymentList()
        this.getContractList()
    }

    //获取合同列表
    getContractList() {
        const {dispatch} = this.props
        dispatch({
            type: "contract/getContractList",
            payload: {page: 1, pxid: 1, limit: 9999, parm: ''},
        });
    }

    changeMasterTableHeight() {
        let dom = document.getElementById("tableWrapper");
        let wrapperHeight = dom ? dom.clientHeight : "";
        let masterTable = document.getElementById("masterTable");
        let masterHeight = masterTable ? masterTable.clientHeight : "";
        this.setState({wrapperHeight, masterHeight});
    }

    //获取付款列表
    getPaymentList(current = 1, searchValue = '') {
        const {dispatch} = this.props
        this.setState({current})
        dispatch({type: 'payment/setState', payload: {tableLoading: true}})
        dispatch({
            type: 'payment/getPaymentList',
            payload: {page: current, limit: 5, pxid: 1, parm: searchValue}
        }).then(res => {
            if (res) {
                const {paymentList, selectedPayment} = this.props
                if (selectedPayment) {
                    this.getReceiptList(selectedPayment)
                } else {
                    let list = paymentList ? JSON.parse(JSON.stringify(paymentList)) : []
                    let selectedPayment = list.length ? list[0] : ''
                    dispatch({type: 'payment/setState', payload: {selectedPayment, receiptList: []}})
                }

            }
        })
    }

    //获取发票
    getReceiptList(record) {
        const {dispatch} = this.props
        dispatch({
            type: "payment/setState",
            payload: {
                selectedPayment: record,
                receiptLoading: true
            },
        })
        dispatch({type: 'payment/getReceiptList', payload: {id: record.PayID}})
    }

    //新增或编辑付款
    editPayment(record) {
        const {dispatch} = this.props
        let selectedPayment = record ? record : ''
        dispatch({
            type: 'payment/setState',
            payload: {selectedPayment, payModalVisible: true}
        })
        if (selectedPayment) {
            this.getReceiptList(selectedPayment)
        }
    }

    //删除
    delete(record) {
        const {isDeleteReceipt} = this.state
        const {dispatch, selectedReceipt, selectedPayment} = this.props
        dispatch({
            type: `payment/${isDeleteReceipt ? 'deleteReceipt' : 'delete'}`,
            payload: {id: isDeleteReceipt ? selectedReceipt.ReceiptID : selectedPayment.PayID}
        }).then(res => {
            if (res) {
                isDeleteReceipt ? this.getReceiptList(selectedPayment) : this.getPaymentList()
            }
        })
        this.showDeleteModal('', isDeleteReceipt ? 'selectedReceipt' : 'selectedPayment')
    }

    showDeleteModal(record, mode) {
        const {dispatch} = this.props
        const {visible} = this.state
        this.setState({visible: !visible, isDeleteReceipt: mode === 'selectedReceipt'})
        dispatch({type: 'payment/setState', payload: {[mode]: record}})
    }

    updateReceipt(record) {
        const {dispatch} = this.props
        let selectedReceipt = record ? record : ''
        dispatch({
            type: 'payment/setState',
            payload: {selectedReceipt, receiptModalVisible: true}
        })
    }

    render() {
        const {visible, record, wrapperHeight, masterHeight, current, searchValue} = this.state;
        const {dispatch, dict, contract, paymentList, receiptList, tableLoading: loading, total, selectedPayment, payModalVisible, receiptLoading, receiptModalVisible} = this.props
        const {companyList, projectList, leaderList} = dict
        const {dataList} = contract
        const columns = [
            {
                key: 'IsPay',
                dataIndex: 'IsPay',
                title: '支付',
                width: 50,
                ellipsis: true,
                render: (text) => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: 'Name',
                dataIndex: 'Name',
                title: '付款名称',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: 'SignID',
                dataIndex: 'SignID',
                title: '合同名称',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(dataList, text, 'SignID', 'Name')
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                },
            },
            {
                key: 'CompanyID',
                dataIndex: 'CompanyID',
                title: '公司名称',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(companyList, text, 'ID', 'Name')
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                },
            },
            {
                key: 'TotalMoney',
                dataIndex: 'TotalMoney',
                title: '总金额',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: 'PayMoney',
                dataIndex: 'PayMoney',
                title: '本次支付',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: 'ExpectDate',
                dataIndex: 'ExpectDate',
                title: '应付时间',
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format('YYYY-MM-DD') : ''
                }
            },
            {
                key: 'FactDate',
                dataIndex: 'FactDate',
                title: '实付时间',
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format('YYYY-MM-DD') : ''
                }
            },
            {
                key: 'PayPercent',
                dataIndex: 'PayPercent',
                title: '比例',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return text ? text + "%" : ''
                }
            },
            {
                key: 'AmountMoney',
                dataIndex: 'AmountMoney',
                title: '已付',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: 'PaySelf',
                dataIndex: 'PaySelf',
                title: '自筹',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: 'PayOther',
                dataIndex: 'PayOther',
                title: '其他支付',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: 'OtherName',
                dataIndex: 'OtherName',
                title: '支付途径',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: 'ProjectName',
                dataIndex: 'ProjectName',
                title: '项目名称',
                width: 150,
                ellipsis: true,
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
                key: 'InputDate',
                dataIndex: 'InputDate',
                title: '录入时间',
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format('YYYY-MM-DD') : ''
                }
            },
            {
                key: 'Memo',
                dataIndex: 'Memo',
                title: '备注',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: 'action',
                dataIndex: 'action',
                title: '操作',
                fixed: 'right',
                width: 100,
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.editPayment(record)}/>
                        <div><span className={'delete'}
                                   onClick={() => this.showDeleteModal(record, 'selectedPayment')}>删除</span></div>
                    </div>
                ),
            },
        ]
        const receiptColumns = [
            {
                key: 'ReceiptNo',
                dataIndex: 'ReceiptNo',
                title: '发票号码',
                width: 120,
            },
            {
                key: 'Name',
                dataIndex: 'Name',
                title: '发票名称',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: 'ReceiptType',
                dataIndex: 'ReceiptType',
                title: '发票类型',
                width: 100
            },
            {
                key: 'ReceiptDate',
                dataIndex: 'ReceiptDate',
                title: '发票日期',
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format('YYYYY-MM-DD') : ''
                }
            },
            {
                key: 'ReceiptMoney',
                dataIndex: 'ReceiptMoney',
                title: '发票金额',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                }
            },
            {
                key: 'ReceiptStatus',
                dataIndex: 'ReceiptStatus',
                title: '发票状态',
                width: 100,
            },
            {
                key: 'Memo',
                dataIndex: 'Memo',
                title: '备注',
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: 'InputUser',
                dataIndex: 'InputUser',
                title: '录入人',
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(leaderList, text, 'ID', 'Name')
                    return title
                }
            },
            {
                key: 'InputDate',
                dataIndex: 'InputDate',
                title: '录入时间',
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: 'action',
                dataIndex: 'action',
                title: '操作',
                width: 100,
                fixed: 'right',
                render: (text, record, index) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.updateReceipt(record)}/>
                        <div><span className={'delete'}
                                   onClick={() => this.showDeleteModal(record, 'selectedReceipt')}>删除</span>
                        </div>
                    </div>
                ),
            },
        ]
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.payment}>
                <div className={styles.top}>
                    <div className={styles.tool}>
                        <Search
                            placeholder="付款名称"
                            style={{width: 200}}
                            onPressEnter={() => this.getPaymentList(1, searchValue)}
                            onSearch={() => this.getPaymentList(1, searchValue)}
                            onChange={(e) => this.setState({searchValue: e.target.value})}
                        />
                    </div>
                    <div className={styles.btn}>
                        <Button onClick={() => this.getPaymentList(1, searchValue)}>刷新</Button>
                        <Button type={'primary'} onClick={() => this.editPayment()}>新增</Button>
                    </div>
                </div>
                <div id="tableWrapper" className={styles.tableWrapper}>
                    <div id="masterTable" className={styles.masterTable}>
                        <Table
                            loading={loading}
                            rowKey={(record) => record.PayID}
                            columns={columns}
                            dataSource={paymentList}
                            scroll={{x: '100%'}}
                            pagination={{
                                pageSize: 5,
                                current,
                                total,
                                onChange: (current) => {
                                    this.getPaymentList(current, searchValue)
                                },
                                showSizeChanger: false
                            }}
                            rowClassName={(record) => {
                                return selectedPayment &&
                                record.PayID === selectedPayment.PayID
                                    ? "clickRowStyle"
                                    : void 0;
                            }}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        this.getReceiptList(record)
                                    }, // 点击行
                                };
                            }}
                        />
                    </div>
                    <div className={styles.childTable}>
                        <div className={styles.registerTop}>
                            <div className={styles.registerTitle}>
                                <span>发票登记</span>
                            </div>
                            <div className={styles.btn}>
                                <Button type="primary"
                                        onClick={() => dispatch({
                                            type: 'payment/setState',
                                            payload: {receiptModalVisible: true}
                                        })}>
                                    新增
                                </Button>
                            </div>
                        </div>
                        <Table
                            rowKey={(record) => record.BidId}
                            columns={receiptColumns}
                            dataSource={receiptList}
                            loading={receiptLoading}
                            scroll={{x: '100%'}}
                            pagination={{
                                showSizeChanger: false,
                                pageSize: wrapperHeight - 467 - 45 * 5 > 0 ? Math.floor((wrapperHeight - 467) / 45) : 5
                            }}
                            scrollToFirstRowOnChange={true}
                        />
                    </div>
                </div>
                {payModalVisible ? <PayEditModal
                    getPaymentList={() => this.getPaymentList(selectedPayment ? current : 1, selectedPayment ? searchValue : '')}/> : void (0)}
                {receiptModalVisible ? <ReceiptEditModal/> : void (0)}
                {visible ? <TipModal visible={visible}
                                     message={'删除'}
                                     cancelModal={() => this.showDeleteModal()}
                                     onOK={() => this.delete()}/> : void (0)}
            </div>
        );
    }
}

export default connect(state =>
    Object.assign({}, {dict: state.dict}, {contract: state.contract}, state.payment)
)(Payment);
