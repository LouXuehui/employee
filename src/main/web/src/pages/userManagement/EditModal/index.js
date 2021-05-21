import React, {Component} from "react";
import {connect} from "dva";
import {Button, Modal, Table, Tooltip} from "antd";
import {getStringLength} from "common/arr"
import {CheckCircleTwoTone} from "@ant-design/icons";
import moment from "moment";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formRef = React.createRef();
    }

    handleCancel() {
        const {dispatch} = this.props
        dispatch({type: "userManagement/setState", payload: {showEditModal: false, record: ''}});
    }

    handleOk() {
        const {dispatch} = this.props
        const {selectedRows} = this.state
        dispatch({type: "userManagement/insert", payload: selectedRows}).then(res => res && this.handleCancel())
    }

    render() {
        const {showEditModal, userList, employee} = this.props;
        const {dataList} = employee
        let datasource = dataList.filter(data => userList.findIndexById(data.id, 'empId'))
        let columns = [
            {
                key: 'statusCode',
                dataIndex: 'statusCode',
                title: '状态',
                width: 50,
                render: text => {
                    return text ? <CheckCircleTwoTone/> : <div className={'circle'}/>
                }
            },
            {
                key: 'id',
                dataIndex: 'id',
                title: '工号',
                width: 80,
                ellipsis: true
            },
            {
                key: 'name',
                dataIndex: 'name',
                title: '姓名',
                width: 150,
                ellipsis: true,
                render: text => {
                    return (
                        <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
                    )
                }
            },
            {
                key: 'sexCode',
                dataIndex: 'sexCode',
                title: '性别',
                width: 50,
                ellipsis: true,
                render: text => {
                    return text === '1' ? '男' : '女'
                }
            },
            {
                key: 'birth',
                dataIndex: 'birth',
                title: '出生日期',
                width: 120,
                ellipsis: true,
                render: text => {
                    return text ? moment(text).format('YYYY-MM-DD') : ''
                }
            },
            {
                key: 'tel',
                dataIndex: 'tel',
                title: '移动电话',
                width: 120,
                ellipsis: true
            },
            {
                key: 'idCard',
                dataIndex: 'idCard',
                title: '身份证号',
                width: 180,
                ellipsis: true
            },
            {
                key: 'place',
                dataIndex: 'place',
                title: '籍贯',
                width: 180,
                ellipsis: true,
                render: text => {
                    return (
                        <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
                    )
                }
            },
            {
                key: 'address',
                dataIndex: 'address',
                title: '地址',
                width: 150,
                ellipsis: true,
                render: text => {
                    return (
                        <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
                    )
                }
            },
            {
                key: 'remark',
                dataIndex: 'remark',
                title: '备注',
                width: 150,
                ellipsis: true,
                render: text => {
                    return (
                        <span>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </span>
                    )
                }
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                fixed: 'right',
                render: (text, record) => (
                    <div className="operation">
                        <Operation name="编辑" addDivider onClick={() => this.showEditModal(record)}/>
                        <div>
              <span className={'delete'} onClick={() => this.showDeleteModal(record)}>
                删除
              </span>
                        </div>
                    </div>
                )
            }
        ]

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRowKeys, selectedRows})
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
        };

        return (
            <Modal
                title={record ? "编辑用户" : "新增用户"}
                visible={showEditModal}
                width={600}
                onCancel={() => this.handleCancel()}
                footer={[
                    <Button onClick={() => this.handleCancel()}>取消</Button>,
                    <Button type="primary" onClick={(e) => this.handleOk(e)}>
                        确认
                    </Button>
                ]}
            >
                Table
                rowSelection={{
                type: 'checkbox',
                ...rowSelection,
            }}
                columns={columns}
                dataSource={datasource}
                />
            </Modal>
        );
    }
}

export default connect(({userManagement, employee}) => ({employee, ...userManagement}))(Index);
