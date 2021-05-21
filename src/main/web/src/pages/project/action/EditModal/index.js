import React, {Component} from "react";
import {connect} from "dva";
import {Modal, Form, Input, Button, Select, Col, Row, DatePicker} from "antd";
import moment from 'moment'
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

    //保存数据
    saveData() {
        const {dispatch, form, record, getActionList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let personList = values.PersonList ? values.PersonList : ''
            let list = ''
            if (personList) {
                personList.map((item, index) => {
                    let flag = index > 0 ? " " : ''
                    list = list + flag + item
                })
            }
            values.PersonList = list
            let payload = record ? {...record, ...values} : values
            dispatch({
                type: `action/${record ? 'edit' : 'add'}`,
                payload
            }).then(res => {
                if (res) {
                    this.cancelModal()
                    getActionList()
                }
            })
        })
            .catch((errorInfo) => {
                return;
            });
    }

    //关闭弹窗
    cancelModal() {
        const {dispatch} = this.props;
        dispatch({
            type: "action/setState",
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
        const {dispatch, modalVisible, record, saving, dict} = this.props
        const {projectList, leaderList, actiontype} = dict
        const validateMessages = {required: '${label}不能为空！'}

        return (
            <Modal
                title={"项目活动记录"}
                visible={modalVisible}
                width={700}
                onCancel={() => this.cancelModal()}
                footer={[
                    <Button onClick={() => this.cancelModal()}>取消</Button>,
                    <Button
                        type={"primary"}
                        onClick={() => this.saveData()}
                        loading={saving}
                        disabled={saving}
                    >
                        确定
                    </Button>
                ]}
            >
                <Form
                    {...formItemLayout[0]}
                    ref={this.formRef}
                    initialValues={record ? {
                        ...record,
                        ActionDate: record.ActionDate ? moment(record.ActionDate) : undefined,
                        ProjectID: record.ProjectID ? JSON.stringify(record.ProjectID) : undefined
                    } : {}}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="项目名称"
                        name="ProjectID"
                        rules={[{required: true}]}>
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
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="活动名称"
                                name="Name"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, '活动名称', 100)
                                }]}
                                {...formItemLayout[1]}
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
                                       }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="活动类型"
                                name="ActionType"
                                rules={[{required: true}]}
                                {...formItemLayout[2]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {
                                        actiontype && actiontype.length ? actiontype.map(item => {
                                            return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                        }) : void (0)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="活动地点"
                                name="ActionPosition"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, '活动地点', 64)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="活动时间"
                                name="ActionDate"
                                rules={[{required: true}]}
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="参加人员"
                        name="PersonList"
                        rules={[{required: true}]}
                    >
                        <Select mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }>
                            {
                                leaderList && leaderList.length ? leaderList.map(item => {
                                    return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="活动概要"
                        name="ActionDescribe"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, '活动概要', 800)
                        }]}>
                        <TextArea/>
                    </Form.Item>
                    <Form.Item
                        label="活动小结"
                        name="Summary"
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, '活动小结', 2000)
                        }]}>
                        <TextArea/>
                    </Form.Item>
                    <Form.Item label="备注" name="Memo"
                               rules={[{
                                   validator: (rule, value, callback) => this.validator(rule, value, callback, '备注', 320)
                               }]}>
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.action))(EditModal);
