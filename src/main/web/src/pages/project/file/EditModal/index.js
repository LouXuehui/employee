import React, {Component} from "react";
import {connect} from "dva";
import {Modal, Form, Input, Button, Select, Switch, DatePicker} from "antd"
import {defaultStatusList} from "@/common/domain";
import moment from 'moment'

const Option = Select.Option
const {TextArea} = Input
const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsArchive: '',
            ExistEntity: '',
            saving: false
        };
        this.formArchiveRef = React.createRef()
    }

    componentDidMount() {
        const {selectedApproval} = this.props;
        this.setState({IsArchive: selectedApproval.IsArchive, ExistEntity: selectedApproval.ExistEntity})
    }

    saveData() {
        const {IsArchive} = this.state
        const {selectedApproval, cancelModal} = this.props;
        let params = {...selectedApproval, IsArchive}
        this.setState({saving: true})
        if (IsArchive) {
            this.formArchiveRef.current
                .validateFields()
                .then((values) => {
                    this.editApproval({...params, ...values})
                })
                .catch((errorInfo) => {
                        return
                    }
                );
        } else {
            if (selectedApproval.IsArchive) {
                this.editApproval({...params, ExistEntity: '', Location: '', ArchiveDate: ''})
            } else {
                this.setState({saving: false})
                cancelModal()
            }
        }
    }

    editApproval(payload) {
        const {dispatch, selectList, cancelModal} = this.props
        dispatch({type: "approval/editApproval", payload}).then(res => {
            if (res) {
                cancelModal()
                selectList()
            }
            this.setState({saving: false})
        })
    }

    render() {
        const {IsArchive, ExistEntity} = this.state
        const {modalVisible, selectedApproval, saving, cancelModal} = this.props
        const validateMessages = {required: '${label}不能为空！'}

        return (
            <Modal
                title={'归档信息'}
                visible={modalVisible}
                width={600}
                onCancel={() => cancelModal()}
                footer={[
                    <Button onClick={() => cancelModal()}>取消</Button>,
                    <Button type="primary" loading={saving} disabled={saving}
                            onClick={() => this.saveData()}>确定</Button>
                ]}
            >
                <Form
                    {...formItemLayout}
                    ref={this.formArchiveRef}
                    initialValues={selectedApproval ? {
                        ...selectedApproval,
                        ArchiveDate: selectedApproval.ArchiveDate ? moment(selectedApproval.ArchiveDate) : ''
                    } : {ExistEntity: 0, ArchiveDate: moment()}}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="是否归档"
                        name="IsArchive"
                        rules={[{required: true}]}
                        valuePropName="checked"
                    >
                        <Switch onChange={(value) => {
                            this.setState({IsArchive: value})
                        }}/>
                    </Form.Item>
                    {
                        IsArchive ?
                            <div>
                                <Form.Item
                                    label="存在实体档案"
                                    name="ExistEntity"
                                    rules={[{required: true}]}>
                                    <Select onChange={(value) => {
                                        this.setState({ExistEntity: value})
                                    }}>
                                        {
                                            defaultStatusList.map(item => {
                                                return <Option value={item.key} key={item.key}>{item.value}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                {
                                    ExistEntity ?
                                        <div>
                                            <Form.Item
                                                label="存放地"
                                                name="Location"
                                                rules={[{required: true}]}>
                                                <Input style={{width: '100%'}} maxLength={100}/>
                                            </Form.Item>
                                        </div> : void (0)
                                }
                                <Form.Item label="归档时间" name="ArchiveDate">
                                    <DatePicker/>
                                </Form.Item>
                                <Form.Item label="存放备注" name="ArchiveMemo">
                                    <TextArea maxLength={320}/>
                                </Form.Item>
                            </div> : void (0)
                    }
                </Form>
            </Modal>
        );
    }
}

export default connect((state) => Object.assign({}, state.approval))(Index)
