'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++arrow++++++++++++++++
 */
(function () {
    var create = require('../../plugs/create');
    var _name = '*********back***********';

    var arrow = function (_create$Shape) {
        _inherits(arrow, _create$Shape);

        function arrow(id) {
            _classCallCheck(this, arrow);

            var _this = _possibleConstructorReturn(this, (arrow.__proto__ || Object.getPrototypeOf(arrow)).call(this));

            _this.name = 'arrow_' + id;
            return _this;
        }

        _createClass(arrow, [{
            key: 'setPropertyForShape',
            value: function setPropertyForShape(constConf, hotConf) {
                var name = this.name;
                this.graphics.beginStroke(hotConf.property_other.color);
                this.graphics.setStrokeStyle(hotConf.property_other.size, 1, 1).beginFill(hotConf.property_other.color);
                this.startX = 0;
                this.startY = 0;
                this.propersData = {
                    name: name,
                    baseSize: constConf.baseSize.value,
                    recordInfo: constConf.recordInfo.value,
                    size: hotConf.property_other.size,
                    color: hotConf.property_other.color,
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    dragInfo: [],
                    rubberInfo: []
                };
            }
        }, {
            key: 'mouseDown',
            value: function mouseDown(event, scaleX, scaleY, canvasW, canvasH) {
                var stageX = event.stageX / scaleX,
                    stageY = event.stageY / scaleY;
                this.graphics.moveTo(stageX, stageY);
                this.graphics.lineTo(stageX, stageY);
                this.graphics.store();
                this.graphics.unstore();
                this.startX = stageX;
                this.startY = stageY;
                //记录数据
                this.propersData.top = this.startY;
                this.propersData.left = this.startX;
            }
        }, {
            key: 'mouseMove',
            value: function mouseMove(event, scaleX, scaleY, canvasW, canvasH) {
                var stageX = event.stageX / scaleX,
                    stageY = event.stageY / scaleY;
                var self = this,
                    p1 = {
                    x: self.startX,
                    y: self.startY
                },
                    p2 = {
                    x: stageX,
                    y: stageY
                };

                var points = this.getArrowPoints(p1, p2, 20);
                if (points.length > 0) {
                    this.paintArrow(points);
                }
            }
        }, {
            key: 'mouseUp',
            value: function mouseUp(event, scaleX, scaleY, canvasW, canvasH) {}
            /*
            * 计算箭头的边线绘制点
            * */

        }, {
            key: 'getArrowPoints',
            value: function getArrowPoints(point1, point2, sideLen) {
                //需要考虑四个象限
                //首先计算角度和各个边长
                var x1 = point1.x,
                    y1 = point1.y,
                    x2 = point2.x,
                    y2 = point2.y,
                    x_x = x2 - x1,
                    y_y = y2 - y1,
                    tanYX = 0,
                    angle = 0;

                var l1_x = 0,
                    l1_y = 0,
                    l2_x = 0,
                    l2_y = 0,
                    l3_x = 0,
                    l3_y = 0,
                    TP1 = {
                    x: 0,
                    y: 0
                },
                    TP2 = {
                    x: 0,
                    y: 0
                },
                    TP3 = {
                    x: 0,
                    y: 0
                },
                    TP4 = {
                    x: 0,
                    y: 0
                },
                    TP5 = {
                    x: 0,
                    y: 0
                },
                    TP6 = {
                    x: 0,
                    y: 0
                };
                var p_p = Math.sqrt(x_x * x_x + y_y * y_y);
                p_p = p_p ? p_p : 0;
                if (p_p < sideLen) {
                    sideLen = p_p;
                }
                x_x == 0 ? ++x_x : x_x;
                y_y == 0 ? ++y_y : y_y;
                if (x_x != 0 && y_y != 0) {
                    tanYX = Math.abs(y_y) / Math.abs(x_x);
                    angle = Math.atan(tanYX);
                    var sinV = Math.sin(angle),
                        cosV = Math.cos(angle),
                        temSide = Math.sqrt(3) * sideLen / 2;
                    l1_x = sideLen / 2 * sinV;
                    l1_y = sideLen / 2 * cosV;
                    l2_x = temSide * cosV;
                    l2_y = temSide * sinV;
                    l3_x = sideLen / 4 * sinV;
                    l3_y = sideLen / 4 * cosV;
                    var centerPoint_X = 0,
                        centerPoint_Y = 0;
                    if (x_x > 0 && y_y < 0) {
                        //第一象限
                        centerPoint_X = x2 - l2_x;
                        centerPoint_Y = y2 + l2_y;
                        TP1 = point1;

                        TP2.x = centerPoint_X - l3_x;
                        TP2.y = centerPoint_Y - l3_y;

                        TP3.x = centerPoint_X - l1_x;
                        TP3.y = centerPoint_Y - l1_y;

                        TP4 = point2;

                        TP5.x = centerPoint_X + l1_x;
                        TP5.y = centerPoint_Y + l1_y;

                        TP6.x = centerPoint_X + l3_x;
                        TP6.y = centerPoint_Y + l3_y;
                    } else if (x_x < 0 && y_y < 0) {
                        //第二象限
                        centerPoint_X = x2 + l2_x;
                        centerPoint_Y = y2 + l2_y;

                        TP1 = point1;

                        TP2.x = centerPoint_X - l3_x;
                        TP2.y = centerPoint_Y + l3_y;

                        TP3.x = centerPoint_X - l1_x;
                        TP3.y = centerPoint_Y + l1_y;

                        TP4 = point2;

                        TP5.x = centerPoint_X + l1_x;
                        TP5.y = centerPoint_Y - l1_y;

                        TP6.x = centerPoint_X + l3_x;
                        TP6.y = centerPoint_Y - l3_y;
                    } else if (x_x < 0 && y_y > 0) {
                        //第三象限
                        centerPoint_X = x2 + l2_x;
                        centerPoint_Y = y2 - l2_y;

                        TP1 = point1;

                        TP2.x = centerPoint_X + l3_x;
                        TP2.y = centerPoint_Y + l3_y;

                        TP3.x = centerPoint_X + l1_x;
                        TP3.y = centerPoint_Y + l1_y;

                        TP4 = point2;

                        TP5.x = centerPoint_X - l1_x;
                        TP5.y = centerPoint_Y - l1_y;

                        TP6.x = centerPoint_X - l3_x;
                        TP6.y = centerPoint_Y - l3_y;
                    } else if (x_x > 0 && y_y > 0) {
                        //第四象限
                        centerPoint_X = x2 - l2_x;
                        centerPoint_Y = y2 - l2_y;

                        TP1 = point1;

                        TP2.x = centerPoint_X + l3_x;
                        TP2.y = centerPoint_Y - l3_y;

                        TP3.x = centerPoint_X + l1_x;
                        TP3.y = centerPoint_Y - l1_y;

                        TP4 = point2;

                        TP5.x = centerPoint_X - l1_x;
                        TP5.y = centerPoint_Y + l1_y;

                        TP6.x = centerPoint_X - l3_x;
                        TP6.y = centerPoint_Y + l3_y;
                    }
                    return [TP1, TP2, TP3, TP4, TP5, TP6];
                }
            }

            /**
             * 绘制箭头
             * */

        }, {
            key: 'paintArrow',
            value: function paintArrow(points) {
                var f = true;
                this.clear();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var p = _step.value;

                        if (f) {
                            this.graphics.moveTo(p.x, p.y);
                            f = false;
                        } else {
                            this.graphics.lineTo(p.x, p.y);
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

                this.graphics.lineTo(points[0].x, points[0].y);

                //记录数据
                this.propersData.width = points[3].x - points[0].x;
                this.propersData.height = points[3].y - points[0].y;
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.graphics._instructions.length = this.graphics._activeInstructions.length = this.graphics._commitIndex = 0;
            }
            /**
             * 将外部数据转化为图形
             * */

        }, {
            key: 'turnShape',
            value: function turnShape(constConf, hotConf, data) {
                this.setPropertyForShape(constConf, hotConf);
                //修正数据
                this.graphics.beginStroke(data.color);
                this.graphics.setStrokeStyle(data.size, 1, 1).beginFill(data.color);
                this.propersData.size = data.size;
                this.propersData.color = data.color;
                this.startX = data.command[0].x;
                this.startY = data.command[0].y;
                this.propersData.left = this.startX;
                this.propersData.top = this.startY;

                //绘制
                this.paintArrow(data.command);
            }
        }]);

        return arrow;
    }(create.Shape);

    module.exports = arrow;
})();