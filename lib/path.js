/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-13 16:23:27
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析路径
 *****************************************
 */
export function parse(path) {
    let idx = path.indexOf('#'),
        search = '',
        hash = '';

    // 分割【hash】
    if (idx > -1) {
        hash = path.slice(idx + 1);
        path = path.slice(0, idx);
    }

    // 查找【search】
    idx = path.indexOf('?');

    // 分割【search】
    if (idx > -1) {
        search = path.slice(idx + 1);
        path = path.slice(0, idx);
    }

    // 返回结果
    return {
        pathname: path,
        search,
        hash
    };
}


/**
 *****************************************
 * 解析查询参数
 *****************************************
 */
export function query(search) {
    return search.replace('?', '').split('&').reduce((res, str) => {
        let [key, val] = str.split('=');

        // 解析参数
        res[decodeURIComponent(key)] = val ? decodeURIComponent(val) : true;
        return res;
    }, {});
}


/**
 *****************************************
 * 合并路径
 *****************************************
 */
export function stringify({ pathname, search, hash }) {

    // 添加查询参数
    if (search) {
        pathname = [pathname, search].join('?');
    }

    // 添加【hash】
    if (hash) {
        pathname = [pathname, hash].join('#');
    }

    // 返回路径
    return pathname;
}
