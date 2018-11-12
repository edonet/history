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
        this.search = qs.parse(location.search || '');

        // 私有属性
        this.$$history = window.history;
        this.$$length = window.history.length;
        this.$$index = 0;
        this.$$route = null;
        this.$$routes = [];
        this.$$path = location.href.split('#')[0];
        this.$$payload = null;

        // 绑定事件
        this.$$unbind = this.bind();

        // 初始化
        this.init();
    }

    /* 获取跳转方法 */
    get method() {
        return this.state && this.state.method;
    }

    /* 获取历史记录 */
    get histories() {
        return this.$$routes.slice(0, this.$$index + 1);
    }

    // 获取状态
    get state() {
        return this.$$route;
    }

    // 获取路由长度
    get length() {
        return this.$$index + 1;
    }

    /* 替换路径 */
    replace(path, state) {
        let route = { ...this.createState(path, state), method: 'REPLACE' };

        // 开始跳转
        if (this.dispatch('changeStart', route)) {

            // 创建状态
            this.$$payload = route;

            // 替换路径
            location.replace(this.$$payload.href);
        }
    }

    /* 跳转路径 */
    push(path, state) {
        let route = { ...this.createState(path, state), method: 'PUSH' };

        // 开始跳转
        if (this.dispatch('changeStart', route)) {

            // 创建状态
            this.$$payload = route;

            // 跳转路径
            location.href = this.$$payload.href;
        }
    }

    /* 前往路径 */
    go(step = -1, state) {
        let route = this.canGo(step);

        // 判断是否能处理
        if (route) {
            route = { ...route, ...state, method: step > 0 ? 'PUSH' : 'POP' };

            // 开始跳转
            if (this.dispatch('changeStart', route)) {

                // 创建状态
                this.$$payload = route;

                // 跳转路径
                this.$$history.go(this.$$payload.index - this.index);
            }
        }
    }

    /* 判断是否可以跳转 */
    canGo(step) {
        return step ? this.$$routes[step + this.index] : null;
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
            this.$$payload = this.createState(url, {
                event: 'ready',
                method: 'REPLACE'
            });

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
                event: 'changeStart',
                method: prev.url === url ? 'POP' : 'PUSH',
                ...this.createState(url)
            };
        }

        // 清空数据
        this.$$payload = null;

        // 返回结果
        return route;
    }

    /* 监听状态变更 */
    handleHashChange() {
        let { event, notify = true, ...route } = this.createRoute(),
            len = this.$$history.length,
            method = route.method;

        // 更新历史记录
        if (this.$$length !== len) {
            this.$$length = len;
            this.$$routes = this.$$routes.slice(0, len);
            this.$$routes[len] = { ...route, index: len };
        }

        // 执行事件
        if (event && !this.dispatch(event, route)) {
            if (method === 'REPLACE') {
                return this.replace(this.state.url, this.state);
            } else {
                return this.go(method === 'PUSH' ? -1 : 1);
            }
        }

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
        this.on('notify', callback);

        // 取消监听
        return () => this.off('notify', callback);
    }

    /* 销毁对象 */
    destroy() {
        this.$$unbind = this.$$unbind && this.$$unbind();
    }
}
