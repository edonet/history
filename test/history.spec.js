/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-06 11:48:18
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载模块
 *****************************************
 */
import createMemoryHistory from 'history/createMemoryHistory';
import createHistory from '../lib';


/**
 *****************************************
 * 测试模块
 *****************************************
 */
describe('测试【history】模块', () => {
    let history;

    // 测试前处理
    beforeEach(() => {
        history = createHistory({}, createMemoryHistory());
    });

    // 创建【history】
    test('创建【history】', () => {
        console.log(history);
    });
});
