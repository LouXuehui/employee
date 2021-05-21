import {Input, Select, Switch} from "antd";
import React from "react";

export default function renderFormItem(props) {
    const {optionList, type, params} = props
    switch (type) {
        case 'select':
            return <Select {...params}>
                {
                    optionList && optionList.length ? optionList.map(option => {
                        return <Option key={option.id} value={option.id}>{option.label}</Option>
                    }) : void (0)
                }
            </Select>
        case 'switch':
            return <Switch {...params}/>
        default:
            return <Input {...params}/>
    }
}