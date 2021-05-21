/**
 * Created by lxh on 2019/5/30
 */

import React, {Component} from 'react'
import {Divider, Popconfirm, Modal} from 'antd'

export default class Operation extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    renderOperation(name, theme, addDivider) {
        let color = theme && theme !== true ? theme : ''
        const {onClick, visible, closeModal, handleOk,maskStyle} = this.props
        if (name === '删除') {
            return <div>
                <span className={color ? color : 'delete'} onClick={() => onClick()}>{name}</span>
                <Modal title="确认删除吗？"
                       visible={visible}
                       width={300}
                       maskStyle={maskStyle}
                       onCancel={() => closeModal()}
                       onOk={()=> handleOk()}
                >
                </Modal>
            </div>
        } else if (name === '重置密码') {
            return <Popconfirm title="确认重置密码吗"
                               onConfirm={() => onClick()}
                               okText="确认"
                               cancelText="取消">
                <span className={color ? color : 'delete'}>重置密码</span>
            </Popconfirm>
        } else {
            return <div className={color ? color : 'defaultTheme'}
                        onClick={() => onClick()}>
                <span>{name}</span>
                {addDivider ? <Divider type={"vertical"}/> : void(0)}
            </div>
        }
    }

    render() {
        const {name, theme, addDivider} = this.props
        return (
            <div>
                {this.renderOperation(name, theme, addDivider)}
            </div>
        )
    }
}

Operation.defaultProps = {
    theme: null, // 样式
    name: null, // 操作名称
}
