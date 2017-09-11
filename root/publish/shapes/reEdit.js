'use strict';

/**
 * Created by haoweirui
 * modified on 2017/8/28
 * +++++++++++++++reEdit++++++++++++++++
 */
(function () {
    var _name = '*********reEdit***********';
    var reEdit = {
        ownerID: "",
        mouseDown: function mouseDown(event, scaleX, scaleY, canvasW, canvasH) {
            var stageX = event.stageX / scaleX,
                stageY = event.stageY / scaleY;
            if (event.relatedTarget && event.relatedTarget.name.indexOf('text') != -1) {
                //开始重写
                var curTar = event.relatedTarget,
                    name = curTar.name,
                    type = name.substring(0, name.indexOf('_'));
                var tarID = this.getChildID(type, name);
                var curShape = this.allShapesArr[type][tarID];
                this.curChangeInfo.name = name;
                this.curChangeInfo.targetID = tarID;
                this.curChangeInfo.type = type;
                this.curChangeInfo.isDown = true;
                this.curChangeInfo.isUp = false;

                //先提取上一次的数据信息初始化propersData数据
                var newState = curShape.propersData.reEditInfo[curShape.propersData.reEditInfo.length - 1];
                reEdit.updatePropers(newState, curShape.propersData);
                curShape.text = "";
                curShape.reEditStart(event, scaleX, scaleY, canvasW, canvasH);
                return false;
            } else if (this.curChangeInfo.type == 'text') {
                //重写打印
                var _type = this.curChangeInfo.type,
                    _tarID = this.curChangeInfo.targetID,
                    _curShape = this.allShapesArr[_type][_tarID];
                _curShape.reEditEnd(event, scaleX, scaleY, canvasW, canvasH);
                //记录数据
                var localSVCID = this.localSVCID++,
                    localID = 'reEdit_' + reEdit.ownerID + '_' + localSVCID,
                    targetID = _curShape.name;
                console.log(localSVCID);
                this.orderList.push({
                    svcID: localSVCID,
                    localID: localID,
                    targetID: targetID,
                    actionType: 'reEdit'
                });
                //回归数据
                this.curChangeInfo.name = '';
                this.curChangeInfo.targetID = -1;
                this.curChangeInfo.type = '';
                this.curChangeInfo.isDown = false;
                this.curChangeInfo.isUp = true;
                this.curChangeInfo.startX = 0;
                this.curChangeInfo.startY = 0;
                this.curChangeInfo.lastPX = 0;
                this.curChangeInfo.lastPX = 0;

                //组装并回调数据
                var reEditState = reEdit.updatePropers(_curShape.propersData, {}),
                    CBData = {
                    _type: _type,
                    _localID: localID,
                    _targetID: targetID,
                    command: {}
                };
                CBData.command = reEditState;

                return CBData;
            }
            //回归数据
            this.curChangeInfo.name = '';
            this.curChangeInfo.targetID = -1;
            this.curChangeInfo.type = '';
            this.curChangeInfo.isDown = false;
            this.curChangeInfo.isUp = true;
            this.curChangeInfo.startX = 0;
            this.curChangeInfo.startY = 0;
            this.curChangeInfo.lastPX = 0;
            this.curChangeInfo.lastPX = 0;
            return false;
        },
        mouseMove: function mouseMove(event, scaleX, scaleY, canvasW, canvasH) {
            var stageX = event.stageX / scaleX,
                stageY = event.stageY / scaleY;
            //reEdit没有move操作
            var curShape = this.allShapesArr[this.curChangeInfo.type][this.curChangeInfo.targetID];
            if (curShape.isTexting) {
                curShape.mouseMove(event, scaleX, scaleY);
            }
        },
        mouseUp: function mouseUp(event, scaleX, scaleY, canvasW, canvasH) {},
        updatePropers: function updatePropers(source, target) {
            target == undefined && (target = {});
            for (var key in source) {
                if (key != 'reEditInfo') {
                    target[key] = Object.prototype.toString.call(source[key]) === '[object Object]' ? reEdit.updatePropers(source[key], target[key]) : source[key];
                }
            }
            return target;
        },
        /**
         * 同步外部数据----back操作
         * */
        update: function update(data) {
            var targetID = data._targetID,
                type = targetID.substring(0, targetID.indexOf('_')),
                localID = data._localID,
                command = data.command;
            var tarID = this.getChildID(type, targetID);
            var curShape = this.allShapesArr[type][tarID];

            curShape.text = command.text;
            curShape.color = command.fontColor;
            curShape.font = command.fontSize + 'px ' + command.fontFamily;
            curShape.x = command.left;
            curShape.y = command.top;

            curShape.propersData.reEditInfo.push(curShape.deepCopy(command));
        }
    };
    module.exports = reEdit;
})();