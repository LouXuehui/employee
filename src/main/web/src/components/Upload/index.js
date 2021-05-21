/**
 * Created by lxh on 2021-05-21
 */
import React, {Component} from 'react'
import {Upload, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import deepEqual from 'deep-equal'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: props.defaultValue || [],
            params: props.params || {}
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {defaultValue, params} = nextProps
        if (!deepEqual(defaultValue, this.props.defaultValue) || !deepEqual(params, this.props.params)) {
            this.setState({fileList: defaultValue || [], params})
        }
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewVisible: true,
            previewImage: file.url || file.preview,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        })
    }

    handleCancel = () => {
        this.setState({previewVisible: false})
    }

    handleChange = async ({file, fileList}) => {
        const {changeValue} = this.props
        if (file.status === "removed") {
            this.setState({previewImage: '', previewTitle: ''})
            changeValue('', [])
        } else {
            let photoUrl = await this.getBase64(file.originFileObj);
            changeValue(photoUrl, fileList)
            this.setState({fileList})
        }
    };

    render() {
        const {previewVisible, previewTitle, previewImage, fileList, params} = this.state

        const uploadButton = (
            <div>
                <PlusOutlined/>
                <div style={{marginTop: 8}}>点击上传</div>
            </div>
        );

        return (
            <>
                <Upload
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    fileList={fileList}
                    {...params}
                >
                    {fileList && fileList.length ? '' : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </>
        )
    }
}

export default Index
