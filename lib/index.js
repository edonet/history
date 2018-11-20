/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-10 18:15:36
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import compose from 'utify/compose';
import assign from 'utify/assign';
import HashHistory from './history';
import matchPath from './match';
import resolvePath from './resolve';


/**
 *****************************************
 * 创建历史对象
 *****************************************
 */
const history = new HashHistory();


/**
 *****************************************
 * 定义创建实例函数
 *****************************************
 */
function createInstance(proto, context = '/') {
    let resolve = resolvePath(context);

    // 生成实例
    return assign(proto, {
        resolve,
        push(path, state) {
            return proto.push(resolve(path), state);
        },
        replace(path, state) {
            return proto.replace(resolve(path), state);
        },
        setContext(path) {
            return createInstance(proto, path);
        }
    });
}


/**
 *****************************************
 * 创建实例
 *****************************************
 */
export default createInstance({
    get method() {
        return history.$$route && history.$$route.method;
    },
    get histories() {
        return history.$$routes.slice(0, history.$$index + 1);
    },
    get state() {
        return history.$$route;
    },
    get length() {
        return history.$$index + 1;
    },
    get url() {
        return history.$$route && history.$$route.url;
    },
    get query() {
        return history.$$route && history.$$route.query;
    },
    get params() {
        return history.$$params;
    },
    push(...args) {
        return history.push(...args);
    },
    replace(...args) {
        return history.replace(...args);
    },
    reload() {
        return history.reload();
    },
    go(...args) {
        return history.go(...args);
    },
    back(state) {
        return history.go(-1, state);
    },
    forward(state) {
        return history.go(1, state);
    },
    canGo(...args) {
        return !!history.canGo(...args);
    },
    match(path, callback) {
        let match = matchPath(path);

        // 监听变更
        if (callback) {
            let resolve = compose(callback, match, route => route.url);

            // 匹配当前结果
            history.$$route && resolve(history.$$route);

            // 添加监听
            history.on('notify', resolve);

            // 返回取消函数
            return () => history.off('notify', resolve);
        }

        // 返回匹配结果
        return history.$$route && match(history.$$route.url);
    },
    ready(callback) {

        // 加载完成
        if (history.$$route) {
            return callback && callback.call(history, history.route);
        }

        // 添加监听
        history.once('ready', callback);
    },
    block(callback) {

        // 添加监听
        history.on('block', callback);

        // 取消监听
        return () => history.off('block', callback);
    },
    subscribe(callback) {

        // 添加监听
        history.on('notify', callback);

        // 取消监听
        return () => history.off('notify', callback);
    }
});
