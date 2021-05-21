import React, {Component} from "react";
import {connect} from "dva";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select, InputNumber} from "antd";
import FormItem from 'components/FormItem'
import {getStringLength} from "common/arr"

const Option = Select.Option;
const {TextArea} = Input;
//公示方式
const showList = [
    {id: '0', name: '医院官网'},
]
//评标方法
const evaluationList = [
    {id: '0', name: '最低价中标'},
    {id: '1', name: '综合评分'}
]
//开标地点
const addressList = [
    {id: '0', name: '会议室1'},
]

const formItemLayout = [
    {labelCol: {span: 4}, wrapperCol: {span: 19}},
    {labelCol: {span: 8}, wrapperCol: {span: 16}},
    {labelCol: {span: 8}, wrapperCol: {span: 14}},
]

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formRef = React.createRef()
    }

    saveData() {
        const {dispatch, record, cancelModal, getTenderList} = this.props
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : values
            dispatch({type: `tender/${record ? 'editTender' : 'addTender'}`, payload}).then(res => {
                if (res) {
                    cancelModal()
                    getTenderList()
                }
            })
        }).catch((errorInfo) => {
            return;
        });

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
        const {dispatch, tenderVisible, record, saving, cancelModal, dict} = this.props
        const {projectList, TendType} = dict

        return (
            <Modal
                title={record ? "编辑招标项目" : "新增招标项目"}
                visible={tenderVisible}
                width={700}
                onCancel={() => cancelModal()}
                footer={[
                    <Button onClick={() => cancelModal()}>取消</Button>,
                    <Button
                        type={"primary"}
                        onClick={() => this.saveData()}
                        loading={saving}
                        disabled={saving}>
                        确定
                    </Button>
                ]}
            >
                <Form
                    {...formItemLayout[0]}
                    ref={this.formRef}
                    initialValues={record ? {
                        ...record,
                        ProjectID: record.ProjectID ? JSON.stringify(record.ProjectID) : undefined
                    } : {}}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <Form.Item
                        label="项目名称"
                        name="ProjectID"
                        rules={[{required: true, message: "项目名称不能为空!"}]}
                    >
                        <Select showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }>
                            {
                                projectList && projectList.length ? projectList.map(item => {
                                    return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="招标名称"
                        name="Name"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "招标名称", 80)
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
                    </Form.Item>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="招标文号"
                                name="ApprovalNumber"
                                rules={[{
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "招标文号", 20)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="招标类型"
                                name="TenderType"
                                {...formItemLayout[2]}
                                rules={[{required: true, message: "招标说明不能为空!"}]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {TendType && TendType.length > 0
                                        ? TendType.map((item) => {
                                            return (
                                                <Option key={item.Code} value={item.Code}>
                                                    {item.Name}
                                                </Option>
                                            )
                                        })
                                        : void 0}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="公告时间"
                                name="PublicityDate"
                                rules={[{required: true, message: "公告时间不能为空!",},]}
                                {...formItemLayout[1]}
                            >
                                <DatePicker style={{width: "100%"}} format={"YYYY-MM-DD"}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="公示方式"
                                name="PublicityType"
                                {...formItemLayout[2]}
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "公示方式", 80)
                                }]}
                            >
                                <FormItem type={'SelectWrite'}
                                          menuList={showList}
                                          changeValue={(value) => {
                                              this.formRef.current.setFieldsValue({PublicityType: value})
                                          }}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="发布渠道"
                        name="PublicityChannel"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "发布渠道", 100)
                        }]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="评标方法"
                                name="UseRule"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "评标方法", 80)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <FormItem type={'SelectWrite'}
                                          menuList={evaluationList}
                                          changeValue={(value) => {
                                              this.formRef.current.setFieldsValue({UseRule: value})
                                          }}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="预算金额"
                                name="Budget"
                                {...formItemLayout[2]}
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "预算金额", 9)
                                }]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="开标时间"
                                name="TenderDate"
                                rules={[{required: true, message: "开标时间不能为空!",},]}
                                {...formItemLayout[1]}
                            >
                                <DatePicker style={{width: "100%"}} format={"YYYY-MM-DD"}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="开标地点"
                                name="Address"
                                {...formItemLayout[2]}
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "开标地点", 80)
                                }]}
                            >
                                <FormItem type={'SelectWrite'}
                                          menuList={addressList}
                                          changeValue={(value) => {
                                              this.formRef.current.setFieldsValue({Address: value})
                                          }}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="招标说明"
                        name="TenderDescribe"
                        rules={[{
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "招标说明", 320)
                        }]}
                    >
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.tender))(EditModal);
