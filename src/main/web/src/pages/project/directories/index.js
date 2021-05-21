import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Table, Tooltip, Button} from "antd";
import moment from "moment";
import TipModal from 'components/TipModal'
import {getValueByKey} from "common/arr";
import Operation from "components/Operation";
import EditModal from "./EditModal"
import {lookList, companyStatusList} from "@/common/domain";
import {moneyFormat} from "@/common/arr";

const {Search} = Input;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            current: 1, //当前页码
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let list = ["CompanyType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getEmployee"}) //人员
        dispatch({type: "dict/getDepartment"}) //科室
        this.getDataList()
    }

    getDataList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'directories/setState', payload: {loading: true}})
        dispatch({
            type: "directories/getDirectoriesList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props;
        dispatch({type: "directories/setState", payload: {showEditModal: true}});
    }

    //编辑弹框
    showEditModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "directories/setState", payload: {showEditModal: true, record}});
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "directories/setState", payload: {directoriesVisible: true, record}});
    }


    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "directories/setState", payload: {directoriesVisible: false, record: ''}});
    }

    //删除
    handleOk() {
        const {current} = this.state
        const {dispatch, record} = this.props;
        dispatch({type: "directories/deleteDirectoriesItem", payload: {id: record.ID}}).then(res => {
            if (res) {
                this.getDataList(current)
            }
        })
        dispatch({type: "directories/setState", payload: {directoriesVisible: false, record: ''}});

    }

    render() {
        const {current, pageSize, keyword} = this.state;
        const {showEditModal, directoriesList, loading, total, record, directoriesVisible, departmentList, dict} = this.props;
        const {CompanyType, leaderList} = dict
        let columns = [
            {
                key: "Name",
                dataIndex: "Name",
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
                key: "Type",
                dataIndex: "Type",
                title: "类别",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(CompanyType, text, 'Code', 'Name')
                    return title
                }
            },
            {
                key: "Address",
                dataIndex: "Address",
                title: "公司地址",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "Bank",
                dataIndex: "Bank",
                title: "开户行",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "Account",
                dataIndex: "Account",
                title: "银行账号",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            }, {
                key: "LegalPerson",
                dataIndex: "LegalPerson",
                title: "法人",
                width: 100,
                ellipsis: true,
            }, {
                key: "CompanyTel",
                dataIndex: "CompanyTel",
                title: "公司电话",
                width: 100,
                ellipsis: true,
            }, {
                key: "RelationTel",
                dataIndex: "RelationTel",
                title: "联系电话",
                width: 100,
                ellipsis: true,
            }, {
                key: "RelationPerson",
                dataIndex: "RelationPerson",
                title: "联系人",
                width: 100,
                ellipsis: true,
            }, {
                key: "CompanyFax",
                dataIndex: "CompanyFax",
                title: "公司传真",
                width: 100,
                ellipsis: true,
            }, {
                key: "Website",
                dataIndex: "Website",
                title: "网站",
                width: 150,
                ellipsis: true,
            }, {
                key: "Email",
                dataIndex: "Email",
                title: "电子邮箱",
                width: 150,
                ellipsis: true,
            }, {
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
            }, {
                key: "Range",
                dataIndex: "Range",
                title: "经营范围",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            }, {
                key: "Capital",
                dataIndex: "Capital",
                title: "注册资金",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    return moneyFormat(text)
                },
            }, {
                key: "Cases",
                dataIndex: "Cases",
                title: "主要业绩",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "Qualification",
                dataIndex: "Qualification",
                title: "公司资质",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            },
            {
                key: "RegisterDate",
                dataIndex: "RegisterDate",
                title: "成立时间",
                width: 120,
                ellipsis: true,
                render: (text) => {
                    return text ? moment(text).format("YYYY-MM-DD") : ''
                },
            },
            {
                key: "Flag",
                dataIndex: "Flag",
                title: "标志",
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
                    let title = getValueByKey(leaderList, text, 'Code', 'Name')
                    return title
                }
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
                key: "Owner",
                dataIndex: "Owner",
                title: "所有者",
                width: 100,
                ellipsis: true,
            },
            {
                key: "AllLook",
                dataIndex: "AllLook",
                title: "操作权限",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(lookList, text, 'key', 'value')
                    return title
                }
            }, {
                key: "Status",
                dataIndex: "Status",
                title: "状态",
                width: 100,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(companyStatusList, text, 'key', 'value')
                    return title
                }
            }, {
                key: "Area",
                dataIndex: "Area",
                title: "地区",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span>
                        <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                    </span>
                },
            }, {
                key: "IsSupplier",
                dataIndex: "IsSupplier",
                title: "是否供应商",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return text ? '是' : '否'
                }
            }, {
                key: "IsVender",
                dataIndex: "IsVender",
                title: "是否厂家",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return text ? '是' : '否'
                }
            }, {
                key: "Department",
                dataIndex: "Department",
                title: "使用部门",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    let title = getValueByKey(departmentList, text, 'Code', 'Name')
                    return title
                }
            },
            {
                title: "操作",
                key: "action",
                fixed: "right",
                width: 100,
                render: (text, record) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.showEditModal(record)}/>
                        <div><span className={'delete'} onClick={() => this.showDeleteModal(record)}>删除</span></div>
                    </div>
                ),
            },
        ];
        const limit = Math.floor((document.body.clientHeight - 270) / 43)

        return (
            <div className={styles.file}>
                <div className={styles.top}>
                    <Search
                        placeholder="公司名称"
                        onSearch={() => this.getDataList(current, keyword)}
                        onPressEnter={() => this.getDataList(current, keyword)}
                        onChange={(e) => this.setState({keyword: e.target.value})}
                        style={{width: 200, marginRight: 10}}
                    />
                    <div className={styles.headerRight}>
                        <Button onClick={() => this.getDataList(1, keyword)}>刷新</Button>
                        <Button type='primary' onClick={() => this.handleAdd()}>新增</Button>
                    </div>
                </div>
                <div id="project" className={styles.content}>
                    <Table
                        rowKey={(record) => record.ID}
                        columns={columns}
                        dataSource={directoriesList}
                        loading={loading}
                        scroll={{x: '100%', y: pageSize > limit ? limit * 43 : void (0)}}
                        pagination={{
                            pageSize,
                            current,
                            total,
                            onChange: (current) => {
                                this.getDataList(current, keyword)
                            },
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.getDataList(current, keyword, size)
                            },
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {
                    showEditModal ? <EditModal record={record}
                                               getDataList={() => this.getDataList(record ? current : 1, record ? keyword : '')}
                                               current={current}
                    /> : void (0)
                }
                {
                    directoriesVisible ?
                        <TipModal visible={directoriesVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleOk()}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.directories))(Index);
