'use strict';

/**
 * Created by haoweirui
 * modified on 2017/8/30
 * +++++++++++++++back++++++++++++++++
 */
(function () {
    var conf = require('../../lib/config.json');
    var _name = '*********back***********';
    var back = {
        action: function action(scaleX, scaleY, canvasW, canvasH) {
            console.log(this.orderList);
            var lastHandle = this.orderList.pop();
            if (lastHandle) {
                var svcID = lastHandle.svcID,
                    localID = lastHandle.localID,
                    targetID = lastHandle.targetID || localID,
                    actionType = lastHandle.actionType,
                    type = targetID.substring(0, targetID.indexOf('_')),
                    tarID = this.getChildID(type, targetID);
                var curShape = this.allShapesArr[type][tarID];
                if (curShape) {
                    if (actionType == 'add') {
                        //回退添加 直接把他隐藏
                        curShape.visible = false;
                    } else if (actionType == 'draft') {
                        curShape.propersData.dragInfo.pop();
                        var isText = type == 'text',
                            textState = null;
                        if (isText && curShape.propersData.reEditInfo.length > 0) {
                            textState = curShape.propersData.reEditInfo[curShape.propersData.reEditInfo.length - 1];
                        }
                        if (curShape.propersData.dragInfo.length == 0) {
                            if (textState) {
                                curShape.x = textState.left;
                                curShape.y = textState.top;
                            } else {
                                curShape.x = 0;
                                curShape.y = 0;
                            }
                        } else {
                            var currentState = curShape.propersData.dragInfo[curShape.propersData.dragInfo.length - 1];
                            curShape.x = currentState.x;
                            curShape.y = currentState.y;
                        }
                    } else if (actionType == 'rubber') {
                        curShape.propersData.rubberInfo.pop();
                        if (curShape.propersData.rubberInfo.length == 0) {
                            curShape.visible = true;
                        } else {
                            var _currentState = curShape.propersData.rubberInfo[curShape.propersData.dragInfo.length - 1];
                            curShape.visible = _currentState;
                        }
                    } else if (actionType == 'reEdit') {
                        if (type == 'text') {
                            curShape.propersData.reEditInfo.pop();
                            if (curShape.propersData.reEditInfo.length == 0) {
                                curShape.visible = false;
                            } else {
                                var curTextState = curShape.propersData.reEditInfo[curShape.propersData.reEditInfo.length - 1],
                                    text = curTextState.text,
                                    left = curTextState.left + 2 * curShape.propersData.borderWidth,
                                    top = curTextState.top + 2 * curShape.propersData.borderWidth;
                                curShape.text = text;
                                curShape.x = left;
                                curShape.y = top;
                            }
                        } else {
                            console.warn(conf.headConsole + ' \u5C1D\u8BD5\u5BF9\u4E00\u4E2A\u975E\u6587\u5B57\u56DE\u9000\u91CD\u5199\u64CD\u4F5C\uFF01');
                            return false;
                        }
                    }
                } else {
                    console.warn(conf.headConsole + ' \u5C1D\u8BD5\u56DE\u9000\u4E00\u4E2A\u4E0D\u5B58\u5728\u7684\u76EE\u6807\u8F68\u8FF9\uFF01');
                    return false;
                }
                //组装并回调数据
                var CBData = {
                    type: type,
                    _targetID: targetID,
                    _type: 'back',
                    _svcId: -1,
                    command: {}
                };
                return CBData;
            } else {
                return false;
            }
            return false;
        },
        /**
         * 同步外部数据----back操作
         * */
        update: function update(data, scaleX, scaleY) {
            var targetID = data._targetID,
                type = data.type;
            //检查当前是不是存在这个笔迹,并处在最后的位置
            if (this.orderList[this.orderList.length - 1].localID != data._targetID) {
                console.warn(conf.headConsole + ' \u5C1D\u8BD5\u56DE\u9000\u4E0D\u540C\u7684\u7B14\u8FF9\u6570\u636E\uFF0C\u4F1A\u9020\u6210\u89C6\u89C9\u4E0D\u4E00\u81F4');
            }
            back.action.call(this, scaleX, scaleY);
        }
    };
    module.exports = back;
})();