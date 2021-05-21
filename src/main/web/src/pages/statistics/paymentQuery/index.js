import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Table, Tooltip, Button, DatePicker, Select} from "antd";
import moment from "moment";
import {getValueByKey} from "common/arr";
import {moneyFormat} from "@/common/arr";

const {Option} = Select;
const dateFormat = 'YYYY-MM-DD';
const {RangePicker} = DatePicker

class PaymentQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: undefined,
            start: moment(moment().format("YYYY-01-01")),
            end: moment()
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let payload = {page: 1, limit: 999999, parm: '', pxid: 1}
        let list = ["ProjectYear"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getCompanyList"}) //公司
        this.selectList()
    }

    selectList() {
        const {year, start, end} = this.state
        const {dispatch, dict} = this.props;
        dispatch({type: 'paymentQuery/setState', payload: {tableLoading: true}})
        dispatch({
            type: "paymentQuery/selectList",
            payload: {
                year: year ? parseInt(year) : 0,
                start: start ? moment(start).format(dateFormat) : '',
                end: end ? moment(end).format(dateFormat) : ''
            }
        });
    }

    render() {
        const {start, end, year} = this.state;
        const {dataList, tableLoading, dict} = this.props;
        const {ProjectYear, companyList} = dict

        let columns = [
            {
                key: "ProjectYear",
                dataIndex: "ProjectYear",
                title: "年度",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(ProjectYear, text.toString(), 'Code', 'Name')
                    return title
                },
            },
            {
                key: "CompanyID",
                dataIndex: "CompanyID",
                title: "公司名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(companyList, text, 'ID', 'Name')
                    return <span> <Tooltip placement="topLeft" title={title}>{title}</Tooltip> </span>
                },
            },
            {
                key: "SignDate",
                dataIndex: "SignDate",
                title: "签订时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "Name",
                dataIndex: "Name",
                title: "合同名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "Money",
                dataIndex: "Money",
                title: "合同金额",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                },
            },
            {
                key: "ProjectName",
                dataIndex: "ProjectName",
                title: "项目名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "StartDate",
                dataIndex: "StartDate",
                title: "开始日期",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "EndDate",
                dataIndex: "EndDate",
                title: "结束日期",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "PayTotal",
                dataIndex: "PayTotal",
                title: "已付金额",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                },
            },

            // {
            //     key: "PayTotal",
            //     dataIndex: "PayTotal",
            //     title: "录入未付",
            //      ellipsis:true,
            //     render: (text) => {
            //         // return text ? moneyFormat(text) : ''
            //         return ''
            //     },
            // },
            {
                key: "NoPayTotal",
                dataIndex: "NoPayTotal",
                title: "未付金额",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                },
            },
        ];

        return (
            <div className={styles.file}>
                <div className={styles.top}>
                    <div>
                        <Select showSearch
                                value={year}
                                allowClear
                                style={{width: 120, marginRight: 10}}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={(value) => {
                                    this.setState({year: value})
                                }}
                                placeholder={'请选择年份'}
                        >
                            {ProjectYear && ProjectYear.length > 0
                                ? ProjectYear.map((item) => {
                                    return (
                                        <Option key={item.Code} value={item.Code}>
                                            {item.Name}
                                        </Option>
                                    );
                                })
                                : void 0}
                        </Select>
                        <RangePicker style={{width: 200}}
                                     picker="days"
                                     allowClear={false}
                                     defaultValue={[moment(start), moment(end)]}
                                     onChange={(dates) => {
                                         let start = ''
                                         let end = ''
                                         if (dates) {
                                             start = dates[0]
                                             end = dates[1]
                                         }
                                         this.setState({start, end})
                                     }}
                        />
                    </div>
                    <div>
                        <Button onClick={() => this.selectList()}>刷新</Button>
                    </div>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={(record) => record.ID}
                        columns={columns}
                        dataSource={dataList}
                        loading={tableLoading}
                        scroll={{x: '100%'}}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
            </div>
        );
    }
}

export default connect(({dict, paymentQuery}) => ({dict, ...paymentQuery}))(
    PaymentQuery
);

