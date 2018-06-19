/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-15 16:16:50
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 历史记录对象
 *****************************************
 */
export default class Histories {

    /* 初始化历史记录 */
    constructor(...list) {
        this.id = 0;
        this.index = 0;
        this.list = list;
        this.cache = {};
    }

    /* 获取状态 */
    get state() {

        // 使用缓存
        if (this.id !== this.cache.id) {
            let idx = this.index,
                length = idx + 1,
                histories = this.list.slice(0, length);

            // 生成缓存
            this.cache = {
                id: this.id,
                state: { ...this.list[idx], histories, length }
            };
        }

        // 返回状态
        return this.cache.state;
    }

    /* 添加记录 */
    push(state) {
        this.id ++;
        this.index ++;
        this.list[this.index] = state;
        this.list.length = this.index + 1;
    }

    /* 替换记录 */
    replace(state) {
        this.id ++;
        this.list[this.index] = state;
    }

    /* 跳转步数 */
    go(step = -1) {
        this.id ++;
        this.index = Math.max(0, Math.min(this.list.length - 1, this.index + step));
    }

    /* 跳转到状态 */
    goTo(index) {
        this.id ++;
        this.index = Math.max(0, Math.min(this.list.length - 1, index));
    }

    /* 遍历记录 */
    forEach(cb) {
        let list = this.list,
            idx = this.index,
            len = list.length,
            step = Math.max(idx + 1, len - idx),
            i = 1;

        // 就近遍历
        for (; i < step; i ++) {
            let curr = idx - i;

            // 处理前一记录
            if (curr > -1) {
                if (cb(list[curr], curr, this) === false) {
                    return true;
                }
            }

            // 获取后一记录
            curr = idx + i;

            // 处理后一记录
            if (curr < len) {
                if (cb(list[curr], curr, this) === false) {
                    return true;
                }
            }
        }
    }
}
