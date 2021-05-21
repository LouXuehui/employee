import React, {Component} from "react";
import {connect} from "dva";
import {Modal, Button, message} from "antd"
import FileViewer from 'react-file-viewer';
import {domain} from "@/common/domain";

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    cancelModal() {
        const {dispatch} = this.props
        dispatch({type: 'enclosure/setState', payload: {previewVisible: false, record: '', previewUrl: ''}})
    }

    render() {
        const {previewVisible, previewUrl, record} = this.props

        return (
            <Modal
                title={"预览"}
                visible={previewVisible}
                width={700}
                onCancel={() => this.cancelModal()}
                footer={[
                    <Button onClick={() => this.cancelModal()}>确定</Button>
                ]}
            >
                {/*{*/}
                {/*    ["jpeg", "png", "jpg"].indexOf(record.FileType) ?*/}
                {/*        <img src={require('../../../../assets/logo.png')}/> : <div>3333</div>*/}
                {/*}*/}

                <FileViewer
                    // fileType={record.FileType}//文件类型
                    // filePath={require('../../../../assets/logo.png')} //文件地址
                    fileType={'png'}//文件类型
                    // filePath={require(`${domain}/document/download?id=${record.FileID}`)} //文件地址
                    filePath={require(previewUrl)}
                    onError={() => {
                        message.warning('报错')
                    }} //函数[可选]：当文件查看器在获取或呈现请求的资源时发生错误时将调用的函数。在这里可以传递日志记录实用程序的回调。
                    errorComponent={() => <div>33333</div>} //[可选]：发生错误时呈现的组件，而不是react-file-viewer随附的默认错误组件。
                    unsupportedComponent={console.log(' 2222', 2222)} //[可选]：在不支持文件格式的情况下呈现的组件。
                />
            </Modal>
        );
    }
}

export default connect((state) => Object.assign({}, state.enclosure))(EditModal)
