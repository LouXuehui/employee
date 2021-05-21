import {Button, Modal, notification} from 'antd'
import React from 'react'
import MonacoEditor from 'react-monaco-editor'

export default function alert(title, e) {
    if (e.code === 1) {
        notification.success({
            message: "操作成功",
            description: `${title}成功!`,
            duration: 2,
            style: {
                top: 30
            }
        })
    } else {
        const key = `open${Date.now()}`
        const info = () => {
            Modal.error({
                title: "操作失败",
                content: (
                    <pre style={{width: '900px', height: '300px', overflow: 'auto'}}>
            {e.exception}
          </pre>
                ),
                width: 1000,
                okText: "确定",
                onOk() {
                    notification.close(key)
                }
            })
        }

        const btnClick = function () {
            info()
        }

        const btn = (
            <Button type="dashed" icon="search" size="small" onClick={btnClick}>
                查看详细
            </Button>
        )

        notification.error({
            message: "操作失败",
            description: (e.tips && e.tips.length > 60 ? e.tips.substring(0, 60) : e.tips),
            key,
            btn,
            duration: 10,
            style: {
                top: 30
            }
        })
    }
}

export function alertMessageLog(title, e) {
    const key = `open${Date.now()}`

    if (e && e.code === 1) {
        const btn = (
            <Button type="dashed" icon="search" size="small" onClick={() => {
                info("操作成功")
            }}>查看详细
            </Button>
        )
        notification.success({
            message: "操作成功",
            description: `${title}成功!`,
            key,
            btn,
            duration: 10,
            style: {top: 30}
        })
    } else {
        const btn = (
            <Button type="dashed" icon="search" size="small" onClick={() => {
                info("操作失败")
            }}>查看详细
            </Button>
        )
        notification.error({
            message: "操作失败",
            description: (e.tips && e.tips.length > 60 ? e.tips.substring(0, 60) : e.tips),
            key,
            btn,
            duration: 10,
            style: {top: 30}
        })
    }

    const info = (title) => {
        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: true,
            theme: 'vs',
            cursorStyle: 'line',
            automaticLayout: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
            minimap: {enabled: false}
        }
        let show = {
            title: title,
            content: (
                <div style={{height: '330px'}}>
                    <MonacoEditor
                        editorDidMount={(editor, monaco) => {
                            changeKeyBindings(editor, monaco)
                        }}
                        language='xml'
                        options={options}
                        value={getShowValue()}/>
                </div>

            ),
            width: 1000,
            okText: "确定",
            onOk() {
                notification.close(key)
            }
        }

        if (e && e.code === 1) {
            Modal.success(show)
        } else {
            Modal.error(show)
        }

        function getShowValue() {
            let value = ''
            if (e.payload) {
                if (e.exception) {
                    value = value + '日志: \n'
                }
                value += e.payload
            }
            if (e.exception) {
                if (e.payload) {
                    value = value + '\n\n异常信息: \n'
                }
                value = value + e.exception
            }
            return value
        }
    }
}