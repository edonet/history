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
export default function matchPath(path) {

    // 解析路径
    if (path && path.charAt(0) === '/') {
        let matches = resolvePath(path),
            start;

        // 参数匹配
        if (matches.size) {
            return resolveMatch(matches);
        }

        // 匹配前缀
        start = path.endsWith('/') ? path : path + '/';

        // 生成配置函数
        return function match(url) {
            let isExact = url === path;

            if (isExact || url.startsWith(start)) {
                return {
                    url,
                    path,
                    isExact,
                    params: {}
                };
            }
        };
    }

    // 非法路径
    return () => null;
}


/**
 *****************************************
 * 获取配置项
 *****************************************
 */
function resolvePath(path) {
    let matches = new Set();

    // 遍历路由
    path.split('/').map(route => {
        if (route.startsWith(':')) {
            let required = !route.endsWith('?'),
                key = required ? route.slice(1) : route.slice(1, -1);

            // 返回匹配项
            return matches.add((name, params) => {

                // 获取参数
                params[key] = name;

                // 返回匹配是否成功
                return name || !required;
            });
        }

        // 路由匹配
        return matches.add(name => name === route);
    });

    // 返回结果
    return matches;
}


/**
 *****************************************
 * 匹配链接
 *****************************************
 */
function resolveMatch(matches) {
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

