import React, {Component} from 'react'
import {Modal, Button} from 'antd'

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {

    }

    componentWillReceiveProps(props) {

    }

    render() {
        const {visible, title, cancelModal, onOK, message, content} = this.props
        return (
            <Modal
                width={500}
                visible={visible}
                title={title ? title : '提示'}
                onCancel={() => cancelModal()}
                wrapClassName={'confirmContainer'}
                footer={[
                    <Button onClick={() => cancelModal()}>取消</Button>,
                    <Button type="primary" onClick={() => onOK()}>确定</Button>
                ]}
            >
                {
                    content ? content : <span>确定要
                        <span className={'important'}>{message}</span>
                        当前数据吗？</span>
                }
            </Modal>
        )
    }
}