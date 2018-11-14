/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-14 10:08:13
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析路径
 *****************************************
 */
export default function resolvePath(path) {
    let keys = [],
        matches = [];

    // 非法路径
    if (!path || path.charAt(0) !== '/') {
        return () => null;
    }

    // 创建路由
    path.split('/').forEach(route => {

        // 变量匹配
        if (route.startsWith(':')) {
            let required = route.endsWith('?'),
                key = required ? route.slice(1, -1) : route.slice(1);

            // 添加字段
            keys.push(key);

            // 返回匹配项
            return matches.push((name, params) => {
                if (!required || name) {
                    return params[key] = name;
                }
            });
        }

        // 路由匹配
        return matches.push(name => name === route);
    });

    // 返回匹配函数
    return (
        keys.length ?
        matchPath(matches) :
        function match(url) {
            if (url.startsWith(path.endsWith('/') ? path : path + '/')) {
                return {
                    url,
                    path,
                    isExact: url === path,
                    params: {}
                };
            }
        }
    );
}


/**
 *****************************************
 * 匹配链接
 *****************************************
 */
export function matchPath(matches) {
    return function match(url) {
        let arr = url.split('/'),
            path = [],
            params = {};

        // 无法匹配父级
        if (matches.length > arr.length) {
            return null;
        }

        // 遍历路由
        for (let match of matches) {
            let value = arr.shift();

            // 匹配失败
            if (!match(value, params)) {
                return null;
            }

            // 添加路由
            path.push(value);
        }

        // 拼接结果
        path = path.join('/');

        // 返回结果
        return {
            url,
            path,
            isExact: url === path,
            params
        };
    };
}
