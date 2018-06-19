/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-19 17:37:30
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载模块
 *****************************************
 */
import matchPath from '../lib/match';


/**
 *****************************************
 * 测试模块
 *****************************************
 */
describe('测试【match】', () => {
    test('测试匹配路径', () => {

        // 默认配置根路径
        expect(matchPath('/')).toEqual({ url: '/', path: '/', isExact: true, params: {} });
        expect(matchPath('/index')).toBeNull();

        // 配置路径
        expect(matchPath('/', '/index')).toEqual({ url: '/', path: '/', isExact: false, params: {} });
        expect(matchPath('/index', '/index')).toBeNull();
    });
});
