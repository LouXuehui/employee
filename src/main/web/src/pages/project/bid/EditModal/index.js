import React, {Component} from "react";
import {Modal, Form, Input, Button, Select, Col, Row, Checkbox, InputNumber} from "antd";
import {connect} from 'dva'

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
        const {dispatch, selectedBid, selectedTender} = this.props;
        this.formRef.current
            .validateFields()
            .then((values) => {
                values.IsWin = values.IsWin ? true : false
                dispatch({type: 'bid/setState', payload: {childModalVisible: false, bidSaving: true}})
                if (selectedBid) {
                    dispatch({type: 'bid/edit', payload: {...selectedBid, ...values}}).then(res => {
                        if (res) {
                            this.cancelModal()
                        }
                    })
                } else {
                    values.ProjectID = selectedTender ? selectedTender.ProjectID : ''
                    dispatch({type: 'bid/add', payload: values}).then(res => {
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
            type: "bid/setState",
            payload: {childModalVisible: false, selectedBid: ""},
        })
    }

    render() {
        const {dict, tender, childModalVisible, selectedBid, bidSaving, selectedTender} = this.props;
        const {companyList} = dict
        const {dataList} = tender

        return (
            <Modal
                title={"招标信息登记"}
                visible={childModalVisible}
                width={700}
                onCancel={() => this.cancelModal()}
                footer={[
                    <Button onClick={() => this.cancelModal()}>取消</Button>,
                    <Button
                        type={"primary"}
                        onClick={() => this.saveData()}
                        loading={bidSaving}
                        disabled={bidSaving}
                    >
                        确定
                    </Button>
                ]}
            >
                <Form
                    {...formItemLayout[0]}
                    ref={this.formRef}
                    initialValues={selectedBid ? {
                        ...selectedBid, TenderID: selectedTender.TenderID
                    } : {TenderID: selectedTender.TenderID}}
                >
                    <Form.Item
                        label="招标名称"
                        name="TenderID"
                    >
                        <Select disabled={true}>
                            {
                                dataList && dataList.length ? dataList.map(item => {
                                    return <Option value={item.TenderID} key={item.TenderID}>{item.Name}</Option>
                                }) : void (0)
                            }
                        </Select>
                    </Form.Item>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="招标公司"
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
                                label="是否中标"
                                name="IsWin"
                                valuePropName="checked"
                                {...formItemLayout[2]}
                            >
                                <Checkbox>打勾为中标人</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <Form.Item
                                label="投标价格"
                                name="FirstMoney"
                                rules={[
                                    {
                                        required: true,
                                        message: "投标价格不能为空!",
                                    },
                                ]}
                                {...formItemLayout[1]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="最后价格"
                                name="LastMoney"
                                rules={[
                                    {
                                        required: true,
                                        message: "最后价格不能为空!",
                                    },
                                ]}
                                {...formItemLayout[2]}
                            >
                                <InputNumber style={{width: '100%'}} min={0}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="投标纪要过程"
                        name="BidDescribe"
                    >
                        <TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect(({dict, tender, bid}) => ({dict, tender, ...bid}))(
    EditModal
);

