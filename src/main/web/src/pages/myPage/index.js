/**
 * Created by lxh on 2021-04-28
 */
import React, {Component} from 'react'
import styles from './index.less'
import {Form, Button, Avatar, Modal} from 'antd';
import deepEqual from 'deep-equal'
import {connect} from 'dva'
import FormItem from "../../components/FormItem";
import {genderList, politicsStatus} from "../../common/dictionary";
import moment from 'moment'
import Upload from "../../components/Upload";
import {EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons'

const initState = {
    initValue: {},
    selectedEmp: ''
}
const formLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 18,
    },
};

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initState,
            photoUrl: '',
            fileList: ''
        }
        this.formRef = React.createRef()
    }

    componentWillMount() {
        const {selectedEmp} = this.props.employee
        this.setState({selectedEmp})
        this.getInitValue(this.props)
    }

    componentDidMount() {
        this.props.dispatch({type: 'dept/selectList'})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {selectedEmp} = nextProps.employee
        if (!deepEqual(selectedEmp, this.props.employee.selectedEmp)) {
            this.setState({selectedEmp})
            this.getInitValue(nextProps)
        }
    }

    getInitValue(props) {
        const {selectedEmp} = props.employee
        let initValue = {...selectedEmp, birth: selectedEmp.birth ? moment(selectedEmp.birth) : ''}
        this.setState({initValue})
    }

    updatePhotoUrl(photoUrl) {
        const {dispatch} = this.props
        const {selectedEmp} = this.state
        dispatch({
            type: 'employee/updateById', payload: {
                ...selectedEmp,
                photoUrl
            }
        }).then(() => {
            dispatch({type: 'employee/selectById', payload: {empId: selectedEmp.id}})
            this.setState({uploadVisible: false})
        })
    }

    //展示修改密码弹框
    showPassWordModal() {
        const {dispatch} = this.props
        dispatch({type: 'layout/setState', payload: {pwModalVisible: true}})
    }

    render() {
        const {initValue, fileList, photoUrl, uploadVisible} = this.state
        const {dept, layout} = this.props
        const {dataList} = dept
        const {user} = layout
        const list = [
            {name: 'id', label: '工号', params: {disabled: true}},
            {name: 'name', label: '用户名', params: {disabled: true}},
            {
                name: 'password',
                label: '密码',
                params: {
                    type: 'password',
                    disabled: true,
                    suffix: <a onClick={() => this.showPassWordModal()}>点击修改密码</a>
                },
            },
            {
                name: 'sexCode', label: '性别',
                type: 'select', optionList: genderList,
                params: {defaultValue: '1', disabled: true}
            },
            {name: 'birth', label: '出生日期', type: 'date', params: {disabled: true}},
            {
                name: 'deptId',
                label: '部门',
                type: 'select',
                optionList: dataList && dataList.length ? dataList : [],
                params: {disabled: true}
            },
            {name: 'place', label: '住址', type: 'textArea', params: {disabled: true}},
            {name: 'email', label: 'E-Mail', params: {disabled: true}},
            {name: 'look', label: '政治面貌', type: 'select', optionList: politicsStatus, params: {disabled: true}},
            {name: 'tel', label: '手机号', params: {disabled: true}}
        ]
        console.log(initValue, 'initValue')

        return (
            <div className={styles.myPage}>
                <Form initialValues={{...initValue, password: user.password}}
                      {...formLayout}
                      ref={this.formRef}
                      onFinish={this.onFinish}
                >
                    <Form.Item label={'头像'} name={'photoUrl'}>
                        {
                            initValue.photoUrl ?
                                <Avatar src={initValue.photoUrl} style={{width: 80, height: 80, marginRight: 20}}/> :
                                ''
                        }
                        <a onClick={() => this.setState({uploadVisible: true})}>点击修改头像</a>
                    </Form.Item>
                    {
                        list.map(item => {
                            return <FormItem record={item} form={this.formRef}/>
                        })
                    }
                </Form>
                <Modal title={'修改头像'}
                       visible={uploadVisible}
                       onOk={() => this.updatePhotoUrl(photoUrl)}
                       onCancel={() => this.setState({uploadVisible: false})}>
                    <Upload defaultValue={fileList} changeValue={(photoUrl, fileList) => {
                        this.setState({fileList, photoUrl})
                    }}/>
                </Modal>
            </div>
        )
    }
}

export default connect(({layout, dept, employee, loading}) => ({layout, dept, employee, loading}))(Index)
