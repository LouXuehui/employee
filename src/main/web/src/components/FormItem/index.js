import React, {Component} from "react";
import {DatePicker, Form, Input, Select, Switch} from "antd";
import deepEqual from 'deep-equal'

const {Option} = Select
const {TextArea} = Input

export default class FormItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: props.record || {}
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {record} = nextProps
        if (!deepEqual(record, this.props.record)) {
            this.setState({record})
        }
    }

    renderFormItem() {
        const {form} = this.props
        const {record} = this.state
        const {optionList, type, params,} = record
        switch (type) {
            case 'select':
                return <Select {...params}>
                    {
                        optionList && optionList.length ?
                            optionList.map(option => {
                                return <Option value={option.id} key={option.id}>{option.name}</Option>
                            }) : void (0)
                    }
                </Select>
            case 'date':
                return <DatePicker style={{width: '100%'}} {...params}/>
            case 'textarea':
                return <TextArea {...params}/>
            case 'switch':
                return <Switch {...params}/>
            default:
                return <Input {...params}/>
        }
    }

    render() {
        const {record} = this.state
        return <Form.Item label={record.label} name={record.name} rule={record.rule}>
            {this.renderFormItem()}
        </Form.Item>
    }
}