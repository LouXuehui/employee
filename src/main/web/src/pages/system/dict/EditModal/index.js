import React, {Component} from "react"
import {connect} from "dva"
import {Modal, Form, Input, Button, Switch} from "antd"
import {getStringLength} from "common/arr"

const {TextArea} = Input;
const formItemLayout = [
    {labelCol: {span: 4}, wrapperCol: {span: 19}},
    {labelCol: {span: 8}, wrapperCol: {span: 16}},
    {labelCol: {span: 8}, wrapperCol: {span: 14}},
]

class EditModal extends Component {
    constructor(props) {
        super(props)
        this.formRef = React.createRef()
    }

    //保存数据
    saveData() {
        const {dispatch, selectedDict, selectedCode, loadData} = this.props
        this.formRef.current.validateFields().then((values) => {
            let payload = selectedCode ? {...selectedCode, ...values} : {SectionCode: selectedDict.Code, ...values}
            dispatch({type: 'dict/setState', payload: {saving: true}})
            dispatch({type: `dict/${selectedCode ? 'edit' : 'add'}`, payload}).then(res => {
                if (res) {
                    this.cancelModal()
                    loadData()
                }
            })
        }).catch((errorInfo) => {
            return
        })
    }

    //关闭弹窗
    cancelModal() {
        const {dispatch} = this.props
        dispatch({
            type: "dict/setState",
            payload: {modalVisible: false, selectedCode: null}
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
        const {modalVisible, selectedCode, saving} = this.props
        const validateMessages = {required: '${label}不能为空！'}

        return (
            <Modal
                title={`${selectedCode ? '编辑' : '新增'}`}
                visible={modalVisible}
                width={600}
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
                    initialValues={selectedCode ? selectedCode : {IsUse: true}}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="代码"
                        name="Code"
                        rules={[{required: true}]}>
                        <Input style={{width: '100%'}} disabled={selectedCode}/>
                    </Form.Item>
                    <Form.Item
                        label="名称"
                        name="Name"
                        rules={[{required: true}]}
                    >
                        <Input style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="是否启用"
                        name="IsUse"
                        valuePropName="checked"
                    >
                        <Switch/>
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

export default connect(({dict}) => ({...dict}))(EditModal)
