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
 * 监听启动完成
 *****************************************
 */
history.ready(function (route) {
    window.$router = history;
    console.log('ready', route);
});


/**
 *****************************************
 * 创建应用
 *****************************************
 */
class App extends Component {

    /* 初始化组件 */
    constructor(props, ...args) {
        super(props, ...args);

        // 定义属性
        this.state = {
            block: false,
            route: history.state
        };

        // 监听路由变更
        this.unbind = [
            history.subscribe(route => this.setState({ route })),
            history.block(event => this.state.block && event.preventDefault())
        ];
    }

    /* 渲染组件 */
    render() {

        // 渲染结果
        if (this.state.route) {
            return (
                <div>
                    <p>url: { history.url }</p>
                    <p>method: { history.method }</p>
                    <p>query: { JSON.stringify(history.query) }</p>
                    <p>histories: { JSON.stringify(history.histories.map(route => route.url)) }</p>
                    <p>push: <input type="text" value={ this.state.route.url } onChange={ this.handleChange } /></p>
                    <p>replace: <input className="replace" type="text" value={ this.state.route.url } onChange={ this.handleChange } /></p>
                    <p>block: <input type="checkbox" value={ this.state.block } name="block" onChange={ () => this.setState({ block: !this.state.block }) } /></p>
                </div>
            );
        }

        // 渲染空
        return null;
    }

    /* 监听更新 */
    handleChange(event) {
        let el = event.target,
            replace = el.className === 'replace';

        // 更新路径
        replace ? history.replace(el.value) : history.push(el.value);
    }
}


/**
 *****************************************
 * 启动应用
 *****************************************
 */
render(<App />, document.getElementById('app'));
