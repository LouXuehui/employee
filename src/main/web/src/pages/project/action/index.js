import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Button, Table, Tooltip} from "antd";
import Operation from "components/Operation";
import EditModal from "./EditModal";
import {getValueByKey} from "common/arr";
import TipModal from 'components/TipModal'
import moment from 'moment'

const {Search} = Input;

class action extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
            current: 1,
            keyword: '',
            visible: false, //删除的确认弹框
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        this.getActionList()
        let list = ["actiontype"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getProjects'})
        dispatch({type: "dict/getEmployee"}) //人员
    }

    getActionList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        this.setState({current})
        dispatch({type: 'action/setState', payload: {tableLoading: true}})
        dispatch({
            type: "action/getActionList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    add() {
        const {dispatch} = this.props
        dispatch({
            type: "action/setState",
            payload: {modalVisible: true, record: ''},
        })
    }

    //编辑
    update(record) {
        const {dispatch} = this.props
        dispatch({
            type: "action/setState",
            payload: {modalVisible: true, record},
        })
    }

    //删除
    delete(record) {
        const {dispatch} = this.props
        dispatch({
            type: 'action/delete',
            payload: {id: record.ActionID}
        }).then(res => {
            res ? this.getActionList() : void (0)
        })
        this.showDeleteModal()
    }

    showDeleteModal(record) {
        const {dispatch} = this.props
        const {visible} = this.state
        this.setState({visible: !visible})
        dispatch({type: 'action/setState', payload: {record}})
    }

    render() {
        const {pageSize, current, visible, keyword} = this.state;
        const {record, dataList, modalVisible, tableLoading, total, dict} = this.props
        const {projectList, leaderList, actiontype} = dict
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
                width: 100,
                render: (text, record) => {
                    let title = getValueByKey(actiontype, text, 'Code', 'Name')
                    return title
                }
            },
            {
                key: "ActionDate",
                dataIndex: "ActionDate",
                title: "活动时间",
                width: 120,
                render: (text, record) => {
                    return moment(text).format("YYYY-MM-DD");
                },
            },
            {
                key: "ActionPosition",
                dataIndex: "ActionPosition",
                title: "活动地点",
                width: 150,
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
                width: 150,
                render: (text, record) => {
                    let title = ''
                    if (text && text.length) {
                        text.map((item, index) => {
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
                width: 150,
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
                width: 100,
                fixed: "right",
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
                    <div className={styles.toolLeft}>
                        <Search
                            placeholder="活动名称"
                            onPressEnter={() => this.getActionList(1, keyword)}
                            onSearch={() => this.getActionList(1, keyword)}
                            onChange={(e) => this.setState({keyword: e.target.value})}
                            style={{width: 200, marginRight: 10}}
                        />
                    </div>
                    <div className={styles.toolRight}><Button onClick={() => this.getActionList(1, keyword)}>刷新</Button>
                        <Button type="primary" onClick={() => this.add()}>
                            新增
                        </Button></div>
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
                            onChange: (current) => {
                                this.getActionList(current, keyword)
                            },
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.getActionList(current, keyword, size)
                            },
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {modalVisible ? <EditModal
                    getActionList={() => this.getActionList(record ? current : 1, record ? keyword : '')}/> : void (0)}
                {
                    visible ?
                        <TipModal visible={visible}
                                  message={'删除'}
                                  cancelModal={() => this.showDeleteModal()}
                                  onOK={() => this.delete(record)}
                        /> : void (0)
                }
            </div>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.action))(action);
