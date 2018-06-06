/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-06 11:45:49
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import createHashHistory from 'history/createHashHistory';


/**
 *****************************************
 * 创建历史对象
 *****************************************
 */
export default function createHistory(options, history) {
    let model = {
            id: + new Date(),
            pathname: '',
            histories: [],
            listeners: [],
            location: null,
            state: null
        },
        unlisten;

    // 创建历史对象
    if (!history) {
        history = createHashHistory(options);
    }

    console.log(history);

    // 监听历史变更
    unlisten = history.listen((location, action) => {
        console.log(location, action);

        if (!location.search) {
            history.replace(location.pathname + '?' + (model.id ++));
        }

        console.log(model.location === location);

        if (!model.location && location.pathname === '/index') {
            model.location = location;
        }
    });

    // 返回接口
    return {
        destroy() {
            unlisten = unlisten && unlisten() && null;
        }
    };
}


createHistory();
