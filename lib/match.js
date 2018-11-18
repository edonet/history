/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-18 15:27:34
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析路径
 *****************************************
 */
export default function match(path) {

    // 判断路径合法
    if (path && path.startsWith('/')) {
        let exact = !path.endsWith('/'),
            resolve = resolvePath({ path, exact });

        // 使用参数匹配
        if (resolve) {
            return url => matchPath(resolve(url))(url);
        }

        // 路径匹配
        return matchPath({ path, exact, params: {} });
    }

    // 匹配失败
    return () => null;
}


/**
 *****************************************
 * 解析参数
 *****************************************
 */
function resolvePath({ path, exact }) {
    let routes = path.split('/'),
        matches = [];

    // 获取参数
    routes.forEach((route, index) => {
        if (route.startsWith(':')) {
            let required = !route.endsWith('?'),
                key = required ? route.slice(1) : route.slice(1, -1);

            // 返回匹配项
            matches.push({ index, key, required });
        }
    });

    // 存在参数匹配
    if (matches.length) {
        return function matchParams(url) {
            let arr = url.split('/'),
                params = {};

            // 匹配失败
            if (arr.length < routes.length) {
                return {};
            }

            // 获取参数
            for (let { index, key, required } of matches) {
                let value = arr[index];

                // 匹配失败
                if (required && !value) {
                    return {};
                }

                // 更新路由
                routes[index] = value;
                params[key] = value;
            }

            // 返回结果
            return { path: routes.join('/'), exact, params };
        };
    }
}


/**
 *****************************************
 * 匹配路径
 *****************************************
 */
function matchPath({ path, exact, params }) {
    return function match(url) {
        if (url && path) {
            if (exact) {
                if (path === url) {
                    return {
                        url, path, params, isExact: true
                    };
                }
            } else {
                if (url.startsWith(path)) {
                    return {
                        url, path, params, isExact: url === path
                    };
                }
            }
        }

        // 匹配失败
        return null;
    };
}
