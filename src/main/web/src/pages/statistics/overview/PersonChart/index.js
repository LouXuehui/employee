/**
 * Created by lxh on 2020/5/29
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {getValueByKey} from "common/arr";
import {Axis, Chart, Geom, Legend, Tooltip,} from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';

const ds = new DataSet({
    state: {
        start: 0,
        end: 1,
    },
});
let chartIns = null;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            leaderList: [],
            nameList: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const {dataList, testList, leaderList} = this.state
        if (nextProps.empData != testList || nextProps.leaderList != leaderList) {
            this.setState({data: nextProps.empData, leaderList: nextProps.leaderList})
            let abc = nextProps.empData, bbbb = nextProps.leaderList
            if (abc && abc.length && bbbb && bbbb.length) {
                let temp = abc ? JSON.parse(JSON.stringify(abc)) : []
                let tempList = [
                    ...temp,
                ]
                this.updateState(tempList, bbbb)
            }

        }
    }

    componentDidMount() {
        const {empData, leaderList} = this.props
        this.updateState(empData, leaderList)
    }


    updateState(list, leaderList) {
        for (let item of list) {
            let name = getValueByKey(leaderList, item.Leader, 'Code', 'Name')
            item.Name = name
            item['已完成'] = item.YesCount
            item['未完成'] = item.NoCount
        }
        this.setState({dataList: list}, () => {
            if (list && list.length > 8) {
                let end = 8 / list.length
                let startValue = list[0].Name
                let endValue = list[7].Name
                ds.setState('start', 0);
                ds.setState('end', end);
                this.setState({startValue, endValue})
            }
        })
    }


    handleSliderChange = e => {
        const {startRadio, endRadio} = e;
        ds.setState('start', startRadio);
        ds.setState('end', endRadio);
    };

    render() {
        const {title} = this.props
        const {dataList, startValue, endValue} = this.state

        const cols = {};
        const dv = ds.createView().source(dataList);
        dv.transform({
            type: 'filter',
            callback(item, idx) {
                const radio = idx / dataList.length;
                return radio >= ds.state.start && radio <= ds.state.end;
            },
        });
        dv.transform({
            type: 'fold',
            fields: ['已完成', '未完成'], // 展开字段集
            key: 'type', // key字段
            value: 'value', // value字段
        });
        const legendItems = [
            {value: '已完成', marker: {symbol: 'square', fill: '#20C5C5', radius: 5}},
            {value: '未完成', marker: {symbol: 'square', fill: '#FEC746', radius: 5}},
        ]

        return <div className={styles.normalWrapper}>
            <div className={styles.title}>{title}</div>
            <div className={styles.chart}>
                <Chart height={200} padding='auto' data={dv} scale={cols} forceFit
                       onGetG2Instance={chart => {
                           chartIns = chart;
                       }}>
                    <Legend
                        custom
                        allowAllCanceled
                        items={legendItems}
                        onClick={ev => {
                            setTimeout(() => {
                                const checked = ev.checked;
                                const value = ev.item.value;
                                const newLegend = legendItems.map((d) => {
                                    if (d.value === value) {
                                        d.checked = checked
                                    }
                                    return d;
                                })
                                chartIns.filter('type', (t) => {
                                    const legendCfg = newLegend.find(i => i.value == t);
                                    return legendCfg && legendCfg.checked;
                                });

                                chartIns.legend({
                                    items: newLegend
                                })
                                chartIns.repaint();
                            }, 0)

                        }}
                    />
                    <Axis name="Name"/>
                    <Axis name="count"/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Axis name="Name"/>
                    <Axis name="value" position="left"/>
                    <Tooltip
                        crosshairs={{
                            type: 'y',
                        }}
                    />
                    <Geom
                        type="interval"
                        position="Name*value"
                        color={['type', (value) => {
                            if (value === '已完成') {
                                return '#20C5C5';
                            }
                            if (value === '未完成') {
                                return '#FEC746';
                            }
                        }]}
                        adjust={[{
                            type: 'dodge',
                            marginRatio: 1 / 32,
                        }]}
                    />
                </Chart>
                {
                    dataList && dataList.length > 8 ? <Slider
                        data={dataList}
                        padding={60}
                        height={15}
                        startValue={startValue}
                        endValue={endValue}
                        xAxis="Name"
                        yAxis="已完成"
                        onChange={this.handleSliderChange}
                    /> : void (0)
                }
            </div>
        </div>
    }
}

export default connect(({overView, dict}) => ({...overView, ...dict}))(Index);