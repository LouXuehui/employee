import React, {Component} from "react";
import {connect} from "dva";
import {Button, Modal, Table, Tooltip} from "antd";
import {CheckCircleTwoTone} from "@ant-design/icons";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCancel() {
        const {dispatch} = this.props
        dispatch({type: "userManagement/setState", payload: {showEditModal: false, record: ''}});
    }

    handleOk() {
        const {dispatch, selectedRoleId} = this.props
        const {selectedRowKeys} = this.state
        dispatch({
            type: "userManagement/insert",
            payload: {list: selectedRowKeys, roleId: selectedRoleId}
        }).then(res => res && this.handleCancel())
    }

    render() {
        const {showEditModal, userList, employee} = this.props;
        const {dataList} = employee
        let datasource = dataList.filter(data => userList.findIndexById(data.id, 'empId') === -1)
        let columns = [
            {
                key: 'statusCode',
                dataIndex: 'statusCode',
                title: '状态',
                width: 60,
                fixed: 'left',
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
                width: 60,
                ellipsis: true,
                render: text => {
                    return text === '1' ? '男' : '女'
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
                title={"新增用户"}
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
                <Table
                    rowKey={(row) => row.id}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    scroll={{x: 800}}
                    dataSource={datasource}
                />
            </Modal>
        );
    }
}

export default connect(({userManagement, employee}) => ({employee, ...userManagement}))(Index);
