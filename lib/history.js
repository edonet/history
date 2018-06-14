/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-14 15:11:50
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import createHashHistory from 'history/createHashHistory';
import qs from 'qs';


/**
 *****************************************
 * 创建历史对象
 *****************************************
 */
export default class History {

    /* 初始化对象 */
    constructor(options) {

        // 生成对象
        this.history = createHashHistory(options);
        this.uuid = + new Date();
        this.index = 0;
        this.method = 'REPLACE';
        this.pathname = this.history.location.pathname;
        this.histories = [this.pathname];
        this.listeners = [];
        this.task = new Map();

        // 监听历史变更
        this.unlisten = this.history.listen((location, action) => {
            let { id, query } = this.parseSearch(location.search),
                state;

            // 不存在路由【id】
            if (!id) {
                return this.replaceState({ ...location, action, method: action });
            }

            // 获取参数
            if (!location.query) {
                location.query = query;
            }

            // 获取行为
            if (!location.action) {
                location.action = action;
            }

            // 更新历史记录
            this.updateHistories(location);

            // 获取状态
            state = this.state;

            // 执行回调
            this.listeners.forEach(cb => cb(state));
        });

        // 初始化状态
        this.replaceState(this.history.location);
    }

    /* 获取状态 */
    get state() {
        let idx = this.index,
            length = idx + 1,
            histories = this.histories.slice(0, length),
            { pathname, query, hash } = histories[idx];

        // 返回状态
        return {
            method: this.method,
            pathname,
            histories,
            length,
            query,
            hash
        };
    }

    /* 监听历史记录变更 */
    subscribe(cb) {

        // 添加监听
        this.listeners.push(cb);

        // 返回移除函数
        return () => {
            this.listeners = this.histories.filter(x => x !== cb);
        };
    }

    /* 替换状态 */
    replaceState({ pathname, search, hash, action = 'REPLACE', method = action }) {
        let id = this.uuid ++;

        // 更新状态
        this.history.replace({
            id,
            action,
            method,
            pathname,
            search: `?$uuid=${ id }`,
            query: this.parseSearch(search).query,
            hash
        });
    }

    /* 更新历史记录 */
    updateHistories({ action, method, ...state }) {
        switch (action) {
            case 'PUSH':
                this.index ++;
                this.method = method || action;
                this.histories[this.index] = state;
                this.histories.length = this.index + 1;
                break;
            case 'REPLACE':
                this.method = method || action;
                this.histories[this.index] = state;
                break;
            default:
                break;
        }
    }

    /* 获取状态 */
    getStateById(id) {
        let idx = this.index,
            histories = this.histories,
            matched = null,
            step = 1,
            find;

        // 定义查找方法
        find = (index, method) => {
            let state = histories[index];

            if (state) {
                if (state.id === id) {
                    matched = { index, method, state };
                    return -2;
                }

                return 1;
            }

            return 0;
        };


        // 查找配置
        do {
            if (find(idx - step, 'POP') + find(idx + step, 'PUSH') < 1) {
                break;
            }
        } while (step ++);

        // 返回配置
        return matched;
    }

    /* 获取参数 */
    parseSearch(search) {
        let query = qs.parse(search.replace('?', '')),
            id = query.$uuid;

        // 移除【uuid】
        delete query.$uuid;
        return { id, query };
    }

    /* 销毁对象 */
    destroy() {
        this.history = null;
        this.histories = null;
        this.listeners = null;
    }
}
