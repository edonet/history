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

    /* 测试匹配路径 */
    test('测试匹配路径', () => {

        // 默认配置根路径
        expect(matchPath('/')('/')).toEqual({ url: '/', path: '/', isExact: true, params: {} });
        expect(matchPath('/index')('/')).toBeNull();

        // 配置路径
        expect(matchPath('/')('/index')).toEqual({ url: '/index', path: '/', isExact: false, params: {} });
        expect(matchPath('/index')('/index')).toEqual({ url: '/index', path: '/index', isExact: true, params: {} });
        expect(matchPath('/index')('/index/user')).toBeNull();
        expect(matchPath('/index/')('/index/user')).toEqual({ url: '/index/user', path: '/index/', isExact: false, params: {} });
        expect(matchPath('/index/user')('/index')).toBeNull();
    });

    /* 测试匹配路径参数 */
    test('测试匹配路径参数', () => {

        // 获取参数
        expect(matchPath('/index/:id')('/index')).toBeNull();
        expect(matchPath('/index/:id')('/index/user')).toEqual({
            url: '/index/user', path: '/index/user', isExact: true, params: { id: 'user' }
        });
        expect(matchPath('/index/:id')('/index/user/info')).toBeNull();
        expect(matchPath('/index/:id/')('/index/user/info')).toEqual({
            url: '/index/user/info', path: '/index/user/', isExact: false, params: { id: 'user' }
        });
        expect(matchPath('/index/:id/:id')('/index/user/info')).toEqual({
            url: '/index/user/info', path: '/index/user/info', isExact: true, params: { id: 'info' }
        });
        expect(matchPath('/index/:id/:name')('/index/user/info')).toEqual({
            url: '/index/user/info', path: '/index/user/info', isExact: true, params: { id: 'user', name: 'info' }
        });
        expect(matchPath('/index/:id/:name')('/index//info')).toBeNull();
        expect(matchPath('/index/:id?/:name')('/index//info')).toEqual({
            url: '/index//info', path: '/index//info', isExact: true, params: { id: '', name: 'info' }
        });
    });
});
