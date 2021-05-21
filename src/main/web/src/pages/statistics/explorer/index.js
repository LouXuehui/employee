import React, {Component} from "react";
import {connect} from "dva";
import styles from "./index.less";
import {Input, Table, Button, DatePicker, Select, Tabs, Tooltip} from "antd";
import {getColumns} from "./common/columns";
import moment from 'moment'

const {Option} = Select;
const dateFormat = 'YYYY-MM-DD';
const {RangePicker} = DatePicker
const {TabPane} = Tabs
const panes = [
    {id: 'Agreement', Name: '项目合同'},
    {id: 'Payment', Name: '付款情况'},
    {id: 'Document', Name: '合同附件'},
    {id: 'Action', Name: '项目活动'},
    {id: 'Tenders', Name: '招标情况'},
    {id: 'Bid', Name: '投标情况'},
]

const archiveList = [
    {Code: '2', Name: '全部'},
    {Code: '0', Name: '未归档'},
    {Code: '1', Name: '已归档'},
]

class Explorer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectPane: panes[0],
            columns: [],
            params: {isArchive: '2'}
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let payload = {page: 1, limit: 999999, parm: '', pxid: 1}
        let list = ["BuyType", "ProjectYear", "ProjectClass", "actionType", "TendType"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getDepartment"}) //公司
        dispatch({type: "dict/getEmployee"}) //职工
        dispatch({type: "dict/getCompanyList"}) //公司
        dispatch({type: 'dict/getProjects'})
        dispatch({
            type: "tender/getTenderList",
            payload
        });
        this.selectList()
    }

    selectList() {
        const {params} = this.state
        const {dispatch} = this.props;
        dispatch({type: 'explorer/setState', payload: {approvalLoading: true}})
        params.StartDate ? params.StartDate = moment(params.StartDate).format(dateFormat) : void (0)
        params.EndDate ? params.EndDate = moment(params.EndDate).format(dateFormat) : void (0)
        dispatch({
            type: "explorer/getApprovalList",
            payload: params
        });
    }

    changeValue(key, value) {
        const {params} = this.state
        if (value) {
            params[key] = value
        } else {
            delete params[key]
        }
        this.setState({params})
    }

    renderTool() {
        const {StartDate, EndDate, Money1, Money2, params} = this.state;
        const {queryList, dict} = this.props;
        const {departmentList, leaderList, BuyType, ProjectYear, ProjectClass} = dict
        let selectList = [
            {key: 'ProjectYear', list: ProjectYear, placeholder: '年度', width: 90},
            {key: 'Date'},
            {key: 'Class', list: ProjectClass, placeholder: '类别'},
            {key: 'ApplyDept', list: departmentList, placeholder: '申请科室', width: 120},
            {key: 'BuyType', list: BuyType, placeholder: '采购方式'},
            {key: 'Leader', list: leaderList, placeholder: '负责人'},
            {key: 'isArchive', list: archiveList, placeholder: '是否归档'},
        ]
        let inputList = [
            {key: 'Name', placeholder: '项目名称'},
            {key: 'Money1', placeholder: '预算金额最小值', width: 130},
            {key: 'Money2', placeholder: '预算金额最大值', width: 130},
        ]
        return <div className={styles.top}>
            <div className={styles.topLeft}>
                {
                    selectList.map(item => {
                        if (item.key === 'Date') {
                            return <RangePicker style={{marginRight: 10, marginBottom: 10}}
                                                picker="days"
                                                allowClear
                                                onChange={(dates) => {
                                                    let start = ''
                                                    let end = ''
                                                    if (dates) {
                                                        start = dates[0]
                                                        end = dates[1]
                                                    }
                                                    this.changeValue('StartDate', start)
                                                    this.changeValue('EndDate', end)
                                                }}/>
                        } else {
                            let list = item.list
                            return <Select showSearch
                                           allowClear
                                           value={params[item.key]}
                                           style={{
                                               width: item.width ? item.width : 100,
                                               marginRight: 10,
                                               marginBottom: 10
                                           }}
                                           filterOption={(input, option) =>
                                               option.children
                                                   .toLowerCase()
                                                   .indexOf(input.toLowerCase()) >= 0
                                           }
                                           onChange={(value) => {
                                               this.changeValue(item.key, value)
                                           }}
                                           placeholder={item.placeholder}
                            >
                                {list && list.length > 0
                                    ? list.map((item) => {
                                        return (
                                            <Option key={item.Code} value={item.Code}>
                                                <Tooltip title={item.Name}>
                                                    {item.Name}
                                                </Tooltip>
                                            </Option>
                                        );
                                    })
                                    : void 0}
                            </Select>
                        }
                    })
                }
                {
                    inputList.map(item => {
                        return <Input style={{width: item.width ? item.width : 200, marginRight: 10, marginBottom: 10}}
                                      placeholder={item.placeholder}
                                      onChange={(e) => this.changeValue(item.key, e.target.value)}/>
                    })
                }
            </div>
            <div>
                <Button onClick={() => this.selectList()}>刷新</Button>
            </div>
        </div>
    }

    queryList(record) {
        const {selectPane} = this.state
        const {dispatch} = this.props
        dispatch({type: 'explorer/setState', payload: {queryLoading: true}})
        dispatch({type: 'explorer/getFormProjectList', payload: {api: selectPane.id, id: record.ID}})
    }

    changePane(item) {
        const {dict, selectedProject, tender} = this.props
        const {dataList: tenderList} = tender
        let columns = getColumns({...dict, tenderList}, item.id)
        this.setState({selectPane: item, columns}, () => {
            this.queryList(selectedProject)
        })
    }

    render() {
        const {selectPane, columns} = this.state;
        const {dispatch, dict, approvalLoading, approvalList, selectedProject, queryList, queryLoading, tender} = this.props;
        const {dataList: tenderList} = tender
        let approvalColumns = getColumns({...dict, tenderList}, 'Approval')
        let showColumns = columns.length ? columns : getColumns(dict, panes[0].id)
        let dom = document.getElementById('content')
        let height
        if (dom) {
            height = dom.clientHeight
        }

        return (
            <div className={styles.file}>
                {this.renderTool()}
                <div id="content" className={styles.content}>
                    <div className={styles.approvalWrapper}>
                        <Table
                            rowKey={(record) => record.ID}
                            columns={approvalColumns}
                            dataSource={approvalList}
                            loading={approvalLoading}
                            scroll={{x: '100%', y: 225}}
                            scrollToFirstRowOnChange={true}
                            rowClassName={(record) => {
                                return record &&
                                record.ID === selectedProject.ID
                                    ? "clickRowStyle"
                                    : void 0;
                            }}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        dispatch({type: 'explorer/setState', payload: {selectedProject: record}})
                                        this.queryList(record)
                                    }, // 点击行
                                };
                            }}
                            pagination={{
                                showSizeChanger: false,
                                pageSize: 5
                            }}
                        />
                    </div>
                    <div className={styles.tabs}>
                        {
                            panes.map(item => {
                                return <div className={selectPane.id === item.id ? styles.selectedPane : styles.tabPane}
                                            onClick={() => this.changePane(item)}>
                                    {item.Name}
                                </div>
                            })
                        }
                    </div>
                    <div className={styles.table}>
                        <Table
                            rowKey={(record) => record.ID}
                            columns={showColumns}
                            dataSource={queryList}
                            loading={queryLoading}
                            scroll={{x: '100%'}}
                            scrollToFirstRowOnChange={true}
                            pagination={{
                                showSizeChanger: false,
                                pageSize: height - 455 - 45 * 5 > 0 ? Math.floor((height - 455) / 45) : 5
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({dict, tender, explorer}) => ({dict, tender, ...explorer}))(
    Explorer
);

