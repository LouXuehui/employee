import React, {Component} from "react";
import {connect} from "dva";
import {Button, DatePicker, Form, Input, Modal, Select, Row, Col, InputNumber, Switch} from "antd";
import {getStringLength} from "common/arr"
import moment from 'moment'
import {sexCode} from "../../../common/arr";
import Upload from "../../../components/Upload";

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
        this.state = {
            fileList: null,
            deptId: props.record ? props.record.deptId : ''
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch({type: 'dept/selectList'})
        dispatch({type: 'position/selectList'})
    }

    handleOk() {
        const {dispatch, record, selectList} = this.props;
        this.formRef.current.validateFields().then((values) => {
            let payload = record ? {...record, ...values} : values
            payload.statusCode = payload.statusCode ? '1' : '0'
            dispatch({
                type: `employee/${record ? 'updateById' : 'insert'}`,
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
            } else if (label === '手机号') {
                if (!(/^1[3456789]\d{9}$/.test(value))) {
                    callback("手机号填写有误！")
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
        const {fileList, deptId} = this.state
        const {dispatch, showEditModal, record, position, dept} = this.props
        const {dataList: positionList} = position
        const {dataList: deptList} = dept
        // let info = {
        //     birth: "1990-12-22T16:00:00.000Z",
        //     deptId: "3",
        //     id: "test11",
        //     idCard: "321455199012233450",
        //     name: "白芳净",
        //     positionId: "1",
        //     sexCode: "1",
        //     tel: "17712812345"
        // }
        // const {getFieldValue} = this.formRef.current
        let showPositionList = positionList && positionList.length ? positionList.filter(data => data.deptId === deptId) : []

        const normFile = (e) => {

            if (Array.isArray(e)) {
                return e;
            }

            return e && e.fileList;
        };

        return (
            <Modal
                title={record ? "编辑员工信息" : "新增员工信息"}
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
                        birth: record.birth ? moment(record.birth) : ''
                    } : {
                        Status: true
                    }}
                    validateMessages={{required: '${label}不能为空！'}}
                >
                    <FormItem label={'头像'} name={'photoUrl'}
                              getValueFromEvent={normFile}
                              rules={[{required: true}]}
                              {...formItemLayout[0]}
                    >
                        <Upload defaultValue={
                            fileList ||
                            (
                                record && record.photoUrl ?
                                    [{
                                        uid: '-1',
                                        name: 'image.png',
                                        status: 'done',
                                        url: record.photoUrl,
                                    }] : []
                            )

                        } changeValue={(photoUrl, fileList) => {
                            this.setState({fileList})
                            this.formRef.current.setFieldsValue({photoUrl})
                        }}/>
                    </FormItem>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="工号"
                                name="id"
                                rules={[{required: true}]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}} disabled={!!record}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="姓名"
                                name="name"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "姓名", 100)
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
                                label="身份证号"
                                name="idCard"
                                rules={[{
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "身份证号", 18)
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="性别"
                                name="sexCode"
                                {...formItemLayout[2]}
                            >
                                <Select>
                                    {
                                        sexCode.map(item => {
                                            return <Option value={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem
                                label="科室"
                                name="deptId"
                                rules={[{
                                    required: true,
                                }]}
                                {...formItemLayout[1]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={(deptId) => {
                                            this.setState({deptId})
                                            this.formRef.current.setFieldsValue({positionId: ''})
                                        }}
                                >
                                    {
                                        deptList && deptList.length ? deptList.map(item => {
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        }) : void (0)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="职位"
                                name="positionId"
                                {...formItemLayout[2]}
                            >
                                <Select showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                    {
                                        showPositionList && showPositionList.length ? showPositionList.map(item => {
                                            return <Option value={item.id}
                                                           key={item.id}>{item.name}（{item.level}）</Option>
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
                                name="birth"
                                rules={[{
                                    required: true,
                                }]}
                                {...formItemLayout[1]}
                            >
                                <DatePicker style={{width: '100%'}}
                                            disabledDate={(currentDate) => {
                                                return currentDate > moment()
                                            }}
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="手机号"
                                name="tel"
                                rules={[{
                                    required: true,
                                    validator: (rule, value, callback) => this.validator(rule, value, callback, "手机号", 11)
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
                                name="place"
                                {...formItemLayout[1]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="地址"
                                name="address"
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
                                name="statusCode"
                                {...formItemLayout[1]}
                                valuePropName="checked"
                            >
                                <Switch/>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="E-Mail"
                                name="email"
                                {...formItemLayout[2]}
                            >
                                <Input style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="备注"
                        name="remark"
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

export default connect(({position, dept, employee}) => ({position, dept, ...employee}))(Index);
