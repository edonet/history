/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-15 16:02:08
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import createHistory from '../lib';


/**
 *****************************************
 * 创建路由
 *****************************************
 */
let history = createHistory();


console.log(history.state);

history.subscribe(() => {
    console.log(history.state);
});

window.$history = history;
