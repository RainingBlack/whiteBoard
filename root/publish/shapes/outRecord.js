'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++outRecord++++++++++++++++
 */
(function () {
    var create = require('../../plugs/create');
    var _name = '*********outRecord***********';

    var outRecord = function (_create$Bitmap) {
        _inherits(outRecord, _create$Bitmap);

        function outRecord(id) {
            _classCallCheck(this, outRecord);

            var _this = _possibleConstructorReturn(this, (outRecord.__proto__ || Object.getPrototypeOf(outRecord)).call(this));

            _this.name = 'outRecord_' + id;
            return _this;
        }

        _createClass(outRecord, [{
            key: 'setPropertyForShape',
            value: function setPropertyForShape(constConf, hotConf) {
                var name = this.name;
                this.startX = 0;
                this.startY = 0;
                this.propersData = {
                    name: name,
                    baseSize: constConf.baseSize.value,
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
            /**
             * 将外部数据转化为图形
             * */

        }, {
            key: 'turnShape',
            value: function turnShape() {}
        }]);

        return outRecord;
    }(create.Bitmap);

    module.exports = outRecord;
})();