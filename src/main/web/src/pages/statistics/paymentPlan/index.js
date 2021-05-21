import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Table, Tooltip, Button, DatePicker, message} from "antd";
import moment from "moment";
import TipModal from 'components/TipModal'
import {getValueByKey} from "common/arr";
import {moneyFormat} from "@/common/arr";

const dateFormat = 'YYYY-MM';

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1, //当前页码
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),

            dateValue: moment()
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        this.getPaymentPlanList()
        let list = ["ProjectYear", "ProjectClass", "BuyType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getEmployee"}) //人员
    }

    getPaymentPlanList(current = 1, keyword = '', size) {
        const {pageSize, dateValue} = this.state
        const {dispatch} = this.props;
        let month = moment(dateValue).format('YYYYMM')
        this.setState({current})
        dispatch({type: 'paymentPlan/setState', payload: {tableLoading: true}})
        dispatch({
            type: "paymentPlan/getPaymentPlanList",
            payload: {page: current, pxid: 1, limit: size ? size : parseInt(pageSize), parm: month},
        });
    }

    //更改月份
    handleChangeDate(date, dateString) {
        this.setState({dateValue: date})
    }

    //打开重新生成计划提示框
    showTipModal() {
        const {dateValue} = this.state
        const {dispatch} = this.props
        let selectedDate = parseInt(moment(dateValue).format('YYYYMM'))
        let now = parseInt(moment().format('YYYYMM'))
        if (selectedDate < now) {
            message.warning('抱歉，不能生成以前月份的付款计划！')
        } else {
            dispatch({type: 'paymentPlan/setState', payload: {payPlanModalVisible: true}})
        }
    }

    //重新生成计划
    handleChangePlan() {
        const {dateValue} = this.state
        const {dispatch} = this.props
        const {user} = this.props.layout
        let month = moment(dateValue).format('YYYYMM')
        dispatch({type: "paymentPlan/changePayPlan", payload: {user: user.userId, month}}).then(res => {
            if (res) {
                this.getPaymentPlanList()
            }
        })
    }

    //关闭重新生成计划提示框
    closeTipModal() {
        const {dispatch} = this.props
        dispatch({type: 'paymentPlan/setState', payload: {payPlanModalVisible: false}})
    }

    render() {
        const {keyword, current, pageSize, dateValue} = this.state;
        const {dataList, total, payPlanModalVisible, dict, tableLoading} = this.props;
        const {leaderList} = dict
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        let columns = [
            {
                key: "PlanMonth",
                dataIndex: "PlanMonth",
                title: "年月",
                width: 100,
                ellipsis: true,
            },
            {
                key: "PayName",
                dataIndex: "PayName",
                title: "付款名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "CompanyName",
                dataIndex: "CompanyName",
                title: "公司名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "PlanMoney",
                dataIndex: "PlanMoney",
                title: "付款金额",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                },
            },
            {
                key: "Leader",
                dataIndex: "Leader",
                title: "项目负责人",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return <span> <Tooltip placement="topLeft" title={title}>{title}</Tooltip> </span>
                },
            },
            {
                key: "PlanMemo",
                dataIndex: "PlanMemo",
                title: "备注",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "PlanInputUser",
                dataIndex: "PlanInputUser",
                title: "计划人",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return <span> <Tooltip placement="topLeft" title={title}>{title}</Tooltip> </span>
                },
            },
            {
                key: "PlanInputDate",
                dataIndex: "PlanInputDate",
                title: "计划时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },

            {
                key: "PayStatus",
                dataIndex: "PayStatus",
                title: "是否支付",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return text === '1' ? '已支付' : '未支付'
                },
            },
            {
                key: "PayDate",
                dataIndex: "PayDate",
                title: "支付时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "PlanInputUser",
                dataIndex: "PlanInputUser",
                title: "支付录入人",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(leaderList, text, "Code", "Name") : ''
                    return title;
                },
            },
            {
                key: "PayInputDate",
                dataIndex: "PayInputDate",
                title: "支付录入时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "PlayInputMemo",
                dataIndex: "PlayInputMemo",
                title: "支付说明",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
        ];

        return (
            <div className={styles.file}>
                <div className={styles.top}>
                    <div>
                        <DatePicker allowClear={false}
                                    style={{width: 200}}
                                    picker="month"
                                    defaultValue={moment(dateValue, dateFormat)}
                                    onChange={(value) => this.handleChangeDate(value)}
                        />
                    </div>
                    <div>
                        <Button onClick={() => this.getPaymentPlanList(1, keyword)}>刷新</Button>
                        <Button type='primary' onClick={() => this.showTipModal()}>重新生成计划</Button>
                        {/*<Button type='primary'>打印</Button>*/}
                    </div>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={(record) => record.ID}
                        columns={columns}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                        dataSource={dataList}
                        loading={tableLoading}
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
                                this.getPaymentPlanList(current, keyword, size)
                            },
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {
                    payPlanModalVisible ?
                        <TipModal visible={payPlanModalVisible}
                                  content={`确定要重新生成 ${moment(dateValue).format('MM')} 月份的付款计划吗？重新生成会删除以前的计划内容！`}
                                  cancelModal={() => this.closeTipModal()}
                                  onOK={() => this.handleChangePlan()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect(({dict, layout, paymentPlan}) => ({dict, layout, ...paymentPlan}))(
    File
);

