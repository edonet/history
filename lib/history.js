/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-15 16:24:46
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import qs from 'qs';
import createHashHistory from 'history/createHashHistory';
import createBlock from './block';
import Histories from './histories';


/**
 *****************************************
 * 历史对象
 *****************************************
 */
export default class History {

    /* 初始化对象 */
    constructor(options) {

        // 定义属性
        this.method = 'REPLACE';
        this.history = createHashHistory(options);
        this.histories = new Histories(this.history.location);
        this.listeners = [];
        this.cache = {};

        // 监听历史变更
        this.unlisten = this.history.listen((location, action) => {

            // 解析参数
            if (location.search.length > 1) {
                location.query = qs.parse(location.search.slice(1));
            }

            // 更新历史记录
            this.update(action, location);

            // 执行回调
            this.notify();
        });
    }

    /* 获取状态 */
    get state() {

        // 生成缓存
        if (this.cache.id !== this.histories.id) {
            this.cache = {
                id: this.histories.id,
                state: {
                    method: this.method, ...this.histories.state
                }
            };
        }

        // 返回状态
        return this.cache.state;
    }

    /* 添加状态 */
    go(path, { method = 'PUSH' } = {}) {
        if (this.history) {
            setTimeout(() => {
                this.history.push({ method, ...this.resolvePath(path) });
            }, 0);
            return true;
        }
    }

    /* 替换状态 */
    replace(path, { method = 'REPLACE' } = {}) {
        if (this.history) {
            setTimeout(() => {
                this.history.replace({ method, ...this.resolvePath(path) });
            }, 0);
            return true;
        }
    }

    /* 跳转到路径 */
    goBack(step = -1, { method = 'POP' } = {}) {
        if (this.history) {

            // 查找步数
            if (typeof step === 'string') {
                let { histories, length: idx } = this.histories.state,
                    curr = this.histories.index;

                // 查找状态
                while (idx --) {
                    if (histories[idx].pathname === step) {
                        step = idx - curr;
                        break;
                    }
                }
            }

            // 更新记录
            if (step && typeof step === 'number' && this.histories.canGo(step)) {
                this.method = 'TO:' + method;
                this.histories.go(step);
                this.history.go(step);
                return true;
            }
        }
    }

    /* 添加拦截监听 */
    block(callback) {
        if (this.history && callback) {

            // 添加默认拦截
            if (typeof callback === 'function') {
                return createBlock({
                    test: this.history.location.pathname,
                    history: this.history,
                    callback
                });
            }

            // 添加带条件拦截
            if (typeof callback.callback === 'function') {
                return createBlock({ ...callback, history: this.history });
            }
        }
    }

    /* 解析路径 */
    resolvePath(pathname) {

        // 处理路径
        if (typeof pathname === 'string') {
            let idx = pathname.indexOf('#'),
                search = '',
                hash = '';

            // 分享【hash】
            if (idx > -1) {
                hash = pathname.slice(idx);
                pathname = pathname.slice(0, idx);
            }

            // 查找【search】
            idx = pathname.indexOf('?');

            // 分离【search】
            if (idx > -1) {
                search = pathname.slice(idx);
                pathname = pathname.slice(0, idx);
            }

            // 返回结果
            return { pathname, search, hash };
        }

        // 返回原值
        return pathname;
    }

    /* 更新路由 */
    update(action, { method, ...state }) {
        switch (action) {
            case 'PUSH':
                this.method = method || action;
                this.histories.push(state);
                break;
            case 'REPLACE':
                this.method = method || action;
                this.histories.replace(state);
                break;
            default:
                if (this.method.startsWith('TO:')) {
                    this.method = this.method.slice(3);
                } else {
                    let res = this.histories.forEach((curr, idx) => {
                            if (curr.pathname === state.pathname) {
                                this.method = idx > this.histories.index ? 'PUSH' : 'POP';
                                this.histories.goTo(idx);
                                return false;
                            }
                        });

                    // 添加状态
                    if (!res) {
                        this.method = 'PUSH';
                        this.histories.push(state);
                    }
                }
                break;
        }
    }

    /* 添加监听器 */
    subscribe(cb) {
        if (this.history) {

            // 添加监听
            this.listeners.push(cb);

            // 返回移除函数
            return () => {
                this.listeners = this.listeners.filter(x => x !== cb);
            };
        }
    }

    /* 触发事件回调 */
    notify() {

        // 获取状态
        let state = this.state;

        // 执行回调
        this.listeners.forEach(cb => cb(state));
    }

    /* 销毁对象 */
    destroy() {
        this.method = null;
        this.history = null;
        this.histories = null;
        this.listeners = null;
        this.unlisten = this.unlisten && this.unlisten() && null;
    }
}
