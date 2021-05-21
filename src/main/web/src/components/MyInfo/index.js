/**
 * Created by lxh on 2021-04-28
 */
import React, {Component} from 'react'
import styles from './index.less'
import {Form, Input, Button, Select, Switch} from 'antd';
import deepEqual from 'deep-equal'
import {connect} from 'dva'

const {Option} = Select
const FormItem = Form.Item

const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18}
}

class Index extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {form, onFinish, layout} = this.props
        return (
            <Form {...layout} ref={form} onFinish={onFinish}>
                <FormItem
                    label="工号"
                    name="EmployeeNo"
                    rules={[{required: true}]}
                    {...formItemLayout}
                >
                    <Input style={{width: '100%'}} disabled={true}/>
                </FormItem>
                <FormItem
                    label="登录名"
                    name="UserCode"
                    rules={[{
                        required: true,
                        validator: (rule, value, callback) => this.validator(rule, value, callback, "登录名", 100)
                    }]}
                >
                    <Input style={{width: '100%'}}/>
                </FormItem>
                <FormItem
                    label="密码"
                    name="UserPass"
                    rules={[{required: true}]}
                    {...formItemLayout}
                >
                    <Input.Password/>
                </FormItem>
                {/*<FormItem*/}
                {/*    label="是否使用"*/}
                {/*    name="IsUse"*/}
                {/*    {...formItemLayout}*/}
                {/*    valuePropName="checked"*/}
                {/*>*/}
                {/*    <Switch/>*/}
                {/*</FormItem>*/}
            </Form>
        )
    }
}

export default Index
