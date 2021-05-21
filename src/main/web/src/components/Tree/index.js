/**
 * unfoldingMode line时，单击打开 arrow为双击打开
 *
 */
import React, {Component} from 'react'
import styles from './index.less'
import {Icon, Tooltip} from 'antd'
import {searchByPy} from 'common/pinYinUtil'
import deepEqual from 'deep-equal'

class Tree extends Component {

    static defaultProps = {
        showLine: true,
        idField: 'id',
        nameFiled: 'name',
        childField: 'children',
        listSize: -1 // 列表最多显示条数，列表数量大于listSize则显示树结构
    }

    constructor(props) {
        super(props)
        this.state = {
            openKeys: this.calcExpandedKeys(props),
            selectedNodeKey: '',
            scrollWidth: false
        }
    }

    componentDidMount() {
        //去掉树的鼠标右击事件
        let elements = document.getElementsByClassName("tree")
        for (let i = 0; i < elements.length; i++) {
            elements[i].oncontextmenu = function (e) {
                return false
            }
        }

        if (window.ee) {
            window.ee.on("changeTreeState", (state) => {
                this.setState(state)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const {selectedKey, selectLeftKey, isLeftGroup} = nextProps
        let openKeys = !deepEqual(nextProps.expandedKeys, this.props.expandedKeys) ? this.calcExpandedKeys(nextProps, true) : ''
        if (openKeys) {
            this.setState({openKeys})
        }
        if (nextProps.refresh) {
            this.setState({selectedNodeKey: ''})
        }
        // if (selectedKey) {
        //     this.setState({selectedNodeKey: selectedKey})
        // }
        // if (isLeftGroup) {//新增输入、输出、前后过滤器的弹出框,左边插件分组,在检索时是否选中第一条
        //     this.setState({selectedNodeKey: selectedKey})
        // }
    }

    calcExpandedKeys(props, isNotInit) {
        const expandedKeys = props.expandedKeys || (isNotInit ? [] : props.defaultExpandedKeys);
        if (!expandedKeys) {
            return []
        }
        return expandedKeys
    }

    renderParent(root, index = 0) {
        const {openKeys} = this.state
        const {idField, childField, dragClass} = this.props
        return (
            <li key={`${root[idField]}${index}`}>
                {this.renderNodeTitle(root, index + 1, 'parent')}
                {openKeys.indexOf(root[idField]) > -1 ? this.renderChildren(root[childField], index + 1) : void (0)}
            </li>
        )
    }

    renderChildren(children, index) {
        const {idField, childField, dragClass} = this.props
        return (
            <ul key={index}>
                {children ? children.map((child) => {
                    if (!!child[childField]) {
                        return this.renderParent(child, index)
                    } else {
                        return (
                            <li key={child[idField]}>
                                {this.renderNodeTitle(child, index + 1)}
                            </li>
                        )
                    }
                }) : ''}
            </ul>
        )
    }

    onOpenHandler(node, key, e, unfoldingMode) {
        let {openKeys, domId} = this.state
        if (unfoldingMode === 'line') {
            const {childField} = this.props
            if (node[childField] && key) {
                if (openKeys.indexOf(key) > -1) {
                    openKeys.splice(openKeys.indexOf(key), 1)
                } else {
                    openKeys.push(key)
                }
                this.setState({openKeys})
            }
        }
        this.setState({selectedNodeKey: key}, () => this.props.onSelect(node, openKeys))
    }

    openTree(e, unfoldingMode, node, key) {
        const {onOpenChange, isAsync, onLoadData} = this.props
        if (unfoldingMode === 'arrow') {
            let {openKeys} = this.state
            const {childField} = this.props
            e.stopPropagation()
            if (node[childField] && key) {
                if (openKeys.indexOf(key) > -1) {
                    openKeys.splice(openKeys.indexOf(key), 1)
                } else {
                    isAsync ? onLoadData(node) : void (0)
                    openKeys.push(key)
                }
                onOpenChange ? onOpenChange(openKeys) : void (0)
                this.setState({openKeys})
            }
        }
    }

    clearSelectedNode() {
        this.setState({selectedNodeKey: ''})
    }

    renderTitle(node) {
        let {openKeys} = this.state
        const {idField, titleContent, childField, unfoldingMode = 'line'} = this.props
        const isOpen = openKeys.indexOf(node[idField]) > -1

        function renderItem(node) {
            let open = false
            openKeys.map(item => {
                if (item === node[idField]) {
                    open = true
                }
            })
            return titleContent ? titleContent({...node, open: open}) :
                <div className={'ellipsis'}>{node.name}</div>
        }

        return (
            <div className={`nameAnd visible${node[idField]}`}>
                {node[childField] || node.isGroup ? <Icon type={isOpen ? 'up' : 'down'}
                                                          className="toggle-icon"
                                                          onClick={(e) => {
                                                              this.openTree(e, unfoldingMode, node, node[idField])
                                                          }}/> : void (0)}
                {renderItem(node)}
            </div>
        )
    }

    renderNodeTitle(node, index, isParent) {
        let {selectedNodeKey} = this.state
        const {onMouseDown, idField, editContent, defaultKey, childField, unfoldingMode = 'line', dragClass} = this.props
        let selectedKey = selectedNodeKey ? selectedNodeKey : defaultKey
        let activeStatus = selectedKey === node[idField]
        let paddingLeft = node[childField] && node[childField].length > 0 ? 15 * index : 18 + 15 * index
        return (
            //className parent不要随便修改别的地方用到了
            <div className='itemParent'>
                <div className={`${activeStatus ? 'parentActive' : ''}`}></div>
                <div className={`parent node ${dragClass ? dragClass : ''}`}
                     width="240"
                     key={`${node[idField]}${index}parent`}
                     style={{paddingLeft: `${paddingLeft}px`}}
                     onMouseDown={(e) => {
                         onMouseDown && e.button === 2 ? onMouseDown(node) : void (0)
                     }}
                     onDoubleClick={(e) => this.openTree(e, unfoldingMode, node, node[idField])}
                     onClick={(e) => {
                         this.onOpenHandler(node, node[idField], e, unfoldingMode)
                     }}>
                    {this.renderTitle(node)}
                    <div className={'editWrap'}>
                        {selectedKey === node[idField] ? editContent(node) : void (0)}
                    </div>
                </div>
            </div>
        )
    }

    renderList() {
        const {itemList, nameFiled, idField, filterWords} = this.props

        let filterList = itemList.filter(item => searchByPy(filterWords, item[nameFiled]) || searchByPy(filterWords, item[idField]))
        return filterList.map((item) => this.renderNodeTitle(item, 1))
    }

    render() {
        const {dataSource, itemList, listSize} = this.props

        return (
            <section className='treeWrap tree'>
                <div className='treeNode'>
                    {itemList && itemList.length <= listSize ? this.renderList() : (
                        dataSource.map((elementList, index) => {
                            return (
                                <ul key={index}>
                                    {this.renderParent(elementList)}
                                </ul>
                            )
                        })
                    )}
                </div>
            </section>
        )
    }
}

export default Tree

