/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-10 18:10:46
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import qs from 'qs';
import EventEmitter, { createEvent } from '@arted/utils/events';


/**
 *****************************************
 * 创建历史对象
 *****************************************
 */
export default class HashHistory extends EventEmitter {

    /* 初始化对象 */
    constructor() {
        super();

        // 获取路径
        this.url = location.href.split('#')[0];
        this.queue = [];

        // 获取当前路由
        this.route = this.createRoute();

        // 绑定事件
        this.$$unbind = this.bind();
    }

    /* 替换路径 */
    replace(path = '', query = null) {

        // 拼接路径
        if (query && typeof query === 'object') {
            path += (path.indexOf('?') > -1 ? '&' : '?') + qs.stringify(query);
        }

        // 替换路径
        location.replace(this.url + '#' + path);
    }

    /* 创建路由 */
    createRoute(path = location.hash.slice(1)) {

        // 重载函数
        if (!path) {
            this.replace('/');
            return this.createRoute();
        }


        console.log(path);
    }

    /* 监听状态变更 */
    handleHashChange(event) {
        let state = this.queue.shift(),
            route;

        if (!state || !state.ignore) {
            this.dispatch('update', route);
        }
        console.log(event);
    }

    /* 绑定监听事件 */
    bind() {
        let listener = event => this.handleHashChange(event);

        // 添加监听
        window.addEventListener('hashchange', listener);

        // 取消监听
        return () => {
            window.removeEventListener('hashchange', listener);
        };
    }

    /* 订阅回调 */
    subscribe(callback) {

        // 添加监听
        this.on('update', callback);

        // 取消监听
        return () => this.off('update', callback);
    }

    /* 销毁对象 */
    destroy() {
        this.$$unbind = this.$$unbind && this.$$unbind();
    }
}
    