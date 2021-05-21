import React, {Component} from 'react'
import styles from './index.less'
import {Input, Checkbox, Form, Button} from 'antd'
import {LockOutlined, UserOutlined} from '@ant-design/icons'
import axios from 'axios'
import {getCookie, setCookie, delCookie} from '@/common/arr'
import router from 'umi/router'
import {loginTitle} from '@/common/domain'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: '',
            logged: false, //已登录成功
            roleId: '0',
            initialValues: {
                username: getCookie('username'),
                password: getCookie('password'),
                remember: getCookie('remember'), //是否记住密码
            }
        }
    }

    //登录
    login(values) {
        window.sessionStorage.clear()
        const {roleId} = this.state
        const {username, password, remember} = values
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('roleId', roleId)
        console.log(formData, 'formData')
        axios.post(`api/login`, formData).then(res => {
            const {data} = res
            console.log(data, 'data')
            if (data && data.code === 1) {
                router.push('/')
                window.location.reload()
                window.sessionStorage.setItem('username', username)
                window.sessionStorage.setItem('password', password)
                window.sessionStorage.setItem('user', JSON.stringify(data.payload.user))
                window.sessionStorage.setItem('employee', JSON.stringify(data.payload.employee))
                if (remember) {
                    setCookie('username', username, 7) //保存帐号到cookie，有效期7天
                    setCookie('password', password, 7) //保存密码到cookie，有效期7天
                    setCookie('remember', true, 7) //保存记住密码到cookie，有效期7天
                } else {
                    delCookie('username')
                    delCookie('password')
                    delCookie('remember')
                }
            } else {
                this.setState({
                    error: data.tips || '用户名或密码错误！'
                })
            }

        })
    }

    render() {
        const {error, roleId, initialValues} = this.state
        const tabs = [
            {id: '0', title: '员工'},
            {id: '1', title: '管理员'},
        ]

        return (
            <div className={styles.loginBody}>
                <div className={styles.title}>欢迎登录{loginTitle}</div>
                <div className={styles.content}>
                    <div className={styles.tabs}>
                        {
                            tabs.map(tab =>
                                <div className={tab.id === roleId ? styles.selectedTab : styles.tab}
                                     onClick={() => this.setState({roleId: tab.id})}>
                                    {tab.title}
                                </div>)
                        }
                    </div>
                    <div className={styles.form}>
                        <Form
                            name="normal_login"
                            initialValues={initialValues}
                            onValuesChange={() => this.setState({error: ''})}
                            onFinish={(values) => this.login(values)}
                        >
                            <Form.Item
                                name="username"
                                rules={[{required: true, message: '请输入用户名!'}]}
                            >
                                <Input prefix={<UserOutlined/>} placeholder="用户名"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{required: true, message: '请输入密码!'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住密码</Checkbox>
                                </Form.Item>
                                <Form.Item name="error" noStyle>
                                    <span style={{color: '#FF0000'}}>{error}</span>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Index
