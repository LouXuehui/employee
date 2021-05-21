import alert from "@/common/alert";

export function getValueByKey(list, value, inputKey, outputKey = "name") {
    let tempList = list ? JSON.parse(JSON.stringify(list)) : []
    for (let temp of tempList) {
        if (value === temp[inputKey]) {
            return temp[outputKey]
        }
    }
    return ''
}

//获取字符串实际长度（中英文)
export function getStringLength(str) {
    let realLength = 0, len = str.length, charCode = -1;
    for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128)
            realLength += 1
        else
            realLength += 2
    }
    return realLength
}

//设置cookie
export function setCookie(name, value, day) {
    let date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
};

//获取cookie
export function getCookie(name) {
    let reg = RegExp(name + '=([^;]+)');
    let arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
};

//删除cookie
export function delCookie(name) {
    setCookie(name, null, -1);
};

//精准计算年龄
export function displayAge(birth, target) {
    let months = target.diff(birth, 'months', true)
    let birthSpan = {
        year: Math.floor(months / 12),
        month: Math.floor(months) % 12,
        day: Math.round((months % 1) * target.daysInMonth(), 0)
    }
    if (birthSpan.year < 1 && birthSpan.month < 1) {
        return birthSpan.day + ' day' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 1) {
        return birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : ' ') + birthSpan.day + ' day' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 2) {
        return birthSpan.year + ' year' + (birthSpan.year > 1 ? 's ' : ' ') + birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : '')
    } else {
        return birthSpan.year + ' year' + (birthSpan.year > 1 ? 's' : '')
    }
}

export function moneyFormat(money) {
    let title = money ? money > 10000 ? money / 10000 + '万元' : money + '元' : '-'
    return title
}

//金额转换
export function moneyFormat2(money) {
    let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    let cnIntLast = "元"; //整型完以后的单位
    let maxNum = 999999999999999.9999; //最大处理的数字

    let ChineseStr = ""; //输出的中文金额字符串
    let parts; //分离金额后用的数组，预定义

    if (money == "" || !money) {
        return "";
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        alert('超出最大处理数字', {code: 0});
        return "";
    }
    if (money == 0) {
        ChineseStr = money + cnIntLast;
        return ChineseStr
    }
    money = money.toString(); //转换为字符串
    let IntegerNum = ''
    let DecimalNum = ''
    if (money.indexOf(".") == -1) {
        IntegerNum = money
    } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1];
    }
    let p = IntegerNum.length / 4
    if (p > 1) {
        let num = parseInt(IntegerNum) / (Math.floor(p) * 10000)
        num = num.toString()
        ChineseStr = `${num}${DecimalNum}${cnIntUnits[Math.floor(p)]}` + cnIntLast;
    } else {
        ChineseStr = money + cnIntLast;
    }
    return ChineseStr;
}

export const sexCode = [
    {id: '1', name: '男'},
    {id: '0', name: '女'},
]
