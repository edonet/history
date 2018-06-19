/**
 *****************************************
 * Created by lifx
 * Created on 2018-06-19 11:32:03
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载模块
 *****************************************
 */
import makePathResolver from '../lib/resolve';


/**
 *****************************************
 * 测试模块
 *****************************************
 */
describe('测试【path resolver】', () => {

    /* 测试根路径解析 */
    test('测试根路径解析', () => {
        let resolve = makePathResolver();

        expect(resolve('index')).toBe('/index');
        expect(resolve('./index')).toBe('/index');
        expect(resolve('../index')).toBe('/');
        expect(resolve('../index/user')).toBe('/user');
        expect(resolve('../../index/user')).toBe('/');

        expect(resolve('index', 'about')).toBe('/index/about');
        expect(resolve('index', '/about')).toBe('/about');
        expect(resolve('index', '../about')).toBe('/about');
        expect(resolve('index', '../../about')).toBe('/');
        expect(resolve('index', '../../../about')).toBe('/');
        expect(resolve('index', '../../../user/about')).toBe('/');
        expect(resolve('index', '../../../user/info/about')).toBe('/about');
        expect(resolve('index', './../about')).toBe('/about');
        expect(resolve('index', '..././../about')).toBe('/index/about');
        expect(resolve('index', '', '..././../about')).toBe('/index/about');
        expect(resolve('index', 'user', '..././../about')).toBe('/index/user/about');
    });

    /* 测试基路径解析 */
    test('测试基路径解析', () => {
        let resolve = makePathResolver('/src');

        expect(resolve('index')).toBe('/src/index');
        expect(resolve('./index')).toBe('/src/index');
        expect(resolve('../index')).toBe('/index');
        expect(resolve('../index/user')).toBe('/index/user');
        expect(resolve('../../index/user')).toBe('/user');

        expect(resolve('index', 'about')).toBe('/src/index/about');
        expect(resolve('index', '/about')).toBe('/about');
        expect(resolve('index', '../about')).toBe('/src/about');
        expect(resolve('index', '../../about')).toBe('/about');
        expect(resolve('index', '../../../about')).toBe('/');
        expect(resolve('index', '../../../user/about')).toBe('/about');
        expect(resolve('index', '../../../user/info/about')).toBe('/info/about');
        expect(resolve('index', './../about')).toBe('/src/about');
        expect(resolve('index', '..././../about')).toBe('/src/index/about');
        expect(resolve('index', '', '..././../about')).toBe('/src/index/about');
        expect(resolve('index', 'user', '..././../about')).toBe('/src/index/user/about');
    });
});
