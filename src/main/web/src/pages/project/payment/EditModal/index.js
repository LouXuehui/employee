import React, {Component} from "react";
import {Modal, Form, Input, Button, Select, Col, Row, Checkbox, InputNumber, DatePicker, notification} from "antd";
import {connect} from 'dva'
import moment from 'moment'
import FormItem from 'components/FormItem'

const Option = Select.Option;
const {TextArea} = Input;
const formItemLayout = [
    {labelCol: {span: 4}, wrapperCol: {span: 19}},
    {labelCol: {span: 8}, wrapperCol: {span: 16}},
    {labelCol: {span: 8}, wrapperCol: {span: 14}},
]
const menuList = [
    {id: '0', name: '首付款'},
    {id: '1', name: '进度款'},
    {id: '2', name: '尾款'},
    {id: '3', name: '全款'}
]

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
    }

    saveData() {
        const {dispatch, selectedPayment, getPaymentList} = this.props
        this.formRef.current
            .validateFields()
            .then((values) => {
                values.IsPay = values.IsPay ? true : false
                let payload = selectedPayment ? {...selectedPayment, ...values} : values
                dispatch({type: 'payment/setState', payload: {saving: true}})
                dispatch({type: `payment/${selectedPayment ? 'edit' : 'add'}`, payload}).then(res => {
                    if (res) {
                        this.cancelModal()
                        getPaymentList()
                    }
                })
            })
            .catch((errorInfo) => {
                return;
            });
    }

    cancelModal() {
        const {dispatch} = this.props
        dispatch({
            type: "payment/setState",
            payload: {payModalVisible: false},
        })
    }

    //切换项目
    changeProject(id) {
        const {dispatch} = this.props
        dispatch({
            type: "contract/getFormProjectList",
            payload: {id},
        }).then(res => {
            const {contract} = this.props
            if (res) {
                const {agreementList} = contract
                this.getAgreement(agreementList)
                this.resetMoney()
            }
        })
    }

    //切换项目或合同时，下面清空
    resetMoney() {
        this.formRef.current.setFieldsValue({PayPercent: '', PayMoney: '', PaySelf: '', payOther: ''})
    }

    //默认合同
    getAgreement(list) {
        let tempList = list ? JSON.parse(JSON.stringify(list)) : []
        let selectedAgreement = ''
        if (tempList.length) {
            selectedAgreement = tempList[0]
            this.formRef.current.setFieldsValue({
                CompanyID: selectedAgreement.CompanyID,
                SignID: selectedAgreement.SignID,
                TotalMoney: selectedAgreement.Money
            })
            if (selectedAgreement.Money) {
                this.formRef.current.setFieldsValue({PayTimes: 1})
            }
            this.setState({selectedAgreement})
        } else {
            this.formRef.current.setFieldsValue({
                CompanyID: '',
                SignID: '',
                TotalMoney: ''
            })
        }
    }

    //改变金额比例
    changeForm(value, name) {
        let totalMoney = this.formRef.current.getFieldValue('TotalMoney')
        let params = {}
        if (totalMoney) {
            switch (name) {
                case 'PayPercent':
                    let PayMoney = parseFloat(totalMoney * value / 100)
                    params = {PayMoney}
                    break
                case 'PayMoney':
                    let PayPercent = parseFloat(value / totalMoney * 100).toFixed(2)
                    params = {PayPercent}
                    break
                case 'PaySelf':
                case 'PayOther':
                    let currentPayMoney = this.formRef.current.getFieldValue('PayMoney')
                    if (currentPayMoney) {
                        if (parseFloat(value - currentPayMoney) > 0) {
                            notification.warning({
                                message: `${name === 'PaySelf' ? '自筹' : '其他支付'}金额不能大于本次支付金额！`,
                                // description: `${title}成功!`,
                            })
                        } else {
                            let money = parseFloat(currentPayMoney - value)
                            params = {[`${name === 'PaySelf' ? 'PayOther' : 'PaySelf'}`]: money}
                        }
                    }

                    break
                default:
                    break
            }
            this.formRef.current.setFieldsValue(params)
        }
    }

    render() {
        const {payModalVisible, selectedPayment, saving, approval, dict, contract} = this.props
        const {companyList, projectList} = dict
        const {agreementList} = contract

        return (
            <Modal
                title={"合同付款"}
                visible={payModalVisible}
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
                    initialValues={selectedPayment ? {
                        ...selectedPayment,
                        ProjectID: selectedPayment.ProjectID.toString(),
                        ExpectDate: selectedPayment.ExpectDate ? moment(selectedPayment.ExpectDate) : '',
                        FactDate: selectedPayment.FactDate ? moment(selectedPayment.FactDate) : ''
                    } : {}}>
                    <Form.Item
                        label="项目名称"
                        name="ProjectID"
                        rules={[{required: true, message: "请选择项目!"}]}
                    >
                        <Select onChange={(value) => this.changeProject(value)}>
                            {
                                projectList && projectList.length ? projectList.map(item => {
                                    return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="合同名称"
                        name="SignID"
                    >
                        <Select showSearch
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={() => this.resetMoney()}
                        >
                            {
                                agreementList && agreementList.length ? agreementList.map(item => {
                                    return <Option value={item.SignID} key={item.SignID}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="公司名称"
                                name="CompanyID"
                                rules={[{required: true, message: "招标公司不能为空!"}]}
                                {...formItemLayout[1]}
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
                                name="TotalMoney"
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}} min={0} step={0.01} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="付款次数"
                                name="PayTimes"
                                {...formItemLayout[1]}
                            >
                                <Select disabled>
                                    {
                                        [1].map(item => {
                                            return <Option value={item} key={item}>第{item}次付款</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="已付金额"
                                name="AmountPaid"
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}} min={0} step={0.01} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="付款名称"
                                name="Name"
                                {...formItemLayout[1]}
                                rules={[{required: true, message: "付款名称不能为空!"}]}
                            >
                                <FormItem type={'SelectWrite'}
                                          menuList={menuList}
                                          changeValue={(value) => {
                                              this.formRef.current.setFieldsValue({Name: value})
                                          }}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="是否已付"
                                name="IsPay"
                                valuePropName="checked"
                                {...formItemLayout[2]}
                            >
                                <Checkbox>打勾为已付</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="付款比例"
                                name="PayPercent"
                                {...formItemLayout[1]}
                            >
                                <InputNumber style={{width: '100%'}}
                                             min={0}
                                             formatter={value => `${value}%`}
                                             parser={value => value.replace('%', '')}
                                             onChange={(value) => this.changeForm(value, 'PayPercent')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="付款金额"
                                name="PayMoney"
                                rules={[
                                    {
                                        required: true,
                                        message: "付款金额不能为空!",
                                    },
                                ]}
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}}
                                             step={0.01}
                                             min={0}
                                             onChange={(value) => this.changeForm(value, 'PayMoney')}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="自筹金额"
                                name="PaySelf"
                                {...formItemLayout[1]}
                            >
                                <InputNumber style={{width: '100%'}}
                                             step={0.01}
                                             min={0}
                                             onChange={(value) => this.changeForm(value, 'PaySelf')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="其他支付"
                                name="PayOther"
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}}
                                             step={0.01}
                                             min={0}
                                             onChange={(value) => this.changeForm(value, 'PayOther')}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="支付途径"
                        name="OtherName"
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="付款依据"
                        name="PayBasis"
                        rules={[
                            {
                                required: true,
                                message: "付款依据不能为空!",
                            },
                        ]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="应付时间"
                                name="ExpectDate"
                                {...formItemLayout[1]}>
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="实付时间"
                                name="FactDate"
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="备注"
                        name="Memo"
                        rules={[
                            {
                                max: 320,
                                message: "字符长度超出最大限制!",
                            },
                        ]}
                    >
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect(({dict, approval, contract, payment}) => ({dict, approval, contract, ...payment}))(
    EditModal
);

