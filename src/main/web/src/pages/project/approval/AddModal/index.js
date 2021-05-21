import React, {Component} from "react";
import {connect} from "dva";
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select, InputNumber} from "antd";
import {getStringLength} from "common/arr"

const {Search} = Input;
const {TextArea} = Input;
const {MonthPicker, RangePicker} = DatePicker;
const {Option} = Select;
const dateFormat = "YYYY-MM-DD";
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
        const {dispatch, form, record, selectList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : {...values, IsArchive: false}
            dispatch({
                type: `approval/${record ? 'editApproval' : 'addApproval'}`,
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
        dispatch({type: "approval/setState", payload: {showAddModal: false, record: ''}});
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
        const {dispatch, visible, record, dict} = this.props;
        const {ProjectYear, leaderList, ProjectClass, BuyType, statusList, departmentList} = dict

        return (
            <Modal
                title={record ? "编辑项目立项" : "新增项目立项"}
                visible={visible}
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
                    initialValues={record ? record : {Status: '01'}}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="立项年度"
                                name="ProjectYear"
                                rules={[{required: true, message: `立项年度不能为空`}]}
                                {...formItemLayout[1]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {ProjectYear && ProjectYear.length > 0
                                        ? ProjectYear.map((item) => {
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
                                <Select disabled>
                                    <Option key={'01'} value={'01'}>
                                        立项
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="项目名称"
                        name="Name"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "项目名称", 100)
                        }]}
                    >
                        <Input style={{width: '100%'}}
                               onBlur={(e) => {
                                   let value = e.target.value
                                   let WbCode, PyCode
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
                                label="项目负责人"
                                name="Leader"
                                rules={[{required: true, message: `项目负责人不能为空`}]}
                                {...formItemLayout[1]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
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
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="协助负责人"
                                name="Assistor"
                                rules={[{required: true, message: `协助负责人不能为空`}]}
                                {...formItemLayout[2]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
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
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="项目类别"
                                name="Class"
                                rules={[{required: true, message: `项目类别不能为空`}]}
                                {...formItemLayout[1]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>>
                                    {ProjectClass && ProjectClass.length > 0
                                        ? ProjectClass.map((item) => {
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
                                label="购买方式"
                                name="BuyType"
                                rules={[{required: true, message: `购买方式不能为空`}]}
                                {...formItemLayout[2]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {BuyType && BuyType.length > 0
                                        ? BuyType.map((item) => {
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
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="申请部门"
                                name="ApplyDept"
                                rules={[{required: true, message: `申请部门不能为空`}]}
                                {...formItemLayout[1]}
                            >
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
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
                        <Col span={12}>
                            <FormItem
                                label="立项时间"
                                name="ApprovalDate"
                                rules={[{required: true, message: `立项时间不能为空`}]}
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: "100%"}} format={"YYYY-MM-DD"}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="预算金额"
                                name="Budget"
                                rules={[{required: true, message: `预算金额不能为空`}]}
                                {...formItemLayout[1]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="预计完成时间"
                                name="ExpectDate"
                                {...formItemLayout[2]}
                                rules={[{required: true, message: `预计完成时间不能为空`}]}
                            >
                                <DatePicker style={{width: "100%"}} format={"YYYY-MM-DD"}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="拼音简码"
                                name="PyCode"
                                rules={[{
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "拼音简码", 10)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="五笔码"
                                name="WbCode"
                                rules={[{
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "五笔码", 10)
                                }]}
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="项目备注"
                        name="Memo"
                        rules={[{
                            validator: (rule, value, callback) => this.validator(rule, value, callback, "项目备注", 320)
                        }]}
                    >
                        <TextArea/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({dict, approval}) => ({dict, ...approval}))(Index);
