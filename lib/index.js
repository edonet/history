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
import matchPath from './match';


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
        block = cb => history.block(cb),
        destroy = () => history.destroy(),
        setUserConfirmation = (
            userConfirmation => history.userConfirmation = userConfirmation
        );

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
            match(path) {
                let { pathname, search, query } = history.state,
                    matched = matchPath(resolve(path), pathname);

                // 合并参数
                if (matched && search) {
                    matched.params = { ...matched.params, ...query };
                }

                // 返回结果
                return matched;
            },
            block,
            setContext,
            setUserConfirmation,
            subscribe,
            destroy
        };
    };
}
