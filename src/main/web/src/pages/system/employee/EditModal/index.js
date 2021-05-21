import React, {Component} from "react";
import {connect} from "dva";
import {Button, DatePicker, Form, Input, Modal, Select, Row, Col, InputNumber, Switch} from "antd";
import {getStringLength} from "common/arr"
import moment from 'moment'

const {TextArea} = Input;
const {Option} = Select;
const FormItem = Form.Item;
const formItemLayout = [
    {labelCol: {span: 4}, wrapperCol: {span: 19}},
    {labelCol: {span: 8}, wrapperCol: {span: 16}},
    {labelCol: {span: 8}, wrapperCol: {span: 14}},
]

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formRef = React.createRef();
    }

    handleOk() {
        const {dispatch, record, selectList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : values
            dispatch({
                type: `employee/${record ? 'edit' : 'add'}`,
                payload
            }).then(res => {
                if (res) {
                    this.handleCancel()
                    selectList()
                }
            })
        })
            .catch((errorInfo) => {
                return;
            });
    }

    handleCancel() {
        const {dispatch} = this.props
        dispatch({type: "employee/setState", payload: {showEditModal: false, record: ''}});
    }

    //校验字符长度
    validator(rule, value, callback, label, max) {
        if (value) {
            if (getStringLength(value) > max) {
                callback(`${label}超出字段长度！`)
            } else if (label === '移动电话') {
                if (!(/^1[3456789]\d{9}$/.test(value))) {
                    callback("移动电话填写有误！")
                } else {
                    callback()
                }
            } else if (label === '身份证号') {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!(reg.test(value))) {
                    callback("身份证号填写有误！")
                } else {
                    callback()
                }
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
        const {dispatch, showEditModal, record, dict} = this.props
        const {departmentList, SexCode, EmployeeTitle} = dict

        return (
            <Modal
                title={record ? "编辑职工信息" : "新增职工信息"}
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
                    {...formItemLayout[0]}
                    initialValues={record ? {
                        ...record,
                        BirthDate: record.BirthDate ? moment(record.BirthDate) : ''
                    } : {
                        Status: true
                    }}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="工号"
                                name="Code"
                                rules={[{required: true}]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}} disabled={!!record}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="姓名"
                                name="Name"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "姓名", 100)
                                }]}
                                {...formItemLayout[2]}
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
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="卡号"
                                name="CardID"
                                rules={[{required: true}]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="性别"
                                name="Sex"
                                {...formItemLayout[2]}
                            >
                                <Select>
                                    {
                                        SexCode && SexCode.length ? SexCode.map(item => {
                                            return <Option value={item.Code}>{item.Name}</Option>
                                        }) : void (0)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="职务"
                                name="Title"
                                rules={[{required: true}]}
                                {...formItemLayout[1]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {
                                        EmployeeTitle && EmployeeTitle.length ? EmployeeTitle.map(item => {
                                            return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                        }) : void (0)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="科室"
                                name="DeptCode"
                                rules={[{
                                    required: true,
                                }]}
                                {...formItemLayout[2]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {
                                        departmentList && departmentList.length ? departmentList.map(item => {
                                            return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                        }) : void (0)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="出生日期"
                                name="BirthDate"
                                rules={[{
                                    required: true,
                                }]}
                                {...formItemLayout[1]}
                            >
                                <DatePicker style={{width: '100%'}}
                                            disabledDate={(currentDate) => {
                                                return currentDate > moment()
                                            }}
                                            onChange={(date) => {
                                                let Age = moment().diff(date, 'year')
                                                this.formRef.current.setFieldsValue({Age})
                                            }}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="年龄"
                                name="Age"
                                {...formItemLayout[2]}
                            >
                                <InputNumber disabled={true} style={{width: '100%'}} min={0}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="移动电话"
                                name="Mobile"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "移动电话", 11)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="家庭电话"
                                name="HomeTel"
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="办公电话"
                                name="OfficeTel"
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="身份证号"
                                name="IDNumber"
                                rules={[{
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "身份证号", 18)
                                }]}
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="籍贯"
                                name="BirthPlace"
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="地址"
                                name="Address"
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="状态"
                                name="Status"
                                {...formItemLayout[1]}
                                valuePropName="checked"
                            >
                                <Switch/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="邮编"
                                name="Zip"
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="备注"
                        name="Memo"
                        rules={[{
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "备注", 320)
                        }]}
                    >
                        <TextArea/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({dict, employee}) => ({dict, ...employee}))(Index);
