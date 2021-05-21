/**
 * Created by lxh on 2020/5/29
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Select, Spin} from 'antd'
import ProjectTable from './projectTable'
import moment from 'moment'
import {ProjectOutlined, PayCircleOutlined} from '@ant-design/icons'
import NoData from '../../../assets/no_data.png'
import ProjectChart from './ProjectChart'
import PersonChart from './PersonChart'

const {Option} = Select;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: moment().format('YYYY')
        }
    }

    componentDidMount() {
        const {dispatch} = this.props
        this.loadData()
        let list = ["ProjectYear", "ProjectClass", "BuyType", "ProjectFile"]
        list.map(section => {
            dispatch({type: 'dict/getUseList', payload: {section}})
        })
        dispatch({type: "dict/getEmployee"}) //人员
        dispatch({type: "dict/getDepartment"}) //科室
        dispatch({type: "dict/getCompanyList"}) //公司
    }

    loadData() {
        const {year} = this.state
        const {dispatch} = this.props
        dispatch({type: 'overView/setState', payload: {queryLoading: true}})
        dispatch({type: 'overView/projectOverview', payload: {year}})
    }

    getFirstCardData(overViewData) {
        let data = overViewData && overViewData.length ? overViewData[0] : {}
        let cardLeftList = [], cardRightList = []
        if (data && JSON.stringify(data) !== '{}') {
            cardLeftList = [
                {title: '项目总览', num: data.ProjectCount, titleBg: '#23A9FC', icon: ''},
                {title: '总预算金额', num: data.TotalMoney, titleBg: '#39CCD8', icon: ''},
            ]
            cardRightList = [
                {title: '合同数量', num: data.AgreementCount},
                {title: '合同金额', num: data.AgreementMoney},
                {title: '已验收数量', num: data.AcceptCount},
                {title: '已验收金额', num: data.AcceptMoney},
                {title: '已支付', num: data.PayMoney},
                {title: '未支付', num: data.NoPayMoney},
                {title: '财政资金已支', num: data.otherPay},
                {title: '财政资金未支', num: data.OtherNoPay},
            ]
        }
        return {cardLeftList, cardRightList}
    }

    render() {
        const {list, year} = this.state
        const {overViewData, projectData, signData, queryLoading, dict} = this.props
        const {ProjectYear} = dict
        let {cardLeftList, cardRightList} = this.getFirstCardData(overViewData)

        return (
            <div className={styles.overViewWrapper}>
                <Spin spinning={queryLoading}>
                    <div className={styles.topView}>
                        <div className={styles.top}>
                            <div className={styles.title}>项目总览</div>
                            <Select style={{width: 150}}
                                    value={year}
                                    placeholder="年份"
                                    onChange={(year) => this.setState({year}, () => this.loadData())}
                            >
                                {
                                    ProjectYear && ProjectYear.length ? ProjectYear.map(item => {
                                        return <Option value={item.Code} key={item.Code}>{item.Name}</Option>
                                    }) : void (0)
                                }
                            </Select>
                        </div>
                        {
                            overViewData && overViewData.length ?
                                <div className={styles.card}>
                                    <div className={styles.cardLeft}>
                                        {
                                            cardLeftList.map((card, index) => {
                                                let style = {color: card.titleBg, fontSize: 24}
                                                return <div className={styles.cardBox}>
                                                    <div className={styles.cardTitle}
                                                         style={{backgroundColor: card.titleBg}}>{card.title}</div>
                                                    <div className={styles.cartContent}>
                                                        <div>{card.num}</div>
                                                        {
                                                            index ? <PayCircleOutlined style={style}/> :
                                                                <ProjectOutlined style={style}/>
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className={styles.cardRight}>
                                        {
                                            cardRightList.map((card, index) => {
                                                return <div className={styles.rightBox}
                                                            style={{
                                                                marginBottom: index < 4 ? 20 : 0,
                                                                marginRight: index === 3 || index === 7 ? 0 : 20
                                                            }}>
                                                    <div className={styles.num}>
                                                        {card.num ? card.num : '-'}
                                                    </div>
                                                    <div className={styles.rightTitle}>
                                                        {card.title}
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div> : <div className={styles.noData}>
                                    <img src={NoData}/>
                                    暂无数据
                                </div>
                        }
                    </div>
                    <div className={styles.chartView}>
                        <div className={styles.chartLeft}>
                            <ProjectChart title={'项目分布'}/>
                        </div>
                        <div className={styles.chartRight}>
                            <PersonChart title={'人员分布'}/>
                        </div>
                    </div>
                    <ProjectTable title={'在建项目'} dataList={projectData}/>
                    <ProjectTable title={'近期到期合同'} dataList={signData}/>
                </Spin>
            </div>
        )
    }
}

export default connect(({dict, overView}) => ({dict, ...overView}))(Index);
