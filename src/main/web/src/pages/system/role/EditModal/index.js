import React, {Component} from "react"
import {connect} from "dva"
import {Modal, Form, Input, Button} from "antd"
import {getStringLength} from "common/arr"
import {menuList} from "common/menu"
import {searchByPy} from "common/pinYinUtil"

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
        const {dispatch, selectedRole, loadData} = this.props
        this.formRef.current.validateFields().then((values) => {
            values.page = JSON.stringify(values.page)
            let payload = selectedRole ? {...selectedRole, ...values} : values
            dispatch({type: 'role/setState', payload: {saving: true}})
            dispatch({type: `role/${selectedRole ? 'edit' : 'add'}`, payload}).then(res => {
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
            type: "role/setState",
            payload: {modalVisible: false, selectedRole: null}
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
        const {modalVisible, selectedRole, saving} = this.props
        const validateMessages = {required: '${label}不能为空！'}
        const tProps = {
            allowClear: true,
            treeData: menuList,
            treeCheckable: true,
            filterTreeNode: (inputValue, treeNode) => {
                return searchByPy(inputValue, treeNode.title)
            },
            placeholder: '请选择',
            style: {
                width: '100%',
            }
        };

        return (
            <Modal
                title={`${selectedRole ? '编辑' : '新增'}角色`}
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
                    initialValues={selectedRole ? selectedRole : {}}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="角色名称"
                        name="Name"
                        rules={[{required: true}]}>
                        <Input style={{width:'100%'}}/>
                    </Form.Item>
                    <Form.Item
                        label="模块"
                        name="ModelNo"
                        rules={[{required: true}]}
                    >
                        <Input style={{width:'100%'}}/>
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

export default connect(({role}) => ({...role}))(EditModal)
