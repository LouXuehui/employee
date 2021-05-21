/**
 * Created by lxh on 2020/5/29
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Table, Card, Select, Tooltip} from 'antd'
import moment from "moment";
import {getValueByKey, moneyFormat} from "common/arr";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {title, dataList, dict} = this.props
        const {leaderList, ProjectYear, ProjectClass, BuyType, departmentList,companyList} = dict
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
            }
        ];
        const signColumns = [
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
                title: "合同名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "DocNo",
                dataIndex: "DocNo",
                title: "合同编号",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "CompanyID",
                dataIndex: "CompanyID",
                title: "公司名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = text ? getValueByKey(companyList, text, "ID", "Name") : ''
                    return <span>
                        <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                    </span>
                },
            },
            {
                key: "SignDate",
                dataIndex: "SignDate",
                title: "签订日期",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
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
                }
            },
            {
                key: "Class",
                dataIndex: "Class",
                title: "合同类别",
                width: 100,
                ellipsis: true,
            },
            {
                key: "Validity",
                dataIndex: "Validity",
                title: "合同效期",
                width: 100,
                ellipsis: true,
            },
            {
                key: "StartDate",
                dataIndex: "StartDate",
                title: "合同开始时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "EndDate",
                dataIndex: "EndDate",
                title: "合同结束时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "SignDescribe",
                dataIndex: "SignDescribe",
                title: "签订内容概要",
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
                title: "备注",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
        ];

        return <div className={styles.tableWrapper}>
            <div className={styles.title}>{title}</div>
            <Table columns={title === '在建项目' ? columns : signColumns}
                   dataSource={dataList}
                   scroll={{x: '100%', y: 225}}
                   pagination={false}
            />
        </div>
    }
}

export default connect(({dict}) => ({dict}))(Index);
