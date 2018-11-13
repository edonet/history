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
import EventEmitter from '@arted/utils/events';


/**
 *****************************************
 * 创建历史对象
 *****************************************
 */
export default class HashHistory extends EventEmitter {

    /* 初始化对象 */
    constructor() {
        super();

        // 定义属性
        this.$$history = window.history;
        this.$$length = window.history.length;
        this.$$index = 0;
        this.$$route = null;
        this.$$routes = [];
        this.$$path = location.href.split('#')[0];
        this.$$params = qs.parse(location.search || '');
        this.$$payload = null;

        // 绑定事件
        this.$$unbind = this.bind();

        // 初始化
        this.init();
    }

    /* 替换路径 */
    replace(path, state) {
        let route = { ...this.createState(path, state), method: 'REPLACE' },
            url = this.$$route ? this.$$route.url : '';

        // 开始跳转
        if (route.url !== url && this.dispatch('block', route)) {

            // 创建状态
            this.$$payload = route;

            // 替换路径
            location.replace(this.$$payload.href);

            // 跳转成功
            return true;
        }

        // 跳转失败
        return false;
    }

    /* 跳转路径 */
    push(path, state) {
        let route = { ...this.createState(path, state), method: 'PUSH' },
            url = this.$$route ? this.$$route.url : '';

        // 开始跳转
        if (route.url !== url && this.dispatch('block', route)) {

            // 创建状态
            this.$$payload = route;

            // 跳转路径
            location.href = this.$$payload.href;

            // 跳转成功
            return true;
        }

        // 跳转失败
        return false;
    }

    /* 重新加载 */
    reload() {
        let route = { ...this.$$route, event: 'reload', method: 'REPLACE' };

        // 开始跳转
        if (this.dispatch('block', route)) {

            // 创建状态
            this.$$payload = route;

            // 更新路由
            this.handleHashChange();

            // 跳转成功
            return true;
        }

        // 跳转失败
        return false;
    }

    /* 前往路径 */
    go(step = -1, state) {
        let route = this.canGo(step);

        // 判断是否能处理
        if (route) {
            route = { ...route, ...state, method: step > 0 ? 'PUSH' : 'POP' };

            // 开始跳转
            if (this.dispatch('block', route)) {

                // 创建状态
                this.$$payload = route;

                // 跳转路径
                this.$$history.go(route.index - this.$$index);

                // 跳转成功
                return true;
            }
        }

        // 跳转失败
        return false;
    }

    /* 判断是否可以跳转 */
    canGo(step) {
        return step ? this.$$routes[this.$$index + step] : null;
    }

    /* 初始化 */
    init() {
        let url = location.hash.slice(1);

        // 初始化路由
        if (!url) {
            return this.replace('/', { event: 'ready' });
        }

        // 创建状态
        setTimeout(() => {
            this.$$payload = this.createState(url, { event: 'ready', method: 'REPLACE' });

            // 更新路由
            this.handleHashChange();
        }, 0);
    }

    /* 创建路由状态 */
    createState(url = '', { query = {}, ...state } = {}) {
        let [path, queryString = ''] = url.split('?');

        // 分离参数
        if (queryString) {
            query = { ...qs.parse(queryString), ...query };
        }

        // 更新属性
        state.path = path;
        state.query = query;
        state.queryString = qs.stringify(query);
        state.url = state.queryString ? path + '?' + state.queryString : path;
        state.href = this.$$path + '#' + state.url;

        // 返回状态
        return state;
    }

    /* 创建路由 */
    createRoute() {
        let url = location.hash.slice(1),
            route = this.$$payload;

        // 处理路由方式
        if (!route || route.url !== url) {
            let prev = this.$$routes[this.$$index - 1] || {};

            // 生成路由
            route = {
                block: true,
                method: prev.url === url ? 'POP' : 'PUSH',
                ...this.createState(url)
            };
        }

        // 清空数据
        this.$$payload = null;

        // 返回结果
        return route === this.$$route ? null : route;
    }

    /* 监听状态变更 */
    handleHashChange() {
        let next = this.createRoute();

        // 判断是否需要更新
        if (next) {
            let { event, block, notify = true, ...route } = next,
                len = this.$$history.length,
                method = route.method;

            // 更新历史记录
            if (this.$$length !== len) {
                this.$$length = len;
                this.$$routes = this.$$routes.slice(0, len);
                this.$$routes[len] = { ...route, index: len };
            }

            // 执行拦截事件
            if (block && !this.dispatch('block', route)) {

                // 指定当前状态
                this.$$payload = this.$$route;

                // 更新路由
                if (method === 'REPLACE') {
                    return location.replace(this.$$route.href);
                } else {
                    return this.$$history.go(method === 'PUSH' ? -1 : 1);
                }
            }

            // 执行自定义事件
            event && this.emit(event, route);

            // 添加位置
            if (!('index' in route)) {
                route.index = this.$$index + (method === 'REPLACE' ? 0 : method === 'POP' ? -1 : 1);
            }

            // 更新状态
            this.$$index = route.index;
            this.$$route = route;
            this.$$routes[this.$$index] = route;

            // 触发更新
            notify && this.emit('notify', route);
        }
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

    /* 销毁对象 */
    destroy() {

        // 清空事件
        this.emit('destroy');
        this.off();

        // 清除属性
        this.search = null;

        // 清除私有属性
        this.$$history = null;
        this.$$length = null;
        this.$$index = null;
        this.$$route = null;
        this.$$routes = null;
        this.$$path = null;
        this.$$payload = null;
        this.$$unbind = this.$$unbind && this.$$unbind();
    }
}
