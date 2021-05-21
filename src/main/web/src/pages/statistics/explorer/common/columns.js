import {Tooltip} from 'antd'
import {CheckCircleTwoTone} from '@ant-design/icons'
import {moneyFormat, getValueByKey} from "@/common/arr";
import moment from 'moment'

export function getColumns(props, page) {
    const {projectList, departmentList, companyList, leaderList, signList, actionType, TendType, BuyType, ProjectClass, ProjectYear, tenderList} = props
    let columns = []
    switch (page) {
        case 'Approval':
            columns = [
                {
                    key: "ProjectYear",
                    dataIndex: "ProjectYear",
                    title: "立项年度",
                    width: 80,
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
                        return text ? moneyFormat(text) : ''
                    }
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
                    key: "Memo",
                    dataIndex: "Memo",
                    title: "项目备注",
                    width: 200,
                    ellipsis: true,
                    render: (text) => {
                        return <span>
                                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                            </span>
                    },
                },
                {
                    key: 'IsArchive',
                    dataIndex: 'IsArchive',
                    title: "归档",
                    width: 65,
                    ellipsis: true,
                    render: (text) => {
                        return text ? '已归档' : '未归档'
                    }
                },
                {
                    key: 'ExistEntity',
                    dataIndex: 'ExistEntity',
                    title: "存在实体档案",
                    width: 120,
                    ellipsis: true,
                    render: (text) => {
                        return text ? '是' : '否'
                    }
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
                    }
                }
            ]
            break
        case 'Agreement':
            columns = [
                {
                    key: "ProjectID",
                    dataIndex: "ProjectID",
                    title: "项目名称",
                    width: 150,
                    ellipsis: true,
                    render: (text, record) => {
                        let title = getValueByKey(projectList, text + "", "Code", "Name");
                        return <Tooltip placement="topLeft" title={title}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{title}</div>
                        </Tooltip>
                    },
                },
                {
                    key: "Name",
                    dataIndex: "Name",
                    title: "合同名称",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
                    },
                },
                {
                    key: "DocNo",
                    dataIndex: "DocNo",
                    title: "合同编号",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
                    },
                },
                {
                    key: "CompanyID",
                    dataIndex: "CompanyID",
                    title: "公司名称",
                    width: 150,
                    render: (text, record) => {
                        let title = text ? getValueByKey(companyList, text, "ID", "Name") : ''
                        return <Tooltip placement="topLeft" title={title}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{title}</div>
                        </Tooltip>
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
                    width: 120,
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
                    width: 200,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
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
                    width: 205,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
                    },
                },
            ]
            break
        case 'Payment':
            columns = [
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
                    width: 100,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 100}}>{text}</div>
                        </Tooltip>
                    },
                },
                {
                    key: 'SignID',
                    dataIndex: 'SignID',
                    title: '合同名称',
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        let title = getValueByKey(signList, text, 'SignID', 'Name')
                        return <Tooltip placement="topLeft" title={title}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{title}</div>
                        </Tooltip>
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
                        return <Tooltip placement="topLeft" title={title}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{title}</div>
                        </Tooltip>
                    },
                },
                {
                    key: 'TotalMoney',
                    dataIndex: 'TotalMoney',
                    title: '总金额',
                    width: 120,
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
                },
                {
                    key: 'FactDate',
                    dataIndex: 'FactDate',
                    title: '实付时间',
                    width: 120,
                    ellipsis: true,
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
                    width: 120,
                    ellipsis: true,
                    render: (text) => {
                        return moneyFormat(text)
                    }
                },
                {
                    key: 'PaySelf',
                    dataIndex: 'PaySelf',
                    title: '自筹',
                    width: 120,
                    ellipsis: true,
                    render: (text) => {
                        return moneyFormat(text)
                    }
                },
                {
                    key: 'PayOther',
                    dataIndex: 'PayOther',
                    title: '其他支付',
                    width: 120,
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
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{text}</div>
                        </Tooltip>
                    },
                },
                {
                    key: 'ProjectID',
                    dataIndex: 'ProjectID',
                    title: '项目名称',
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        let title = getValueByKey(projectList, JSON.stringify(text), 'Code', 'Name')
                        return <Tooltip placement="topLeft" title={title}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{title}</div>
                        </Tooltip>
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
                        return text ? moment(text).format("YYYY-MM-DD") : ''
                    },
                },
                {
                    key: 'Memo',
                    dataIndex: 'Memo',
                    title: '备注',
                    width: 205,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
                    },
                },
            ]
            break
        case 'Action':
            columns = [
                {
                    key: "ProjectID",
                    dataIndex: "ProjectID",
                    title: "项目名称",
                    width: 150,
                    ellipsis: true,
                    render: (text, record) => {
                        let title = getValueByKey(projectList, JSON.stringify(text), "Code", "Name");
                        return <span>
                                <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                            </span>
                    },
                },
                {
                    key: "Name",
                    dataIndex: "Name",
                    title: "活动名称",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        return <span>
                                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                            </span>
                    },
                },
                {
                    key: "ActionType",
                    dataIndex: "ActionType",
                    title: "活动类型",
                    width: 120,
                    ellipsis: true,
                    render: (text, record) => {
                        let title = getValueByKey(actionType, text, 'Code', 'Name')
                        return title
                    }
                },
                {
                    key: "ActionDate",
                    dataIndex: "ActionDate",
                    title: "活动时间",
                    width: 120,
                    ellipsis: true,
                    render: (text, record) => {
                        return moment(text).format("YYYY-MM-DD");
                    },
                },
                {
                    key: "ActionPosition",
                    dataIndex: "ActionPosition",
                    title: "活动地点",
                    width: 120,
                    ellipsis: true,
                    render: (text) => {
                        return <span>
                                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                            </span>
                    },
                },
                {
                    key: "PersonList",
                    dataIndex: "PersonList",
                    title: "人员列表",
                    width: 200,
                    ellipsis: true,
                    render: (text, record) => {
                        let title = ''
                        let list = text ? text.split(' ') : ''
                        if (list && list.length) {
                            list.map((item, index) => {
                                let flag = index > 0 ? " " : ''
                                title = title + flag + getValueByKey(leaderList, item, "Code", "Name");
                            })
                        }
                        return <span>
                                <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                            </span>
                    },
                },
                {
                    key: "ActionDescribe",
                    dataIndex: "ActionDescribe",
                    title: "活动概要",
                    width: 200,
                    ellipsis: true,
                    render: (text) => {
                        return <span>
                                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                            </span>
                    },
                },
                {
                    key: "Summary",
                    dataIndex: "Summary",
                    title: "活动小结",
                    width: 205,
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
                    width: 200,
                    ellipsis: true,
                    render: (text) => {
                        return <span>
                                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                            </span>
                    },
                },
            ]
            break
        case 'Document':
            columns = [
                {
                    key: "ProjectID",
                    dataIndex: "ProjectID",
                    title: "项目名称",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        let title = getValueByKey(projectList, JSON.stringify(text), 'Code', 'Name')
                        return <Tooltip placement="topLeft" title={title}>
                            <div className={'ellipsis'} style={{maxWidth: 150}}>{title}</div>
                        </Tooltip>
                    }
                },
                {
                    key: "DocumentName",
                    dataIndex: "DocumentName",
                    title: "文档名称",
                    width: 200,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
                    }
                },
                {
                    key: "DocumentDate",
                    dataIndex: "DocumentDate",
                    title: "文档日期",
                    width: 120,
                    ellipsis: true,
                    render: (text) => {
                        return text ? moment(text).format('YYYY-MM-DD') : ''
                    }
                },
                {
                    key: "DocumentType",
                    dataIndex: "DocumentType",
                    title: "文档类型",
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: "FileType",
                    dataIndex: "FileType",
                    title: "文件类型",
                    width: 80,
                },
                {
                    key: "FileSize",
                    dataIndex: "FileSize",
                    title: "文件大小",
                    width: 120,
                    ellipsis: true,
                },
                {
                    key: "Memo",
                    dataIndex: "Memo",
                    title: "备注",
                    width: 205,
                    ellipsis: true,
                    render: (text) => {
                        return <Tooltip placement="topLeft" title={text}>
                            <div className={'ellipsis'} style={{maxWidth: 200}}>{text}</div>
                        </Tooltip>
                    }
                },
                {
                    key: "UploadUser",
                    dataIndex: "UploadUser",
                    title: "上传人",
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: "UploadDate",
                    dataIndex: "UploadDate",
                    title: "上传时间",
                    width: 120,
                    ellipsis: true,
                    render: (text) => {
                        return text ? moment(text).format('YYYY-MM-DD') : ''
                    }
                },
            ]
            break
        case 'Tenders':
            columns = [
                {
                    key: "ProjectID",
                    dataIndex: "ProjectID",
                    title: "项目名称",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        let title = text ? getValueByKey(projectList, JSON.stringify(text), 'Code', 'Name') : ''
                        return <span>
                                <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                            </span>
                    }
                },
                {
                    key: "Name",
                    dataIndex: "Name",
                    title: "招标名称",
                    width: 150,
                    ellipsis: true,
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
                    ellipsis: true,
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
                    ellipsis: true,
                    render: (text) => {
                        let title = text ? getValueByKey(TendType, text, 'Code', 'Name') : ''
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
                        return moment(text).format("YYYY-MM-DD");
                    },
                },
                {
                    key: "PublicityType",
                    dataIndex: "PublicityType",
                    title: "公告方式",
                    width: 150,
                    ellipsis: true,
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
                    ellipsis: true,
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
                    ellipsis: true,
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
                    ellipsis: true,
                    render: (text) => {
                        return moment(text).format("YYYY-MM-DD");
                    },
                },
                {
                    key: "Address",
                    dataIndex: "Address",
                    title: "开标地点",
                    width: 150,
                    ellipsis: true,
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
                    width: 200,
                    ellipsis: true,
                    render: (text) => {
                        return <span>
                                <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                            </span>
                    },
                },
            ]
            break
        case 'Bid':
            columns = [
                {
                    key: 'IsWin',
                    dataIndex: 'IsWin',
                    title: '中标',
                    width: 50,
                    ellipsis: true,
                    render: (text) => {
                        return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                    }
                },
                {
                    key: "ProjectID",
                    dataIndex: "ProjectID",
                    title: "项目名称",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        let title = text ? getValueByKey(projectList, JSON.stringify(text), 'Code', 'Name') : ''
                        return <span>
                                <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                            </span>
                    }
                },
                {
                    key: "TenderID",
                    dataIndex: "TenderID",
                    title: "招标名称",
                    width: 150,
                    ellipsis: true,
                    render: (text) => {
                        let title = getValueByKey(tenderList, text, 'TenderID', 'Name')
                        return <span>
                                <Tooltip placement="topLeft" title={title}>{title}</Tooltip>
                            </span>
                    },
                },
                {
                    key: "Bidder",
                    dataIndex: "Bidder",
                    title: "投标人",
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: "Phone",
                    dataIndex: "Phone",
                    title: "联系电话",
                    width: 100,
                    ellipsis: true,
                },
                {
                    key: "CompanyID",
                    dataIndex: "CompanyID",
                    title: "公司名称",
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
                    key: "FirstMoney",
                    dataIndex: "FirstMoney",
                    title: "投标价格",
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
                    key: "Memo",
                    dataIndex: "Memo",
                    title: "备注",
                    width: 200,
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
            ]
            break
    }
    return columns
}