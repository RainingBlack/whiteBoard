'use strict';

/**
 * Created by haoweirui
 * modified on 2017/8/22
 */
(function () {
    var config = require('../lib/config.json').serverConf;
    console.log(config.headConsole + ' start ' + config.name);

    require('../pomeloWSS/lead.js');

    var pomelo = window.pomelo;

    /**
     * 订阅发布，用于监听消息的订阅和发布
     * 支持同一个事件订阅多个处理
     * */
    var SubPubFunc = {
        pid: 0,
        list: {},
        subscribe: function subscribe(name, func) {
            this.list[name] = this.list[name] || [];
            var pid = this.list[name].pid || this.pid++;
            this.list[name].push({
                pid: pid,
                func: func
            });
            config.isDevelopment && console.log(config.headConsole + ' \u8BA2\u9605\u4E8B\u4EF6\u76D1\u542C\uFF1A' + name + '...');

            //向服务器订阅事件监听
            pomelo.on(name, function () {
                SubPubFunc.publish(this.name, SubPubFunc.getArgs(arguments));
            }.bind({ name: name }));
        },
        publish: function publish() {
            //首先取参数数组
            var temArgs = this.getArgs(arguments);

            var key = temArgs.shift(),
                fns = this.list[key];
            if (key && fns) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var fn = _step.value;

                        if (config && config.isOneArg) {
                            //单个参数时的处理
                            fn.func && this.sendOneArg(fn.func, temArgs);
                        } else {
                            //下面是多个参数调用时的处理
                            fn.func && this.sendOneArg(fn.func, temArgs);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                console.error('error');
            }
        },
        //用于取函数中的所有的参数  当需要根据参数个数调用注册的函数时使用，暂时不用
        getFuncArgs: function getFuncArgs(func) {
            // 先用正则匹配,取得符合参数模式的字符串.
            // 第一个分组是这个: ([^)]*) 非右括号的任意字符
            var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
            // 用逗号来分隔参数(arguments string).
            return args.split(",").map(function (arg) {
                // 去除注释(inline comments)以及空格
                return arg.replace(/\/\*.*\*\//, "").trim();
            }).filter(function (arg) {
                // 确保没有 undefined.
                return arg;
            });
        },
        //用于取arguments的数组数据
        getArgs: function getArgs(argsTem) {
            var tem = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = argsTem[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var v = _step2.value;

                    tem.push(v);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return tem;
        },
        //适应多个参数的调用
        sendManyArgs: function sendManyArgs(func, temArgs) {
            var strFunc = 'func(';
            if (temArgs[0].length > 0) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = temArgs[0][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var i = _step3.value;

                        strFunc += 'temArgs[0].shift(),';
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                strFunc = strFunc.substr(0, strFunc.length - 1);
            }
            strFunc += ')';
            eval(strFunc);
        },
        //当只有一个参数的时候传递
        sendOneArg: function sendOneArg(func, temArg) {
            func(temArg[0][0]);
        }
    };

    var serverComm = {};
    serverComm.name = "server comm SDK";
    /**
     * 用于连接server
     * @param 服务器地址
     * @param 服务器端口号
     * @param 回掉函数{code:code} code:0 失败 code:1 成功
     * */
    serverComm.server_connect = function (serverHost, port, connectData, callback) {
        config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u8FDE\u63A5\u76EE\u6807\u670D\u52A1\u5668...');
        pomelo.init({
            host: serverHost,
            port: port
        }, function (data) {
            config.isDevelopment && console.log(config.headConsole + ' \u8FDE\u63A5\u670D\u52A1\u5668\u6210\u529F...');
            config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u8FDE\u63A5\u8D1F\u8F7D\u5747\u8861\u670D\u52A1\u5668...');
            pomelo.request(config.serverName.serverQueryEntry, connectData, function (data) {
                config.isDevelopment && console.log(config.headConsole + ' \u8D1F\u8F7D\u5747\u8861\u8FD4\u56DE...');
                config.isDevelopment && console.log(config.headConsole + ' ' + JSON.stringify(data));
                if (data.code == '200') {
                    config.isDevelopment && console.log(config.headConsole + ' \u65AD\u5F00\u73B0\u6709\u8FDE\u63A5\u5E76\u8FDE\u63A5\u65B0\u670D\u52A1\u5668...');
                    pomelo.disconnect();
                    pomelo.init({
                        host: data.host,
                        port: data.port
                    }, function (data) {
                        config.isDevelopment && console.log(config.headConsole + ' \u8FDE\u63A5\u65B0\u670D\u52A1\u5668\u6210\u529F...');
                        config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u8FDE\u63A5connect\u670D\u52A1\u5668...');
                        pomelo.request(config.serverName.serverConnect, connectData, function (data) {
                            config.isDevelopment && console.log(config.headConsole + ' connect\u670D\u52A1\u5668\u8FD4\u56DE...');
                            if (data.code == '200') {
                                config.isDevelopment && console.log(config.headConsole + ' \u8FDE\u63A5connect\u670D\u52A1\u5668\u6210\u529F...');
                                callback(data);
                            } else {
                                console.warn(config.headConsole + ' \u8FDE\u63A5connect\u670D\u52A1\u5668\u5931\u8D25');
                                //暂时不做重新连接机制，直接把返回数据callback回去
                                callback(data);
                            }
                        });
                    });
                } else {
                    console.log(config.headConsole + ' \u8FDE\u63A5\u8D1F\u8F7D\u5747\u8861\u670D\u52A1\u5668\u5931\u8D25...');
                    console.log(config.headConsole + ' ' + data.reason);
                    //暂时不做重新连接机制，直接把返回数据callback回去
                    callback(data);
                }
            });
        });
    };
    /**
     * 用于进入会话
     * @param 认证信息
     * @param 回调函数
     * */
    serverComm.server_EnterRoom = function (identifyData, callback) {
        config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u8FDB\u5165\u4F1A\u8BDD\uFF1A(' + config.serverName.serverEnterRoom + ')...');
        config.isDevelopment && console.log(config.headConsole + ' ' + JSON.stringify(identifyData));

        pomelo.request(config.serverName.serverEnterRoom, identifyData, callback);
    };

    /**
     * 用于登出会话
     * @param 请求信息
     * @param 回调函数
     * */
    serverComm.server_LeaveRoom = function (requestData, callback) {
        config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u767B\u51FA\u4F1A\u8BDD\uFF1A(' + config.serverName.serverLeaveRoom + ')...');
        config.isDevelopment && console.log(config.headConsole + ' ' + JSON.stringify(requestData));
        pomelo.request(config.serverName.serverLeaveRoom, requestData, callback);
    };

    /**
     * 用于注册消息监听事件
     * @param 监听事件的名称
     * @param 事件处理函数
     * */
    serverComm.server_listen = function (eventName, eventFunction) {
        config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u76D1\u542C\u4E8B\u4EF6\uFF1A' + eventName + '...');

        SubPubFunc.subscribe(eventName, eventFunction);
    };

    /**
     * 用于发送数据到服务器
     * @param 数据类型
     * @param 数据内容
     * @param 服务器回调
     * */
    serverComm.server_sendMes = function (mesType, message, callback) {
        var mesHead = '';
        if (config.serverName[mesType]) {
            mesHead = config.serverName[mesType];
        } else {
            mesHead = mesType;
        }
        config.isDevelopment && console.log(config.headConsole + ' \u5F00\u59CB\u53D1\u9001\u6570\u636E\u5230\u670D\u52A1\u5668\uFF1A' + mesHead + '...');
        config.isDevelopment && console.log(config.headConsole + ' ' + JSON.stringify(message) + '...');
        pomelo.request(mesHead, message, function (data) {
            config.isDevelopment && console.log(config.headConsole + ' \u53D1\u9001\u6570\u636E\u5230\u670D\u52A1\u5668\u56DE\u8C03 ' + JSON.stringify(data));
            callback(data);
        });
    };

    /*
    * 断开连接
    * */
    serverComm.server_disconnect = function () {
        pomelo.disconnect();
    };

    module.exports = serverComm;
})();