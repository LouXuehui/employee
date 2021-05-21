import {searchByPy} from './pinYinUtil'
/**
 *
 * @param searchWord 搜索词
 * @param nodeList 列表
 * @param searchFields 搜索字段
 * @param idFiled 主键字段默认为id
 * @returns {{filterNodeList: Array, openKeys: Array}}
 */
export function searchTree({searchWord, nodeList, searchFields = ['id', 'name'], idFiled = 'id'}) {
  let filterNodeList = [],openKeys = []
  nodeList.filter(one => {
    let flag = false
    searchFields.map(field=>{
      if(searchByPy(searchWord, one[field])){
        flag = true
      }
    })
    return flag
  }).map(item => {
    if (!filterNodeList.filter(temp => temp[idFiled] === item[idFiled]).length) {
      filterNodeList.push(item)
      searchParent(item)
    }
  })
  function searchParent(one) {
    nodeList.map(node => {
      if (node.id === one.parentId && !filterNodeList.filter(temp => temp[idFiled] === node[idFiled]).length) {
        filterNodeList.push(node)
        openKeys.push(node[idFiled])
        searchParent(node)
      }
    })
  }
  return {filterNodeList,openKeys}
}

export function buildTree(dataSource, idField, parentField, rootId, inherit) {
  let elementList = []
  let inheritType = ''
  let defaultExpandedKeys = []
  let allExpandedKeys = []
  let defaultSelectedRecord = {}
  let allFristId = []
  let i = 0
  dataSource.map((item) => {
    let node = Object.assign({}, item)
    if (node[parentField] === rootId) {
      allFristId.push(node[idField])
      inheritType = node.rootType
      let children = findChildren(node[idField])
      if (children.length > 0) {
        allExpandedKeys.push(node[idField])
        node.children = children
        i === 0 ? defaultSelectedRecord = children[0] : void(0)
      } else {
        defaultSelectedRecord = node
      }
      elementList.push(node)
      i++
    }
  })

  function findChildren(parent_id) {
    let children = []
    dataSource.map(item => {
      let node = Object.assign({}, item)
      inherit ? node.rootType = inheritType : void(0)
      if (node[parentField] === parent_id) {
        let elementChildren = findChildren(node[idField])
        if (elementChildren.length > 0) {
          node.children = elementChildren
          allExpandedKeys.push(node[idField])
        }
        children.push(node)
      }
    })
    return children
  }

  if (elementList.length > 0) {
    defaultExpandedKeys.push(elementList[0][idField])
  }
  return {dataSource: elementList, defaultExpandedKeys, defaultSelectedRecord, allExpandedKeys, allFristId}
}


export function buildAntdTree(dataSource, idField, titleField, parentField, rootId) {
  let elementList = []
  dataSource.map(node => {
    if (node[parentField] === rootId) {
      let children = findChildren(node[idField])
      let treeNode = {title: node[titleField], key: node[idField]}
      children.length > 0 ? treeNode.children = children : void(0)
      elementList.push(treeNode)
    }
  })

  function findChildren(parent_id) {
    let children = []
    dataSource.map(node => {
      let treeNode = {title: node[titleField], key: node[idField]}
      if (node[parentField] === parent_id) {
        let elementChildren = findChildren(node[idField])
        if (elementChildren.length > 0) {
          treeNode.children = elementChildren
        }
        children.push(treeNode)
      }
    })
    return children
  }

  let defaultExpandedKeys = []
  if (elementList.length > 0) {
    defaultExpandedKeys.push(elementList[0][idField])
  }
  return {dataSource: elementList, defaultExpandedKeys}
}

export function buildNodeTree(dataSource, idField, parentField, rootId) {
  let elementList = []
  dataSource.map(one => {
    if (one[parentField] === rootId) {
      let node = findChildren(one[idField])
      node.length > 0 ? one.node = node : void(0)
      elementList.push(one)
    }
  })

  function findChildren(parent_id) {
    let node = []
    dataSource.map(one => {
      if (one[parentField] === parent_id) {
        let elementChildren = findChildren(one[idField])
        if (elementChildren.length > 0) {
          one.node = elementChildren
        }
        node.push(one)
      }
    })
    return node
  }

  return {oneNodeTree: elementList}
}

export function buildAntdTreeSelectData(dataSource, idField, titleField, parentField, rootId, disableList, disableAllId) {
  let elementList = []
  dataSource.map(node => {
    if (node[parentField] === rootId) {
      let children = findChildren(node[idField])
      let treeNode = {
        label: node[titleField],
        value: node[idField],
        key: node[idField],
        disabled: disableList ? disableList.includes(disableAllId) || disableList.includes(node[idField]) : false
      }
      children.length > 0 ? treeNode.children = children : void(0)
      elementList.push(treeNode)
    }
  })

  function findChildren(parent_id) {
    let children = []
    dataSource.map(node => {
      let treeNode = {
        label: node[titleField],
        value: node[idField],
        key: node[idField],
        disabled: disableList ? disableList.includes(disableAllId) || disableList.includes(node[idField]) : false
      }
      if (node[parentField] === parent_id) {
        let elementChildren = findChildren(node[idField])
        if (elementChildren.length > 0) {
          treeNode.children = elementChildren
        }
        children.push(treeNode)
      }
    })
    return children
  }

  let defaultExpandedKeys = []
  if (elementList.length > 0) {
    defaultExpandedKeys.push(elementList[0][idField])
  }
  return {dataSource: elementList, defaultExpandedKeys}
}

/**
 *
 * @param nodeList 节点列表
 * @param groupList 分组列表
 * @param idFiled 主键字段默认为id
 * @param parentField 父子节点关联字段
 * @returns Array
 */
export function getParentList({nodeList,groupList, idFiled = 'id', parentField = 'parentId'}) {
  let parentList = []
  nodeList.map(item => {
    searchParent(item)
  })
  function searchParent(item) {
    groupList.map(group => {
      if (group.id === item[parentField]) {
        if (!parentList.filter(temp => temp[idFiled] === group[idFiled]).length) {
          parentList.push(group)
          searchParent(group)
        }
      }
    })
  }

  return parentList
}