import React, {Component} from 'react'
import Tree from '../index';
import styles from './index.less'
import {Icon} from 'antd'
import  {buildTree,buildAntdTree} from '../../../utils/treeUtil'

export default class Test extends Component {

  render() {
    const  data=[{id:"1",pid:"root",name:"1234"},{id:"1-1",pid:"1",name:"1-22"},{id:"1-223",pid:"1-1",name:"1-3344"},{id:"1-2",pid:"1",name:"1-222"},{id:"2",pid:"root",name:"222-22"},{id:"121-2",pid:"2",name:"发发发方法-222"}]
    const idField = "id"
    const {dataSource,defaultExpandedKeys} = buildTree(data,idField, 'pid', 'root')
    const {dataSource:a,defaultExpandedKeys:b} = buildAntdTree(data,idField,'name','pid', 'root')
    return (
      <div className={styles.tree}>
        <Tree
          showLine={false}
          dataSource={dataSource}
          defaultExpandedKeys={defaultExpandedKeys}
          onSelect={(record)=>{}}
          titleContent={(record)=> {
            return <div><Icon type="clock-circle" />{record.name}<Icon type="check" /></div>
          }}
          editContent={(record)=> {
            return(
              <div className={styles.icon}>
              </div>
            )
          }}
        />
      </div>
    );
  }
}
