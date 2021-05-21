export function findIndexById(arr, id, idName = 'id') {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][idName] === id) {
            return i
        }
    }
    return -1
}

/**
 * 通过id来寻找索引
 * @param id
 * @param idName
 * @returns {number}
 */
Array.prototype.findIndexById = function (id, idName = 'id') {
    for (let i = 0; i < this.length; i++) {
        if (this[i][idName] === id) {
            return i
        }
    }
    return -1
}

/**
 * 通过id找到该对象
 * @param id
 * @param idName
 * @returns {*}
 */
Array.prototype.findById = function (id, idName = 'id') {
    return this[this.findIndexById(id, idName)]
}

/**
 * 对于数组元素为object的,通过id排序
 * @param order
 * @param idName
 */
Array.prototype.sortById = function (order = 'asc', idName = 'id') {
    var _arg = arguments
    const getSort = function (order, sortBy) {
        var ordAlpha = (order === 'asc') ? true : false

        function sort(a, b) {
            var sortResult
            if (typeof a[sortBy] == 'string') {
                if (!!a[sortBy]) {
                    sortResult = a[sortBy].localeCompare(b[sortBy])
                } else {
                    sortResult = -1
                }

                if (sortResult === 0 && _arg.length > 2) {
                    let i = 2
                    while (i < _arg.length) {
                        if (sortResult === 0) {
                            if (!!a[_arg[i]]) {
                                sortResult = a[_arg[i]].localeCompare(b[_arg[i]])
                            } else {
                                sortResult = -1
                            }
                        }
                        i++
                    }
                }
                if ((!ordAlpha) && sortResult !== 0) {
                    sortResult = -sortResult
                }
            } else if (typeof a[sortBy] == 'number') {
                if (a[sortBy] === b[sortBy]) {
                    sortResult = 0
                    if (_arg.length > 2) {
                        let i = 2
                        while (i < _arg.length) {
                            if (sortResult === 0) {
                                if (a[_arg[i]] === b[_arg[i]]) {
                                    sortResult = 0
                                } else {
                                    sortResult = a[_arg[i]] > b[_arg[i]]
                                    if (!ordAlpha) sortResult = !sortResult
                                    sortResult = sortResult ? 1 : -1
                                }
                            }
                            i++
                        }
                    }
                } else {
                    sortResult = a[sortBy] > b[sortBy]
                    if (!ordAlpha) sortResult = !sortResult
                    sortResult = sortResult ? 1 : -1
                }
            }
            return sortResult
        }

        return sort;
    }
    return this.sort(getSort(order, idName))
}

/**
 *判断数组中是否有某个元素,根据ID标示
 * @param id
 * @param idName
 * @returns {boolean}
 */
Array.prototype.hasItem = function (item, idName = 'id') {
    const id = typeof item == 'string' ? item : item[idName]
    return this.findIndexById(id, idName) > -1
}

/**
 * 对数组进行去重
 * @param idName
 * @returns arr 新数组
 */
Array.prototype.unique = function (idName = 'id') {
    let arr = [];
    for (let i = 0; i < this.length; i++) {
        if (i == 0) arr.push(this[i])
        let b = false
        if (this.length > 0 && i > 0) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[j][idName] === this[i][idName]) {
                    b = true
                }
            }
            if (!b) {
                arr.push(this[i])
            }
        }
    }
    return arr
}

/**
 * 得到两个数组的差集,
 * @param x 两个数组中数据较多的那一个
 * @param y 反之,两个数组中数据较少的那一个
 * @returns clone 得到一个新数组
 */
Array.minus = function (x, y) {
    let clone = x.slice(0)
    for (let i = 0; i < y.length; i++) {
        let temp = y[i];
        for (let j = 0; j < clone.length; j++) {
            if (temp.id === clone[j].id) {
                clone.splice(j, 1)
            }
        }
    }
    return clone
}

/**
 * 判断数组中是否有某一项元素,
 * @param item
 * @returns {boolean}
 */
Array.prototype.has = function (item) {
    return this.indexOf(item) > -1
}

/**
 * 根据id来删除数组中的某一项
 * @param id
 * @param idName
 */
Array.prototype.removeById = function (id, idName = 'id') {
    const index = this.findIndexById(id, idName)
    this.splice(index, 1)
    return this
}

/**
 * 根据id更新数组中的某一项
 * @param item
 * @param idName
 * @returns {Array}
 */
Array.prototype.updateById = function (item, idName = 'id') {
    this[this.findIndexById(item[idName], idName)] = item
    return this
}

/**
 * 根据id获取某一项并移除
 * @param id
 * @param idName
 */
Array.prototype.takeById = function (id, idName = 'id') {
    const item = this.findById(id, idName)
    this.removeById(id, idName)
    return item
}
