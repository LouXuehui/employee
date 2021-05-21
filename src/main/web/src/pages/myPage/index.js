/**
 * Created by lxh on 2021-04-28
 */
import React, {Component} from 'react'
import styles from './index.less'
import {Form, Button} from 'antd';
import deepEqual from 'deep-equal'
import {connect} from 'dva'
import FormItem from "../../components/FormItem";
import {genderList, politicsStatus} from "../../common/dictionary";
import moment from 'moment'
import Upload from "../../components/Upload";

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
        const {selectedEmp} = this.props.layout
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
        }
    }

    getInitValue(props) {
        const {selectedEmp} = props.employee
        let initValue = {...selectedEmp, birth: selectedEmp.birth ? moment(selectedEmp.birth) : ''}
        this.setState({initValue})
    }

    onFinish = (values) => {
        const {employee, dispatch} = this.props
        const {selectedEmp} = employee
        dispatch({
            type: 'employee/updateById', payload: {
                ...selectedEmp,
                ...values,
                birth: moment(values.birth).format('YYYY-MM-DD')
            }
        }).then(() => {
            dispatch({type: 'employee/selectById', payload: {empId: selectedEmp.id}})
        })
    };

    resetForm() {
        const {initValue} = this.state
        this.formRef.current.resetFields();
        this.formRef.current.setFieldsValue(initValue);
    }

    render() {
        const {initValue, fileList} = this.state
        const {dept} = this.props
        const {dataList} = dept
        const list = [
            {name: 'id', label: '工号', params: {disabled: true}},
            {name: 'name', label: '用户名',},
            {
                name: 'sexCode', label: '性别',
                type: 'select', optionList: genderList,
                params: {defaultValue: '1'}
            },
            {name: 'birth', label: '出生日期', type: 'date'},
            {name: 'deptId', label: '部门', type: 'select', optionList: dataList && dataList.length ? dataList : []},
            {name: 'place', label: '住址', type: 'textArea'},
            {name: 'email', label: 'E-Mail',},
            {name: 'look', label: '政治面貌', type: 'select', optionList: politicsStatus},
            {name: 'tel', label: '手机号',}
        ]

        return (
            <div className={styles.myPage}>
                <Form initialValues={initValue}
                      {...formLayout}
                      ref={this.formRef}
                      onFinish={this.onFinish}
                >
                    <Form.Item label={'头像'} name={'photoUrl'}>
                        <Upload defaultValue={
                            fileList || [{
                                uid: '-1',
                                name: 'image.png',
                                status: 'done',
                                url: initValue.photoUrl,
                            }]
                        } changeValue={(photoUrl, fileList) => {
                            this.setState({fileList})
                            this.formRef.current.setFieldsValue({photoUrl})
                        }}/>
                    </Form.Item>
                    {
                        list.map(item => {
                            return <FormItem record={item} form={this.formRef}/>
                        })
                    }
                    <Form.Item>
                        <div className={styles.btn}>
                            <Button style={{marginRight: 10}} onClick={() => this.resetForm()}>取消</Button>
                            <Button type={'primary'} htmlType="submit">提交</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default connect(({layout, dept, employee, loading}) => ({layout, dept, employee, loading}))(Index)
