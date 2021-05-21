import React, {Component} from "react"
import {connect} from "dva"
import styles from "./index.less"
import {Input, Button, Table, Tooltip, message} from "antd"
import Operation from "components/Operation"
import EditModal from "./EditModal"
import moment from "moment"
import TipModal from 'components/TipModal'
import {domain} from "common/domain"
import {getValueByKey} from "@/common/arr";
import PreviewModal from './previewModal'

const {Search} = Input;

class Enclosure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: Math.floor((document.body.clientHeight - 270) / 43),
            current: 1,
            keyword: "",
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        let list = ["ProjectFile"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: 'dict/getProjects'})//项目列表
        this.selectList()
    }

    selectList(current = 1, keyword = '', limit) {
        const {pageSize} = this.state
        const {dispatch} = this.props;
        dispatch({type: 'enclosure/setState', payload: {tableLoading: true, current}})
        dispatch({
            type: "enclosure/getEnclosureList",
            payload: {page: current, pxid: 1, limit: limit ? limit : pageSize, parm: keyword},
        });
    }

    //新增
    handleAdd() {
        const {dispatch} = this.props;
        dispatch({
            type: "enclosure/setState",
            payload: {modalVisible: true, record: ''},
        });
    }

    //编辑
    update(record) {
        const {dispatch} = this.props;
        dispatch({
            type: "enclosure/setState",
            payload: {modalVisible: true, record},
        });
    }

    //下载
    handleUpload(record) {
        window.open(`${domain}/document/download?id=${record.FileID}`)
    }

    //显示删除提示框
    showDeleteModal(record) {
        const {dispatch} = this.props;
        dispatch({type: "enclosure/setState", payload: {enclosureVisible: true, record}});
    }

    //关闭删除提示框
    cancelDeleteModal() {
        const {dispatch} = this.props;
        dispatch({type: "enclosure/setState", payload: {enclosureVisible: false, record: ''}});
    }

    //删除
    handleDelete() {
        const {dispatch, record} = this.props;
        dispatch({type: "enclosure/delete", payload: {id: record.FileID}}).then(res => {
            if (res) {
                this.selectList()
            }
        })
        dispatch({type: "enclosure/setState", payload: {enclosureVisible: false, record: ''}});
    }

    render() {
        const {dispatch, current, dataList, total, record, modalVisible, enclosureVisible, previewVisible, tableLoading, dict} = this.props;
        const {pageSize, keyword} = this.state;
        const {projectList} = dict
        const columns = [
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
                key: "DocumentName",
                dataIndex: "DocumentName",
                title: "文档名称",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
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
                width: 100
            },
            {
                key: "FileType",
                dataIndex: "FileType",
                title: "文件类型",
                width: 100
            },
            {
                key: "FileSize",
                dataIndex: "FileSize",
                title: "文件大小",
                width: 100,
            },
            {
                key: "Memo",
                dataIndex: "Memo",
                title: "备注",
                width: 150,
                ellipsis: true,
                render: (text) => {
                    return <span><Tooltip placement="topLeft" title={text}>{text}</Tooltip></span>
                },
            },
            {
                key: "UploadUser",
                dataIndex: "UploadUser",
                title: "上传人",
                width: 100
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
            {
                key: "action",
                dataIndex: "action",
                title: "操作",
                width: 170,
                fixed: "right",
                render: (text, record, index) => (
                    <div className="operation">
                        {/*<Operation name="预览" addDivider*/}
                        {/*           onClick={() => {*/}
                        {/*               let previewImage*/}
                        {/*               if (record.filePath) {*/}
                        {/*                   previewImage = `${domain}/${record.filePath}/${record.Documentname}${record.FileType}`*/}
                        {/*                   this.setState({previewVisible: true, previewImage})*/}
                        {/*               } else {*/}
                        {/*                   message.warning('未找到存储地址，无法预览')*/}
                        {/*               }*/}
                        {/*               // dispatch({type: 'enclosure/getFrom', payload: {id: record.FileID}})*/}
                        {/*               // dispatch({type: 'enclosure/setState', payload: {record}})*/}
                        {/*           }}/>*/}
                        <Operation name="下载" addDivider onClick={() => this.handleUpload(record)}/>
                        <Operation name="编辑" addDivider onClick={() => this.update(record)}/>
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
                            placeholder="文档名称"
                            onPressEnter={() => this.selectList(1, keyword)}
                            onSearch={() => this.selectList(1, keyword)}
                            onChange={(e) => this.setState({keyword: e.target.value})}
                            style={{width: 200, marginRight: 10}}
                        />
                    </div>
                    <div>
                        <Button onClick={() => this.selectList(1, keyword)}>刷新</Button>
                        <Button type="primary" onClick={() => this.handleAdd()}>上传</Button>
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
                            onChange: (current) => {
                                this.selectList(current, keyword)
                            },
                            showSizeChanger: true,
                            onShowSizeChange: (current, size) => {
                                this.setState({pageSize: size})
                                this.selectList(current, keyword, size)
                            },
                        }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
                {modalVisible ?
                    <EditModal
                        documentVisible={modalVisible}
                        selectedProject={''}
                        record={record}
                        cancelModal={() => dispatch({
                            type: "enclosure/setState",
                            payload: {modalVisible: false, record: ""},
                        })}
                        selectList={() => record ? this.selectList(current, keyword) : void (0)}/> : void (0)}
                {
                    enclosureVisible ?
                        <TipModal visible={enclosureVisible}
                                  message={'删除'}
                                  cancelModal={() => this.cancelDeleteModal()}
                                  onOK={() => this.handleDelete()}
                        /> : void (0)
                }
                {
                    previewVisible ?
                        <PreviewModal/> : void (0)
                }
            </div>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.enclosure))(Enclosure);
