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
import makePathResolver from './resolve';


/**
 *****************************************
 * 定义路由对象
 *****************************************
 */
export default function createHistory(options) {
    let history = new History(options),
        setContext = makeContextFactory(history);

    // 返回接口
    return setContext();
}


/**
 *****************************************
 * 设置上下文
 *****************************************
 */
function makeContextFactory(history) {
    let subscribe = cb => history.subscribe(cb),
        destroy = () => history.destroy();

    // 返回设置函数
    return function setContext(context = '/') {
        let resolve = makePathResolver(context);

        // 返回接口
        return {
            get state() {
                return history.state;
            },
            context,
            resolve,
            go(path, options) {
                return history.go(resolve(path), options);
            },
            replace(path, options) {
                return history.replace(resolve(path), options);
            },
            goBack(step, options) {
                return history.goBack(
                    typeof step === 'string' ? resolve(step) : step,
                    options
                );
            },
            setContext,
            subscribe,
            destroy
        };
    };
}
