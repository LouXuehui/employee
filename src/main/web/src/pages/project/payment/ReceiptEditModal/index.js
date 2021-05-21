import React, {Component} from "react";
import {Modal, Form, Input, Button, Select, Col, Row, InputNumber, DatePicker} from "antd";
import {connect} from 'dva'
import FormItem from 'components/FormItem'
import moment from 'moment'

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
        this.formReceiptRef = React.createRef();
    }

    saveData() {
        const {dispatch, selectedReceipt, selectedPayment} = this.props
        this.formReceiptRef.current
            .validateFields()
            .then((values) => {
                dispatch({type: 'payment/setState', payload: {receiptSaving: true}})
                if (selectedReceipt) {
                    dispatch({
                        type: 'payment/editReceipt',
                        payload: {...selectedReceipt, ...values}
                    }).then(res => {
                        if (res) {
                            this.cancelModal()
                        }
                    })
                } else {
                    dispatch({
                        type: 'payment/addReceipt',
                        payload: {...values, PayID: selectedPayment.PayID,}
                    }).then(res => {
                        if (res) {
                            this.cancelModal()
                        }
                    })
                }
            })
            .catch((errorInfo) => {
                return;
            });
    }

    cancelModal() {
        const {dispatch} = this.props
        dispatch({
            type: "payment/setState",
            payload: {receiptModalVisible: false, selectedReceipt: ""},
        })
    }

    render() {
        const {receiptModalVisible, selectedPayment, selectedReceipt, receiptSaving, approval, dict, contract} = this.props
        const {approvalList} = approval
        const {companyList} = dict
        const {agreementList} = contract

        return (
            <Modal
                title={"发票登记"}
                visible={receiptModalVisible}
                width={700}
                onCancel={() => this.cancelModal()}
                footer={[
                    <Button onClick={() => this.cancelModal()}>取消</Button>,
                    <Button
                        type={"primary"}
                        onClick={() => this.saveData()}
                        loading={receiptSaving}
                        disabled={receiptSaving}
                    >
                        确定
                    </Button>
                ]}
            >
                <Form
                    {...formItemLayout[0]}
                    ref={this.formReceiptRef}
                    initialValues={selectedReceipt ? {
                        ...selectedReceipt,
                        ReceiptDate: selectedReceipt.ReceiptDate ? moment(selectedReceipt.ReceiptDate) : null
                    } : {
                        SignID: selectedPayment.SignID,
                        CompanyID: selectedPayment.CompanyID,
                        ProjectID: selectedPayment.ProjectID,
                    }}>
                    <Form.Item
                        label="合同名称"
                        name="SignID"
                    >
                        <Select disabled>
                            {
                                agreementList && agreementList.length ? agreementList.map(item => {
                                    return <Option value={item.SignID} key={item.SignID}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="项目名称"
                        name="ProjectID"
                        rules={[{required: true, message: "请选择项目!"}]}
                    >
                        <Select disabled>
                            {
                                approvalList && approvalList.length ? approvalList.map(item => {
                                    return <Option value={item.ID} key={item.ID}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="开票公司"
                        name="CompanyID"
                        rules={[{required: true, message: "开票公司不能为空!"}]}
                    >
                        <Select disabled>
                            {
                                companyList && companyList.length ? companyList.map(item => {
                                    return <Option value={item.ID} key={item.ID}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="发票名称"
                                name="Name"
                                rules={[{required: true, message: "发票名称不能为空!"}]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="发票金额"
                                name="ReceiptMoney"
                                rules={[{required: true, message: "发票金额不能为空!"}]}
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="发票号码"
                                name="ReceiptNo"
                                rules={[{required: true, message: "发票号码不能为空!"}]}
                                {...formItemLayout[1]}
                            >
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="发票日期"
                                name="ReceiptDate"
                                rules={[{required: true, message: "发票日期不能为空!"}]}
                                {...formItemLayout[2]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="发票类型"
                                name="ReceiptType"
                                {...formItemLayout[1]}
                                rules={[{required: true, message: "发票类型不能为空!"}]}
                            >
                                {/*<Select>*/}
                                {/*    <Option value={'0'}>普通发票</Option>*/}
                                {/*    <Option value={'1'}>增值发票</Option>*/}
                                {/*</Select>*/}
                                <FormItem type={'SelectWrite'}
                                          menuList={[
                                              {id: '0', name: '普通发票'},
                                              {id: '1', name: '增值发票'},
                                          ]}
                                          changeValue={(value) => {
                                              this.formReceiptRef.current.setFieldsValue({ReceiptType: value})
                                          }}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="发票状态"
                                name="ReceiptStatus"
                                rules={[{required: true, message: "发票状态不能为空!"}]}
                                {...formItemLayout[2]}
                            >
                                {/*<Select>*/}
                                {/*    <Option value={'0'}>正常</Option>*/}
                                {/*</Select>*/}
                                <FormItem type={'SelectWrite'}
                                          menuList={[
                                              {id: '0', name: '正常'},
                                          ]}
                                          changeValue={(value) => {
                                              this.formReceiptRef.current.setFieldsValue({ReceiptStatus: value})
                                          }}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="备注"
                        name="Memo">
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

