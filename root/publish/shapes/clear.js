'use strict';

/**
 * Created by haoweirui
 * modified on 2017/8/30
 * +++++++++++++++clear++++++++++++++++
 */
(function () {
    var _name = '*********clear***********';
    var clear = {
        action: function action() {
            if (this.orderList.length > 0) {
                this.orderList.length = 0;
                for (var type in this.allShapesArr) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.allShapesArr[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var shape = _step.value;

                            shape.visible = false;
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
            } else {
                return false;
            }
            //回调数据
            return {
                _type: 'clear'
            };
        },
        /**
         * 同步外部数据----back操作
         * */
        update: function update(data) {
            clear.action.call(this);
        }
    };
    module.exports = clear;
})();