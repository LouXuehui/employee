import React, {Component} from "react";
import {connect} from "dva";
import {Button, DatePicker, Col, Form, Input, Modal, Row, Select, InputNumber} from "antd";
import {getStringLength} from "common/arr"
import {defaultStatusList, lookList, companyStatusList} from "@/common/domain";
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
        const {dispatch, record, getDataList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : values
            dispatch({
                type: record ? "directories/editDirectories" : "directories/addDirectories",
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
        dispatch({type: "directories/setState", payload: {showEditModal: false, record: ''}});
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
        const {departmentList, CompanyType} = dict

        return (
            <Modal
                title={record ? "编辑公司信息" : "填写公司信息"}
                visible={showEditModal}
                width={800}
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
                        LastTime: record.LastTime ? moment(record.LastTime) : '',
                        RegisterDate: record.RegisterDate ? moment(record.RegisterDate) : '',
                    } : {
                        AllLook: '1',
                        IsSupplier: false,
                        IsVender: false
                    }}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <FormItem
                        label="公司名称"
                        name="FullName"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "公司全称", 200)
                        }]}
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
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="公司简称"
                                name="Name"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "公司简称", 40)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="操作权限"
                                name="AllLook"
                                {...formItemLayout[2]}
                                rules={[{
                                    required: true
                                }]}
                            >
                                <Select>
                                    {
                                        lookList.map(item => {
                                            return <Option key={item.key} value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="是否供应商"
                                name="IsSupplier"
                                {...formItemLayout[1]}
                                rules={[{
                                    required: true
                                }]}
                            >
                                <Select>
                                    {
                                        defaultStatusList.map(item => {
                                            return <Option key={item.key} value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="是否厂家"
                                name="IsVender"
                                {...formItemLayout[2]}
                                rules={[{
                                    required: true
                                }]}
                            >
                                <Select>
                                    {
                                        defaultStatusList.map(item => {
                                            return <Option key={item.key} value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="类别"
                                name="Type"
                                {...formItemLayout[1]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>>
                                    {CompanyType && CompanyType.length > 0
                                        ? CompanyType.map((item) => {
                                            return (
                                                <Option key={item.Code} value={item.Code}>
                                                    {item.Name}
                                                </Option>
                                            );
                                        })
                                        : void 0}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="状态"
                                name="Status"
                                {...formItemLayout[2]}
                            >
                                <Select>
                                    {
                                        companyStatusList.map(item => {
                                            return <Option key={item.key}
                                                           value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="公司地址"
                        name="Address"
                        rules={[{
                            max: 80,
                            message: '超出最大长度'
                        }]}
                    >
                        <Input style={{width: '100%'}}/>
                    </FormItem>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="开户行"
                                name="Bank"
                                {...formItemLayout[1]}
                                rules={[{
                                    max: 64,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="银行账号"
                                name="Account"
                                {...formItemLayout[2]}
                                rules={[{
                                    max: 40,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="法人"
                                name="LegalPerson"
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="公司电话"
                                name="CompanyTel"
                                {...formItemLayout[2]}
                                rules={[{
                                    max: 80,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="联系人"
                                name="RelationPerson"
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="联系电话"
                                name="RelationTel"
                                {...formItemLayout[2]}
                                rules={[{
                                    max: 32,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="电子邮箱"
                                name="Email"
                                {...formItemLayout[1]}
                                rules={[{
                                    max: 32,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="公司传真"
                                name="CompanyFax"
                                {...formItemLayout[2]}
                                rules={[{
                                    max: 32,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="网站"
                                name="Website"
                                {...formItemLayout[1]}
                                rules={[{
                                    max: 64,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="成立时间"
                                name="RegisterDate"
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="注册资金"
                                name="Capital"
                                {...formItemLayout[1]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="所有者"
                                name="Owner"
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="地区"
                                name="Area"
                                {...formItemLayout[1]}
                                rules={[{
                                    max: 32,
                                    message: '超出最大长度'
                                }]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="使用部门"
                                name="Department"
                                {...formItemLayout[2]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {departmentList && departmentList.length > 0
                                        ? departmentList.map((item) => {
                                            return (
                                                <Option key={item.Code} value={item.Code}>
                                                    {item.Name}
                                                </Option>
                                            );
                                        })
                                        : void 0}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="经营范围"
                        name="Range"
                        rules={[{
                            max: 320,
                            message: '超出最大长度'
                        }]}
                    >
                        <Input style={{width: '100%'}}/>
                    </FormItem>
                    <FormItem
                        label="主要业绩"
                        name="Cases"
                        rules={[{
                            max: 320,
                            message: '超出最大长度'
                        }]}>
                        <Input style={{width: '100%'}}/>
                    </FormItem>
                    <FormItem
                        label="公司资质"
                        name="Qualification"
                        rules={[{
                            max: 320,
                            message: '超出最大长度'
                        }]}>
                        <Input style={{width: '100%'}}/>
                    </FormItem>
                    <FormItem
                        label="备注"
                        name="Memo"
                        rules={[{
                            max: 320,
                            message: '超出最大长度'
                        }]}>
                        <TextArea/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({dict, directories}) => ({dict, ...directories}))(Index);
