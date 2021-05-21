import React, {Component} from "react";
import {connect} from "dva";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select, InputNumber} from "antd";
import {getStringLength} from "common/arr"

const Option = Select.Option;
const {TextArea} = Input;
const formItemLayout = [
    {labelCol: {span: 4}, wrapperCol: {span: 19}},
    {labelCol: {span: 8}, wrapperCol: {span: 16}},
    {labelCol: {span: 8}, wrapperCol: {span: 14}},
]

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formRef = React.createRef();
    }

    saveData() {
        const {dispatch, form, record, selectList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : values
            dispatch({
                type: `contract/${record ? 'editContract' : 'addContract'}`,
                payload
            }).then(res => {
                if (res) {
                    this.cancelModal()
                    selectList()
                }
            })
        })
            .catch((errorInfo) => {
                return;
            });
    }

    cancelModal() {
        const {dispatch} = this.props;
        dispatch({
            type: "contract/setState",
            payload: {modalVisible: false, record: ""},
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
        const {dispatch, modalVisible, record, saving, dict} = this.props;
        const {projectList, leaderList, companyList, AgreementType} = dict

        return (
            <Modal
                title={"合同信息录入"}
                visible={modalVisible}
                width={800}
                onCancel={() => this.cancelModal()}
                footer={[
                    <Button onClick={() => this.cancelModal()}>取消</Button>,
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
                    initialValues={record ? {...record, ProjectID: record.ProjectID.toString()} : {}}
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
                        label="合同名称"
                        name="Name"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "合同名称", 80)
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
                                label="合同编号"
                                name="DocNo"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "合同编号", 32)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="签订时间"
                                name="SignDate"
                                rules={[{required: true, message: "签订时间不能为空!"}]}
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="签订方"
                                name="CompanyID"
                                {...formItemLayout[1]}
                                rules={[{required: true, message: "签订方不能为空!"}]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {
                                        companyList && companyList.length ? companyList.map(item => {
                                            return <Option value={item.ID} key={item.ID}>{item.Name}</Option>
                                        }) : void (0)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="总金额"
                                name="Money"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "总金额", 9)
                                }]}
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="合同类别"
                                name="Class"
                                {...formItemLayout[1]}
                                rules={[{required: true, message: "合同类别不能为空!"}]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {AgreementType && AgreementType.length > 0
                                        ? AgreementType.map((item) => {
                                            return (
                                                <Option key={item.Code} value={item.Name}>
                                                    {item.Name}
                                                </Option>
                                            )
                                        })
                                        : void 0}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="合同效期"
                                name="Validity"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "合同效期", 32)
                                }]}
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="开始时间"
                                name="StartDate"
                                rules={[{required: true, message: "开始时间不能为空!"}]}
                                {...formItemLayout[1]}
                            >
                                <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="结束时间"
                                name="EndDate"
                                rules={[{required: true, message: "结束时间不能为空!"}]}
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="签订内容概要"
                        name="SignDescribe"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "签订内容概要", 640)
                        }]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Form.Item
                        label="备注"
                        name="Memo"
                        rules={[{
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "备注", 320)
                        }]}
                    >
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.contract))(EditModal);
