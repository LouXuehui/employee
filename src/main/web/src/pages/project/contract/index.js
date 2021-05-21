import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Button, Table, Tooltip} from "antd";
import Operation from "components/Operation";
import EditModal from "./EditModal";
import moment from "moment";
import {getValueByKey} from "common/arr"
import TipModal from 'components/TipModal'
import {moneyFormat} from "@/common/arr";

const {Search} = Input;
const clientHeight = document.body.clientHeight;

class Contract extends Component {
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
        let list = ["AgreementType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getProjects'})//项目列表
        dispatch({type: "dict/getCompanyList"}) //公司
        this.selectList()
    }

    selectList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        dispatch({type: 'contract/setState', payload: {tableLoading: true}})
        dispatch({
            type: "contract/getContractList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props;
        dispatch({type: "contract/setState", payload: {modalVisible: true, record: ''},});
    }

    //编辑
    update(record) {
        const {dispatch} = this.props;
        let itemData = {
            ...record,
            SignDate: moment(record.SignDate),
            StartDate: moment(record.StartDate),
            EndDate: moment(record.EndDate),
        };
        dispatch({type: "contract/setState", payload: {modalVisible: true, record: itemData},});
    }


    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "contract/setState", payload: {contractVisible: true, record}});
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "contract/setState", payload: {contractVisible: false, record: ''}});
    }

    //删除
    handleDelete() {
        const {dispatch, record} = this.props;
        dispatch({type: "contract/deleteContractItem", payload: {id: record.SignID}}).then(res => {
            if (res) {
                this.selectList()
            }
        })
    }

    render() {
        const {dataList, modalVisible, contractVisible, tableLoading, total, record, dict} = this.props;
        const {keyword, pageSize, current} = this.state;
        const {projectList, leaderList, companyList, AgreementType} = dict
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
                ellipsis: true,
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
                        <Operation
                            name="编辑"
                            addDivider
                            onClick={() => this.update(record)}
                        />
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ];
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.action}>
                <div className={styles.top}>
                    <div>
                        <Search
                            placeholder="合同名称"
                            onPressEnter={() => this.selectList(1, keyword)}
                            onSearch={() => this.selectList(1, keyword)}
                            onChange={(e) => this.setState({keyword: e.target.value})}
                            style={{width: 200, marginRight: 10}}
                        />
                    </div>
                    <div>
                        <Button onClick={() => this.selectList(1, keyword)}>刷新</Button>
                        <Button type="primary" onClick={() => this.handleAdd()}>新增</Button>
                    </div>
                </div>
                <div id="project" className={styles.project}>
                    <Table
                        loading={tableLoading}
                        columns={columns}
                        dataSource={dataList}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                        pagination={{
                            pageSize,
                            current,
                            total,
                            showSizeChanger: true,
                            onChange: (current) => {
                                this.selectList(current, keyword)
                            },
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.selectList(current, keyword, size)
                            }
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {modalVisible ? <EditModal
                    selectList={() => this.selectList(record ? current : 1, record ? keyword : '')}/> : void (0)}
                {
                    contractVisible ?
                        <TipModal visible={contractVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleDelete()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.contract))(Contract);
