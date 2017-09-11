'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by haoweirui
 * modified on 2017/9/8
 * +++++++++++++++circle++++++++++++++++
 */
(function () {
    var create = require('../../plugs/create');
    var _name = '*********circle***********';

    var rect = function (_create$Shape) {
        _inherits(rect, _create$Shape);

        function rect(id) {
            _classCallCheck(this, rect);

            var _this = _possibleConstructorReturn(this, (rect.__proto__ || Object.getPrototypeOf(rect)).call(this));

            _this.name = 'circle_' + id;
            return _this;
        }

        _createClass(rect, [{
            key: 'setPropertyForShape',
            value: function setPropertyForShape(constConf, hotConf) {
                var name = this.name;
                this.graphics.beginStroke(hotConf.property_other.color);
                this.graphics.setStrokeStyle(hotConf.property_other.size, 1, 1);
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
                this.startX = stageX;
                this.startY = stageY;

                this.paintCircle(this.startX, this.startY, stageX, stageY);
                this.graphics.store();
                this.graphics.unstore();
            }
        }, {
            key: 'mouseMove',
            value: function mouseMove(event, scaleX, scaleY, canvasW, canvasH) {
                var stageX = event.stageX / scaleX,
                    stageY = event.stageY / scaleY;
                this.clear();
                this.graphics.beginStroke(this.propersData.color);
                this.graphics.setStrokeStyle(this.propersData.size, 1, 1);
                this.paintCircle(this.startX, this.startY, stageX, stageY);
            }
        }, {
            key: 'mouseUp',
            value: function mouseUp(event, scaleX, scaleY, canvasW, canvasH) {
                var stageX = event.stageX / scaleX,
                    stageY = event.stageY / scaleY;
                this.clear();
                this.graphics.beginStroke(this.propersData.color);
                this.graphics.setStrokeStyle(this.propersData.size, 1, 1);
                this.paintCircle(this.startX, this.startY, stageX, stageY);
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
                this.graphics.setStrokeStyle(data.size, 1, 1);
                this.propersData.color = data.color;
                this.propersData.size = data.size;
                this.startX = data.command[0].x;
                this.startY = data.command[0].y;
                this.propersData.left = this.startX;
                this.propersData.top = this.startY;
                this.propersData.width = data.command[0].w;
                this.propersData.height = data.command[0].h;

                //绘制
                var x = data.command[0].x,
                    y = data.command[0].y,
                    w = data.command[0].w,
                    h = data.command[0].h;
                this.paintCircle(x, y, x, y, w, h);
            }
            /**
             * 绘制图形
             * */

        }, {
            key: 'paintCircle',
            value: function paintCircle(sx, sy, cx, cy, w, h) {
                var minX = Math.min(sx, cx),
                    minY = Math.min(sy, cy),
                    wid = w || Math.abs(sx - cx),
                    hei = h || Math.abs(sy - cy);
                this.graphics.drawEllipse(minX, minY, wid, hei);

                //更新位置
                this.propersData.width = wid;
                this.propersData.height = hei;
                this.propersData.top = minY;
                this.propersData.left = minX;
            }
        }]);

        return rect;
    }(create.Shape);

    module.exports = rect;
})();