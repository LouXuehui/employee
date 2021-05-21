import React, {Component} from "react";
import {connect} from "dva";
import {Button, DatePicker, Form, Input, Modal, Select, Switch} from "antd";
import {getStringLength} from "common/arr"
import moment from 'moment'

const {Option} = Select;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18}
}
const LastTime = moment().format('YYYY-MM-DD HH:mm:ss')

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formRef = React.createRef();
    }

    handleOk() {
        const {dispatch, form, record, getDataList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : values
            dispatch({
                type: `userManagement/${record ? 'editUser' : 'addUser'}`,
                payload
            }).then(res => {
                if (res) {
                    getDataList()
                } else {
                    return
                }
            })
        })
            .catch((errorInfo) => {
                return;
            });
    }

    handleCancel() {
        const {dispatch} = this.props
        dispatch({type: "userManagement/setState", payload: {showEditModal: false, record: ''}});
    }

    //校验字符长度
    validator(rule, value, callback, label, max) {
        if (value) {
            if (getStringLength(value) > max) {
                callback(`${label}超出字段长度！`)
            } else {
                callback()
            }
        } else {
            if (rule.required) {
                callback(`${label}不能为空！`)
            } else {
                callback()
            }
        }
    }

    render() {
        const {showEditModal, record, addUserList, role} = this.props;
        const {dataList} = role

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
                <Form
                    ref={this.formRef}
                    {...formItemLayout}
                    initialValues={record ? {
                        ...record,
                        LastTime: record.LastTime ? moment(record.LastTime) : '',
                    } : {ModelNo: 'XXKGL', IsUse: true, LastTime: moment()}}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <FormItem
                        label="姓名"
                        name="UserName"
                        rules={[{
                            required: true,
                            // validator: (rule, value, callback) => this.validator(rule, value, callback, "姓名", 100)
                        }]}
                        {...formItemLayout}
                    >
                        <Select showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={(key, option) => {
                                    this.formRef.current.setFieldsValue({
                                        EmployeeNo: option.key
                                    })
                                }}
                                disabled={record ? true : false}
                        >
                            {
                                addUserList && addUserList.length ? addUserList.map(item => {
                                    return <Option value={item.Name}
                                                   key={item.Code}>{`${item.Name}(${item.Code})`}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="工号"
                        name="EmployeeNo"
                        rules={[{required: true}]}
                        {...formItemLayout}
                    >
                        <Input style={{width: '100%'}} disabled={true}/>
                    </FormItem>
                    <FormItem
                        label="登录名"
                        name="UserCode"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "登录名", 100)
                        }]}
                    >
                        <Input style={{width: '100%'}}/>
                    </FormItem>
                    <FormItem
                        label="密码"
                        name="UserPass"
                        rules={[{required: true}]}
                        {...formItemLayout}
                    >
                        <Input.Password/>
                    </FormItem>
                    <FormItem
                        label="模块"
                        name="ModelNo"
                        {...formItemLayout}
                    >
                        <Input style={{width: '100%'}} disabled={true}/>
                    </FormItem>
                    <FormItem
                        label="是否使用"
                        name="IsUse"
                        {...formItemLayout}
                        valuePropName="checked"
                    >
                        <Switch/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({role, userManagement, dict}) => ({role, ...userManagement, dict}))(Index);
