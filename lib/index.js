/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-15 16:08:25
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import History from './history';


/**
 *****************************************
 * 定义路由对象
 *****************************************
 */
export default function createHistory(options) {
    let history = new History(options);

    // 返回接口
    return {
        get state() {
            return history.state;
        },
        subscribe: cb => history.subscribe(cb),
        destroy: () => history.destroy()
    };
}
