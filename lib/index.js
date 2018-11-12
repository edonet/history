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
import HashHistory from './history';


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default function createHashHistory() {
    let history = new HashHistory();

    // 返回接口
    return {
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
        },
        destroy() {
            history = history.destroy();
        }
    };
}
