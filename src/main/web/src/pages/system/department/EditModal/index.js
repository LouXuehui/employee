import React, {Component} from "react";
import {connect} from "dva";
import {Button, Form, Input, Modal, Select, Switch, Row, Col} from "antd";
import {getStringLength} from "common/arr"
import {OutFlag} from "@/common/domain";

const {TextArea} = Input;
const {Option} = Select;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 19}
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formRef = React.createRef();
    }

    handleOk() {
        const {dispatch, form, record, current, getDataList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            values.IsUse = values.IsUse ? values.IsUse : false
            let payload = record ? {...record, ...values} : values
            dispatch({
                type: record ? "department/editDepartment" : "department/addDepartment",
                payload
            }).then(res => {
                if (res) {
                    getDataList()
                }
            })
        })
            .catch((errorInfo) => {
                return;
            });
    }

    handleCancel() {
        const {dispatch} = this.props
        dispatch({type: "department/setState", payload: {showEditModal: false, record: ''}});
        this.formRef.current.resetFields()
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
        const {dispatch, showEditModal, record, dict} = this.props;
        const {leaderList, DepartmentClass} = dict
        return (
            <Modal
                title={record ? "编辑部门" : "新增部门"}
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
                    initialValues={record ? record : {IsUse: true}}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <FormItem
                        label="编码"
                        name="Code"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "编码", 100)
                        }]}
                        {...formItemLayout}
                    >
                        <Input disabled={!!record}/>
                    </FormItem>
                    <FormItem
                        label="名称"
                        name="Name"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "名称", 100)
                        }]}
                        {...formItemLayout}
                    >
                        <Input style={{width: '100%'}}
                               onBlur={(e) => {
                                   let value = e.target.value
                                   if (value) {
                                       dispatch({type: 'dict/getCode', payload: {text: value}}).then((data) => {
                                           if (data) {
                                               this.formRef.current.setFieldsValue({
                                                   WbCode: data.WB, PyCode: data.PY
                                               })
                                           }
                                       })
                                   } else {
                                       this.formRef.current.setFieldsValue({
                                           WbCode: '', PyCode: ''
                                       })
                                   }
                               }}/>
                    </FormItem>
                    <FormItem
                        label="科室分类"
                        name="DeptClass"
                        {...formItemLayout}
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Select showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }>
                            {DepartmentClass && DepartmentClass.length > 0
                                ? DepartmentClass.map((item) => {
                                    return (
                                        <Option key={item.Code} value={item.Code}>
                                            {item.Name}
                                        </Option>
                                    );
                                })
                                : void 0}
                        </Select>
                    </FormItem>
                    <FormItem
                        label="外部标志"
                        name="OutFlag"
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Select>
                            {
                                OutFlag.map(item => {
                                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    {/*<FormItem*/}
                    {/*    label="扩展码"*/}
                    {/*    name="ExternCode"*/}
                    {/*    rules={[{*/}
                    {/*        required: true,*/}
                    {/*    }]}*/}
                    {/*>*/}
                    {/*    <Select>*/}
                    {/*        {*/}
                    {/*            ExternCode.map(item => {*/}
                    {/*                return <Option key={item.Code} value={item.Code}>{item.Name}</Option>*/}
                    {/*            })*/}
                    {/*        }*/}
                    {/*    </Select>*/}
                    {/*</FormItem>*/}
                    <FormItem
                        label="联络人"
                        name="Liaison"
                        {...formItemLayout}
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Select showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }>
                            {leaderList && leaderList.length > 0
                                ? leaderList.map((item) => {
                                    return (
                                        <Option key={item.Code} value={item.Code}>
                                            {item.Name}
                                        </Option>
                                    );
                                })
                                : void 0}
                        </Select>
                    </FormItem>
                    <FormItem
                        label="电话"
                        name="Telephone"
                        {...formItemLayout}
                        rules={[{
                            required: true,
                        }]}
                    >
                        <Input type={'tel'}/>
                    </FormItem>
                    <FormItem
                        label="是否使用"
                        name="IsUse"
                        {...formItemLayout}
                        valuePropName="checked"
                    >
                        <Switch/>
                    </FormItem>
                    <FormItem
                        label="备注"
                        name="Memo"
                        {...formItemLayout}
                    >
                        <TextArea/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({dict, department}) => ({dict, ...department}))(Index);
