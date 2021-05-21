/**
 * Created by lxh on 2020/4/16
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import 'moment/locale/zh-cn'
import { Tabs, Popconfirm, message } from 'antd'
import './index.less'
import router from 'umi/router'
import App from '../../assets/layout/icon_app.png'
import Save from '../../assets/layout/icon_save.png'

const { TabPane } = Tabs

@connect(state => Object.assign({}, state.layout))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clientHeight: document.body.clientHeight
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({ clientHeight: document.body.clientHeight })
    }) //监听窗口大小改变
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  onChange = activePaneKey => {
    const { activePaneKey: lastActivePaneKey, dispatch, children, menuList, openSubMenu } = this.props
    router.push({
      pathname: `/${activePaneKey}`,
      query: {}
    })
    dispatch({
      type: 'layout/updatePane',
      payload: {
        lastActivePaneKey,
        lastContent: children,
        activePaneKey
      }
    })
    let openKeys = []
    menuList.map(menu => {
      let Children = menu.Children || []
      let findIndex = Children.findIndexById(activePaneKey, 'id')
      if (findIndex > -1) {
        openKeys = [menu.ItemID]
      }
    })
    openSubMenu(openKeys)
  }

  remove = targetKey => {
    let { removePane } = this.props
    removePane(targetKey)
  }

  confirm(pane) {
    const { dispatch, openList, user } = this.props
    let list = openList ? JSON.parse(JSON.stringify(openList)) : []
    let findIndex = list.findIndexById(pane.MenuID, 'MenuID')
    if (findIndex > -1) {
      list.splice(findIndex, 1)
    } else {
      list.push(pane)
    }
    if (list && list.length > 3) {
      message.warning('最多收藏3个页面')
    } else {
      let temp = {}
      for (let i = 0; i < 3; i++) {
        temp[`item${i + 1}`] = list[i] ? parseInt(list[i].MenuID) : 0
      }
      dispatch({ type: 'layout/setState', payload: { openList: list } })
      dispatch({ type: 'layout/setDefaultPage', payload: { usercode: user.userId, ...temp } })
    }
  }

  render() {
    const { clientHeight } = this.state
    const { activePaneKey, isNewPane, panes, openList } = this.props

    return (
      <div className={'tabs'}>
        <Tabs onChange={this.onChange} activeKey={activePaneKey} onEdit={this.onEdit} type="editable-card" hideAdd>
          {panes.map((pane, index) => {
            let isOpen = openList && openList.length && openList.findIndexById(pane.MenuID, 'MenuID') > -1
            return (
              <TabPane
                forceRender={true}
                tab={
                  <div>
                    <Popconfirm placement="bottom" title={`确定${isOpen ? '取消' : ''}收藏${pane.title}吗？`} onConfirm={() => this.confirm(pane)} okText="确定" cancelText="取消">
                      <img src={isOpen ? Save : App} style={{ width: 15, marginRight: 5 }} />
                    </Popconfirm>
                    <span style={{ color: isOpen ? '#008DFF' : '#333' }}>{pane.title}</span>
                  </div>
                }
                key={pane.key}
              >
                <div className={'pane'} style={{ height: clientHeight - 111 }}>
                  {activePaneKey === pane.key && isNewPane ? this.props.children : pane.content}
                </div>
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    )
  }
}
