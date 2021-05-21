import axios from 'axios'
import EventEmitter from 'events'

//引入全局的东西
import 'moment/locale/zh-cn'
import './global.less'
window.ee = new EventEmitter()

export function config() {
    return {
        onError(err) {
            err.preventDefault();
        },
        initialState: {
            global: {
                text: 'hi umi + dva',
            },
        },
    };
}

