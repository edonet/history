/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-20 14:12:00
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 拦截事件
 *****************************************
 */
export default function block({ test, callback }) {

    // 处理匹配条件
    if (test && test !== '*') {

        // 字符串匹配
        if (typeof test === 'string') {

            // 泛匹配
            if (test.endsWith('*')) {

                // 更新匹配字符
                test = test.slice(0, -1);

                // 添加事件
                return (location, action) => (
                    location.pathname.startsWith(test) ? callback(location, action) : undefined
                );
            }

            // 完全匹配
            return (location, action) => {
                return location.pathname === test ? callback(location, action) : undefined;
            };
        }

        // 正则匹配
        if ('test' in test) {
            return (location, action) => (
                test.test(location.pathname) ? callback(location, action) : undefined
            );
        }
    }

    // 添加事件
    return callback;
}
