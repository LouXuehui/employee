/**
 * Created by lxh on 2020/5/29
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {getValueByKey} from "common/arr";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
} from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import deepEqual from 'deep-equal'
import {getStringLength} from "@/common/arr";

const ds = new DataSet({
    state: {
        start: 0,
        end: 1,
    },
});

var chartIns = null;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: []
        };
    }

    componentDidMount() {
        const {projectClassData, ProjectClass} = this.props
        this.updateState(projectClassData, ProjectClass)
    }

    componentWillReceiveProps(next) {
        const {projectClassData: list, ProjectClass: classList} = next
        const {projectClassData, ProjectClass} = this.props
        if (!deepEqual(list, projectClassData) || !deepEqual(classList, ProjectClass)) {
            if (list && list.length && classList && classList.length) {
                let temp = list ? JSON.parse(JSON.stringify(list)) : []
                let tempList = [
                    ...temp,
                ]
                this.updateState(tempList, classList)
            }
        }
    }

    updateState(list, classList) {
        let fields = []
        for (let item of list) {
            let name = getValueByKey(classList, item.Class, 'Code', 'Name')
            item.Name = name
            item['预算金额'] = item.TotalBudget
            item['实际金额'] = item.TotalMoney
            item['数量'] = item.ProjectCount
            let findIndex = fields.indexOf(item.Class)
            if (findIndex === -1) {
                fields.push(name)
            }
        }
        this.setState({dataList: list, fields}, () => {
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
        const {startValue, endValue} = e;
        ds.setState('start', startRadio);
        ds.setState('end', endRadio);
        this.setState({startValue, endValue})
    };

    render() {
        const {dataList, startValue, endValue} = this.state
        const {title} = this.props
        const dv = ds.createView().source(dataList);
        const scale = {};
        dv.transform({
            type: 'filter',
            callback(item, idx) {
                const radio = idx / dataList.length;
                return radio >= ds.state.start && radio <= ds.state.end;
            },
        });
        dv.transform({
            type: 'fold',
            fields: ['预算金额', '实际金额'], // 展开字段集
            key: 'type', // key字段
            value: 'value', // value字段
        });

        const legendItems = [
            {value: '预算金额', marker: {symbol: 'square', fill: '#39CCD8', radius: 5}},
            {value: '实际金额', marker: {symbol: 'square', fill: '#2395FC', radius: 5}},
            {value: '数量', marker: {symbol: 'square', fill: '#11bfff', radius: 5, lineWidth: 2}},
        ]

        const label = {
            offset: 10, // 数值，设置坐标轴文本 label 距离坐标轴线的距离
            // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
            textStyle: {
                textAlign: 'center', // 文本对齐方向，可取值为： start center end
                fontSize: '12', // 文本大小
            },
            formatter(text, item, index) {
                let arr = []
                if (getStringLength(text) > 10) {
                    let dot = ''
                    for (let i = 0; i < text.length; i++) {
                        let temp = text.substr(0, i)
                        if (getStringLength(temp) > 10) {
                            arr[0] = text.substr(0, i - 1)
                            arr[1] = text.substr(i, 4)
                            dot = i + 4 >= text.length ? '' : '...'
                            break
                        }
                    }
                    return `${arr[0]}\n${arr[1]}${dot}`;
                } else {
                    return text
                }
            }
        }

        return <div className={styles.normalWrapper}>
            <div className={styles.title}>{title}</div>
            <div className={styles.chart}>
                <Chart height={200} data={dv} scale={scale} forceFit
                       padding="auto"
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
                                if (value === '数量') {
                                    const geoms = chartIns.getAllGeoms();
                                    for (let i = 0; i < geoms.length; i++) {
                                        const geom = geoms[i];
                                        if (geom.getYScale().field === value) {
                                            if (checked) {
                                                geom.show();
                                            } else {
                                                geom.hide();
                                            }
                                        }
                                    }
                                } else {
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
                                }
                            }, 0)

                        }}
                    />
                    <Axis name="Name" label={label}/>
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
                            if (value === '预算金额') {
                                return '#39CCD8';
                            }
                            if (value === '实际金额') {
                                return '#2395FC';
                            }
                        }]}
                        adjust={[{
                            type: 'dodge',
                            marginRatio: 1 / 32,
                        }]}
                    />
                    <Geom type="line" position="Name*数量" color="#11bfff" size={2}/>
                </Chart>
                {
                    dataList && dataList.length > 8 ?
                        <Slider
                            data={dataList}
                            padding={60}
                            height={15}
                            start={startValue}
                            end={endValue}
                            xAxis="Name"
                            yAxis="预算金额"
                            onChange={this.handleSliderChange}
                        /> : void (0)
                }
            </div>
        </div>
    }
}

export default connect(({dict, overView}) => ({...dict, ...overView}))(Index)
