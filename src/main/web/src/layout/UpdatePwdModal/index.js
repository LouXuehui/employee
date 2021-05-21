import React, {Component} from 'react'
import styles from './style.less'
import {Button, Form, Input, Modal} from 'antd'
import {connect} from "dva";

const FormItem = Form.Item;

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassWd: ''
        }
        this.formRef = React.createRef()
    }

    updatePwd(e) {
        e.preventDefault()
        const {user, dispatch} = this.props
        this.formRef.current.validateFields().then((values) => {
            dispatch({
                type: 'layout/updatePassWord',
                payload: {usercode: user.userId, oldpass: values.oldPwd, newpass: values.password}
            })
        })
    }

    checkNewPwd(value, callback, lable) {
        const {getFieldValue} = this.formRef.current
        let reg = /^\d{6,}$/
        if (value) {
            if (lable === "password") {
                if (getFieldValue('oldPwd') === value) {
                    callback('新密码不能与原密码相同')
                } else {
                    callback()
                }
            } else if (value !== getFieldValue('password')) {
                callback('输入的两个密码不一致！')
            } else {
                callback()
            }
        } else {
            callback('不能为空！')
        }
    }

    //关闭修改密码弹框
    changeVisible() {
        const {dispatch} = this.props
        dispatch({type: 'layout/setState', payload: {pwModalVisible: false}})
    }

    render() {
        const {pwModalVisible} = this.props
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        }
        return (
            <Modal className={styles.updatePwd}
                   title="修改密码"
                   visible={pwModalVisible}
                   footer={[
                       <Button onClick={() => this.changeVisible()}>取消</Button>,
                       <Button type="primary" onClick={(e) => this.updatePwd(e)}>确定</Button>
                   ]}
                   onCancel={() => this.changeVisible()}>
                <div className={styles.body}>
                    <Form
                        ref={this.formRef}
                        validateMessages={{required: '${label}不能为空！'}}
                    >
                        <FormItem
                            label="原密码"
                            name="oldPwd"
                            rules={[{
                                required: true,
                                message: '不能为空！',
                            }]}
                            {...formItemLayout}
                        >
                            <Input type="password"/>
                        </FormItem>
                        <FormItem
                            label="新密码"
                            name="password"
                            rules={[{
                                required: true,
                                validator: (rule, value, callback) => this.checkNewPwd(value, callback, "password", 10)
                            }]}
                            {...formItemLayout}
                        >
                            <Input type="password"/>
                        </FormItem>
                        <FormItem
                            label="确认密码"
                            name="confirmPwd"
                            rules={[{
                                required: true,
                                validator: (rule, value, callback) => this.checkNewPwd(value, callback, "confirmPwd", 10)
                            }]}
                            {...formItemLayout}
                        >
                            <Input type="password"/>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
}

export default connect(({layout}) => ({...layout}))(Index);
