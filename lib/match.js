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

        // 处理非根路径匹配
        if (pathname !== '/') {

            // 匹配路径
            if (path !== pathname) {
                let origin = pathname.split('/'),
                    target = path.split('/'),
                    len = target.length,
                    params = {},
                    url = [],
                    idx = 0;

                // 超出匹配范围
                if (origin.length < len) {
                    return null;
                }

                // 遍历路径
                for (; idx < len; idx ++) {
                    let name = target[idx],
                        val = origin[idx];

                    // 处理参数匹配
                    if (val !== name) {

                        // 匹配失败
                        if (name[0] !== ':') {
                            return null;
                        }

                        // 获取参数
                        params[name.slice(1)] = val;
                    }

                    // 添加字段
                    url.push(val);
                }

                // 拼接路径
                url = url.join('/');

                // 返回匹配结果
                return { url, path, isExact: url === pathname, params };
            }

            // 完全匹配
            return { url: path, path, isExact: true, params: {} };
        }

        // 无法匹配
        return null;
    }

    // 返回匹配结果
    return {
        url: '/', path, isExact: pathname === '/', params: {}
    };
}

