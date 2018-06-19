/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-19 16:58:50
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 匹配路径
 *****************************************
 */
export default function matchPath(path, pathname = '/') {

    // 处理匹配
    if (path !== '/') {
        let origin = pathname === '/' ? [''] : pathname.split('/'),
            url = [],
            params = {};


        // 遍历路径
        each(path, (name, idx) => {
            let val = origin[idx];

            // 判断是否匹配
            if (name !== val) {
                if (name[0] !== ':') {
                    return false;
                }

                // 获取参数
                params[name.slice(1)] = val;
            }

            // 添加匹配字段
            url.push(val);
        });

        // 拼接路径
        url = url.join('/');

        // 返回匹配结果
        return {
            url, path, isExact: url === pathname, params
        };
    }

    // 返回匹配结果
    return {
        url: '/', path, isExact: pathname === '/', params: {}
    };
}


/**
 *****************************************
 * 遍历路径
 *****************************************
 */
function each(path, callback) {
    let arr = path.split('/'),
        len = arr.length,
        i = 0;

    // 遍历对象
    for (; i < len; i ++) {
        if (callback(arr[i], i) === false) {
            return false;
        }
    }

    // 遍历完成
    return true;
}
