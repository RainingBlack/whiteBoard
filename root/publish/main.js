'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++main++++++++++++++++
 */
(function () {
    var config = require('../lib/config.json');
    var coreFuncs = require('./coreFuncs');

    console.log("|*******************************|");
    console.log('|-------------' + config.editor + '-------------|');
    console.log("|*******************************|");

    var WBSDK = function () {
        function WBSDK() {
            _classCallCheck(this, WBSDK);

            this.init();
        }
        /**
         * 打印相关的白板标签
         * */


        _createClass(WBSDK, [{
            key: 'init',
            value: function init() {
                Object.defineProperties(this, {
                    versionInfo: {
                        value: '1.0.0',
                        enumerable: true,
                        configurable: false,
                        writable: false
                    }
                });
                this.localSVCID = 0; //当为本地模式时的模拟svcID
                this.targetID = ''; //代表当前白板的对象i
                this.allShapesArr = {}; //记录所有的shape
                this.orderList = []; //记录所有的操作顺序
                this.currentTool = ''; //代表当前的默认工具
                this.constConf = null; //代表当前的常态配置信息
                this.hotUpdateConf = null; //代表当前的可更改配置信息，支持热更新
                this.callback = null; //外部接收笔迹数据的接口
                this.boardElems = null; //代表当前画布的属性状态信息

                this.scaleX = 1; //代表当前的横向缩放比例
                this.scaleY = 1; //代表当前的纵向缩放比例

                this.isCreated = false; //是否已经创建，避免重复创建

                this.curChangeInfo = {
                    targetID: -1,
                    name: '',
                    type: '',
                    isDown: false,
                    isUp: true,
                    startX: 0,
                    startY: 0,
                    lastPX: 0,
                    lastPY: 0
                };
            }
            /**
             * 获取相关的默认配置信息
             * */

        }, {
            key: 'getconf',
            value: function getconf(type) {
                //提供外界获取配置信息
                var data = {};
                if (type == undefined || type == 0) {
                    data = config.boardInfo;
                } else {
                    if (type == 'const' || type == 1) {
                        data = config.boardInfo.constConf;
                    } else if (type == 'change' || type == 2) {
                        data = config.boardInfo.hotUpdateConf;
                    } else {
                        console.warn(config.headConsole + '\u5C1D\u8BD5\u83B7\u53D6\u975E\u6CD5\u7684\u914D\u7F6E\u4FE1\u606F!');
                    }
                }
                return data;
            }
            /**
             * 创建白板
             * @param targetID 目标id
             * */

        }, {
            key: 'createBoard',
            value: function createBoard(targetID, confInfo, dataCB) {
                try {
                    if (this.isCreated) {
                        //避免重复创建
                        return;
                    }
                    this.isCreated = true;
                    //首先设置相关的配置信息
                    coreFuncs.setConf.call(this, targetID, confInfo, dataCB);
                    //其次创建并初始化白板
                    coreFuncs.initBoard.call(this);
                    //然后绑定相关的白板事件
                    coreFuncs.bindCanvasEvent.call(this);
                    //默认工具
                    var firstTool = this.constConf.firstTool.value;
                    if (config.openedTools.indexOf(firstTool) == -1) {
                        firstTool = config.openedTools[0];
                        console.warn(config.headConsole + ' sdk\u5F53\u524D\u4E0D\u652F\u6301\u5F53\u524D\u8BBE\u7F6E\u7684\u9ED8\u8BA4\u5DE5\u5177\uFF0C\u60A8\u53EF\u4EE5\u5C1D\u8BD5\u5347\u7EA7sdk\u6216\u8005\u67E5\u770B\u6700\u65B0\u7684sdk\u5DE5\u5177\u652F\u6301\u76F8\u5173\u6587\u6863\uFF01');
                    }
                    coreFuncs.choseTool.call(this, firstTool);
                } catch (e) {
                    console.warn(config.headConsole + ' \u521B\u5EFA\u767D\u677F\u7684\u65F6\u5019\u51FA\u9519\uFF1A', e);
                }
            }
            /**
             * 调用工具
             * */

        }, {
            key: 'draw',
            value: function draw(tool) {
                if (config.openedTools.indexOf(tool) != -1) {
                    coreFuncs.choseTool.call(this, tool);
                } else {
                    console.warn(config.headConsole + ' sdk\u5F53\u524D\u4E0D\u652F\u6301\u8BE5\u5DE5\u5177\uFF0C\u60A8\u53EF\u4EE5\u5C1D\u8BD5\u5347\u7EA7sdk\u6216\u8005\u67E5\u770B\u6700\u65B0\u7684sdk\u5DE5\u5177\u652F\u6301\u76F8\u5173\u6587\u6863\uFF01');
                }
            }
            /**
             * resize
             * */

        }, {
            key: 'resize',
            value: function resize(width, height, left, top) {
                this.isCreated && coreFuncs.resize.call(this, width, height, left, top);
            }
            /**
             * 开始/暂停绘制
             * */

        }, {
            key: 'setDrawState',
            value: function setDrawState(type) {
                this.isCreated && coreFuncs.setDrawState.call(this, type);
            }
            /**
             * 进行展示外部数据
             * */

        }, {
            key: 'turnShape',
            value: function turnShape(data, svcID) {
                coreFuncs.turnShape.call(this, data, svcID);
            }
            /**
             * 获取当前对象
             * */

        }, {
            key: 'getChildID',
            value: function getChildID(type, name) {
                var i = -1;
                if (this.allShapesArr[type]) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.allShapesArr[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var s = _step.value;

                            i++;
                            if (s.name == name) {
                                return i;
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
                }
                i = -1;
                console.warn(config.headConsole + ' \u672C\u5730\u56FE\u5F62\u5E93\u672A\u67E5\u627E\u5230\u54CD\u5E94\u7684\u56FE\u5F62\u5BF9\u8C61\uFF01');
                return i;
            }
        }]);

        return WBSDK;
    }();

    module.exports = WBSDK;
})();