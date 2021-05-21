import React, {Component} from "react";
import {connect} from "dva";
import {Modal, Form, Input, Button, Select, Col, Row, DatePicker, Upload, notification} from "antd"
import {InboxOutlined} from '@ant-design/icons'
import moment from 'moment'
import {getStringLength} from "common/arr"
import FormItem from 'components/FormItem'
import {domain} from "common/domain"

const Option = Select.Option
const {TextArea} = Input
const formItemLayout = [
    {labelCol: {span: 4}, wrapperCol: {span: 19}},
    {labelCol: {span: 8}, wrapperCol: {span: 16}},
    {labelCol: {span: 8}, wrapperCol: {span: 14}},
]

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentList: []
        };
        this.formFileRef = React.createRef()
    }

    saveData() {
        const {documentList} = this.state
        const {dispatch, record, selectList, selectedProject, cancelModal, ProjectFile} = this.props;
        let tempList = []
        this.formFileRef.current
            .validateFields()
            .then((values) => {
                    if (record && !selectedProject) {
                        dispatch({
                            type: `enclosure/edit`,
                            payload: {...record, ...values}
                        }).then(res => {
                            cancelModal()
                            selectList ? selectList() : void (0)
                        })
                    } else {
                        documentList.map((item, index) => {
                            let num = index ? index : ''
                            tempList.push({
                                FileSize: item.FileSize,
                                FileType: item.FileType,
                                FileName: item.FileName,
                                FilePath: item.FilePath,
                                ProjectID: selectedProject ? item.ProjectID : values[`ProjectID${num}`],
                                Memo: values[`Memo${num}`],
                                DocumentDate: values[`DocumentDate${num}`],
                                DocumentName: values[`DocumentName${num}`],
                                DocumentType: values[`DocumentType${num}`],
                            })
                        })
                        tempList.map(temp => {
                            let FileName = temp.FileName
                            let FilePath = temp.FilePath
                            if (FileName && FilePath) {
                                dispatch({
                                    type: `enclosure/add`,
                                    payload: {
                                        ProjectID: selectedProject ? selectedProject.ID : '',
                                        ...temp,
                                        FileName,
                                        FilePath
                                    }
                                })
                            } else {
                                notification.error({
                                    message: '请上传文件'
                                })
                                return
                            }
                        })
                        cancelModal()
                        selectList ? selectList() : void (0)
                    }
                }
            ).catch((errorInfo) => {
                return
            }
        );
    }

    //上传文件
    changeFormValue(info) {
        const {documentList} = this.state
        const {selectedProject} = this.props
        let tempList = documentList.concat()
        let length = tempList.length
        const {status, name, size, response} = info.file
        let FileType = name.substring(name.lastIndexOf(".") + 1)
        let result = {
            [`FileSize${length ? length : ''}`]: JSON.stringify(size),
            [`DocumentName${length ? length : ''}`]: name,
            [`FileType${length ? length : ''}`]: FileType
        }
        let values = {
            FileSize: JSON.stringify(size),
            DocumentName: name,
            FileType: FileType
        }
        if (status === 'done') {
            notification.success({
                message: '上传文件成功'
            })
            if (response.success) {
                result[`FileName${length ? length : ''}`] = response.filename
                result[`FilePath${length ? length : ''}`] = response.filepath
                values.FileName = response.filename
                values.FilePath = response.filepath
                if (selectedProject) {
                    result[`ProjectID${length ? length : ''}`] = JSON.stringify(selectedProject.ID)
                    values.ProjectID = selectedProject.ID
                }
                tempList = tempList.concat(values)
                this.formFileRef.current.setFieldsValue(result)
                this.setState({documentList: tempList})
            }
        } else if (status === 'error') {
            notification.warning({
                message: '上传文件失败'
            })
        }
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

    renderFormItem(item, index) {
        const {documentList} = this.state
        const {selectedProject, record, dict} = this.props
        const {projectList, ProjectFile} = dict

        return <div>
            <Form.Item
                label="项目名称"
                name={`ProjectID${index ? index : ''}`}
                rules={[{required: true}]}>
                <Select showSearch
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={selectedProject || record}
                >
                    {
                        projectList && projectList.length ? projectList.map(item => {
                            return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                        }) : void (0)
                    }
                </Select>
            </Form.Item>
            <Row span={24}>
                <Col span={12}>
                    <Form.Item
                        label="文件大小"
                        name={`FileSize${index ? index : ''}`}
                        rules={[{required: true}]}
                        {...formItemLayout[2]}
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="文件类型"
                        name={`FileType${index ? index : ''}`}
                        rules={[{required: true}]}
                        {...formItemLayout[2]}
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label="文档名称"
                name={`DocumentName${index ? index : ''}`}
                rules={[{required: true}]}
            >
                <Input style={{width: '100%'}}/>
            </Form.Item>
            <Row span={24}>
                <Col span={12}>
                    <Form.Item
                        label="文档类型"
                        name={`DocumentType${index ? index : ''}`}
                        rules={[{
                            required: true,
                            validator: (rule, value, callback) => this.validator(rule, value, callback, '文档类型', 50)
                        }]}
                        {...formItemLayout[1]}
                    >
                        <FormItem type={'SelectWrite'}
                                  customize={{id: 'Code', name: 'Name'}}
                                  menuList={ProjectFile}
                                  changeValue={(value) => {
                                      this.formFileRef.current.setFieldsValue({[`DocumentType${index ? index : ''}`]: value})
                                  }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="文档日期"
                        name={`DocumentDate${index ? index : ''}`}
                        rules={[{required: true}]}
                        {...formItemLayout[2]}
                    >
                        <DatePicker style={{width: "100%"}}/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="备注"
                       name={`Memo${index ? index : ''}`}
                       rules={[{
                           validator: (rule, value, callback) => this.validator(rule, value, callback, '备注', 320)
                       }]}>
                <TextArea/>
            </Form.Item>
        </div>
    }

    render() {
        const {documentList} = this.state
        const {documentVisible, record, saving, selectedProject, cancelModal} = this.props
        const validateMessages = {required: '${label}不能为空！'}
        const props = {
            name: 'file',
            action: `${domain}/Document/upload`,
            showUploadList: false,
            multiple: true
        }
        return (
            <Modal
                title={"上传附件项目资料"}
                visible={documentVisible}
                width={700}
                onCancel={() => cancelModal()}
                footer={[
                    <Button onClick={() => cancelModal()}>取消</Button>,
                    <Button type="primary" loading={saving} disabled={saving}
                            onClick={() => this.saveData()}>确定</Button>
                ]}
            >
                <Form
                    {...formItemLayout[0]}
                    ref={this.formFileRef}
                    initialValues={
                        record ? {
                            ...record,
                            ProjectID: record.ProjectID ? JSON.stringify(record.ProjectID) : undefined,
                            DocumentDate: record.DocumentDate ? moment(record.DocumentDate) : undefined
                        } : {}}
                    validateMessages={validateMessages}
                >
                    {
                        !record || selectedProject ?
                            <Form.Item label="选择文件" name={'file'}>
                                <Upload.Dragger {...props}
                                                onChange={(file) => this.changeFormValue(file)}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined/>
                                    </p>
                                    <p className="ant-upload-text">上传文件</p>
                                    <p className="ant-upload-hint">支持拖拽上传(支持多文件)</p>
                                </Upload.Dragger>
                            </Form.Item> : void (0)
                    }
                    {
                        record ? this.renderFormItem('', 0) : documentList.map((item, index) => {
                            return this.renderFormItem(item, index)
                        })
                    }
                </Form>
            </Modal>
        );
    }
}

export default connect((state) => Object.assign({}, {dict: state.dict}, state.enclosure))(EditModal)
