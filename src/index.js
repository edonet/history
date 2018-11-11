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
import React, { Component } from 'react';
import { render } from 'react-dom';
import createHistory from '../lib';


/**
 *****************************************
 * 创建路由
 *****************************************
 */
let history = createHistory();



/**
 *****************************************
 * 创建应用
 *****************************************
 */
class App extends Component {

    constructor(props, ...args) {
        super(props, ...args);

        this.state = { reoute: null };

        history.subscribe(route => this.setState({ route }));
    }

    render() {
        return (
            <div>
                <div>{ JSON.stringify(this.state.route) }</div>
            </div>
        );
    }
}


/**
 *****************************************
 * 启动应用
 *****************************************
 */
render(<App />, document.getElementById('app'));
