'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++pencil++++++++++++++++
 */
(function () {
    var create = require('../../plugs/create');
    var _name = '*********pencil***********';

    var pencil = function (_create$Shape) {
        _inherits(pencil, _create$Shape);

        function pencil(id) {
            _classCallCheck(this, pencil);

            var _this = _possibleConstructorReturn(this, (pencil.__proto__ || Object.getPrototypeOf(pencil)).call(this));

            _this.name = 'pencil_' + id;
            return _this;
        }

        _createClass(pencil, [{
            key: 'setPropertyForShape',
            value: function setPropertyForShape(constConf, hotConf) {
                var name = this.name;
                this.graphics.beginStroke(hotConf.property_other.color);
                this.graphics.setStrokeStyle(hotConf.property_other.size, 1, 1);
                this.startX = 0;
                this.startY = 0;
                this.firstMove = true;
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
                if (this.firstMove) {
                    this.graphics.moveTo(this.startX, this.startY);
                    this.firstMove = false;
                }
                this.graphics.lineTo(stageX, stageY);
                //记录数据
                this.propersData.width = -1;
                this.propersData.height = -1;
            }
        }, {
            key: 'mouseUp',
            value: function mouseUp(event, scaleX, scaleY, canvasW, canvasH) {}

            /**
             * 将外部数据转化为图形
             * */

        }, {
            key: 'turnShape',
            value: function turnShape(constConf, hotConf, data) {
                this.setPropertyForShape(constConf, hotConf);

                //修正数据
                this.graphics.beginStroke(data.color);
                this.graphics.setStrokeStyle(data.size, 1, 1);
                this.propersData.color = data.color;
                this.propersData.size = data.size;
                this.startX = data.command[0].x;
                this.startY = data.command[0].y;
                this.propersData.left = this.startX;
                this.propersData.top = this.startY;
                this.propersData.width = -1;
                this.propersData.height = -1;
                this.firstMove = false;

                //绘制
                this.paintPencil(data.command);
            }
            /**
             * 绘制图形
             * */

        }, {
            key: 'paintPencil',
            value: function paintPencil(points) {
                var f = true;
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
            }
        }]);

        return pencil;
    }(create.Shape);

    module.exports = pencil;
})();