/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-19 10:55:11
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析路径
 *****************************************
 */
export default function resolvePath(context = '/') {
    let base = context === '/' ? [''] : context.split('/');

    // 移除空元素
    if (!base[0]) {
        base = base.slice(1);
    }

    // 返回解析函数
    return function resolve(...args) {
        let path = args.reduce((res, curr) => {

                // 合并路径
                if (curr && typeof curr === 'string') {
                    return curr.charAt(0) === '/' ? curr : res + '/' + curr;
                }

                // 返回路径
                return res;
            }, './'),
            res = path[0] === '/' ? [] : base.slice(0),
            count = 0;


        // 分离路径
        path.split('/').forEach(curr => {
            if (curr && curr !== '.') {
                if (curr === '..') {
                    res.length ? res.pop() : count --;
                } else {
                    count < 0 ? count ++ : res.push(curr);
                }
            }
        });

        // 拼合路径
        return res[0] ? '/' + res.join('/') : res.join('/') || '/';
    };
}
