'use strict';

/**
 * Created by haoweirui
 * modified on 2017/8/28
 * +++++++++++++++draft++++++++++++++++
 */
(function () {
    var _name = '*********draft***********';
    var draft = {
        ownerID: "",
        mouseDown: function mouseDown(event, scaleX, scaleY, canvasW, canvasH) {
            var stageX = event.stageX / scaleX,
                stageY = event.stageY / scaleY;
            if (event.relatedTarget) {
                var curTar = event.relatedTarget,
                    name = curTar.name,
                    type = name.substring(0, name.indexOf('_'));
                var tarID = this.getChildID(type, name);
                var curShape = this.allShapesArr[type][tarID],
                    dragProps = curShape.propersData.dragInfo;
                this.curChangeInfo.name = name;
                this.curChangeInfo.targetID = tarID;
                this.curChangeInfo.type = type;
                this.curChangeInfo.isDown = true;
                this.curChangeInfo.isUp = false;
                this.curChangeInfo.startX = stageX;
                this.curChangeInfo.startY = stageY;
                this.curChangeInfo.lastPX = curShape.x;
                this.curChangeInfo.lastPY = curShape.y;
                return;
            }
            this.curChangeInfo.name = '';
            this.curChangeInfo.targetID = -1;
            this.curChangeInfo.type = '';
            this.curChangeInfo.isDown = false;
            this.curChangeInfo.isUp = true;
            this.curChangeInfo.startX = 0;
            this.curChangeInfo.startY = 0;
            this.curChangeInfo.lastPX = 0;
            this.curChangeInfo.lastPX = 0;
        },
        mouseMove: function mouseMove(event, scaleX, scaleY, canvasW, canvasH) {
            var stageX = event.stageX / scaleX,
                stageY = event.stageY / scaleY;
            if (this.curChangeInfo.isDown) {
                var type = this.curChangeInfo.type,
                    tarID = this.curChangeInfo.targetID,
                    curShape = this.allShapesArr[type][tarID];
                curShape.x = stageX - this.curChangeInfo.startX + this.curChangeInfo.lastPX;
                curShape.y = stageY - this.curChangeInfo.startY + this.curChangeInfo.lastPY;
            }
        },
        mouseUp: function mouseUp(event, scaleX, scaleY, canvasW, canvasH) {
            var stageX = event.stageX / scaleX,
                stageY = event.stageY / scaleY;
            this.curChangeInfo.isDown = false;
            this.curChangeInfo.isUp = true;
            if (this.curChangeInfo.targetID != -1) {
                var type = this.curChangeInfo.type,
                    tarID = this.curChangeInfo.targetID,
                    curShape = this.allShapesArr[type][tarID],
                    left = stageX - this.curChangeInfo.startX + this.curChangeInfo.lastPX,
                    top = stageY - this.curChangeInfo.startY + this.curChangeInfo.lastPY;
                curShape.x = left;
                curShape.y = top;
                curShape.propersData.x = left;
                curShape.propersData.y = top;
                //记录拖动
                curShape.propersData.dragInfo.push({ x: left, y: top });
                var localSVCID = this.localSVCID++,
                    localID = 'draft_' + draft.ownerID + '_' + localSVCID,
                    targetID = curShape.name;
                console.log(localSVCID);
                this.orderList.push({
                    svcID: localSVCID,
                    localID: localID,
                    targetID: targetID,
                    actionType: 'draft'
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
                var CBData = {
                    _type: type,
                    _localID: localID,
                    _targetID: targetID,
                    command: {
                        left: left,
                        top: top
                    }
                };
                return CBData;
            }
            return false;
        },
        /**
         * 同步外部数据----back操作
         * */
        update: function update(data) {
            var targetID = data._targetID,
                type = targetID.substring(0, targetID.indexOf('_')),
                localID = data._localID,
                left = data.command.left,
                top = data.command.top;
            var tarID = this.getChildID(type, targetID);
            var curShape = this.allShapesArr[type][tarID];
            curShape.x = left;
            curShape.y = top;
            curShape.propersData.x = left;
            curShape.propersData.y = top;
            //记录拖动
            curShape.propersData.dragInfo.push({ x: left, y: top });
        }
    };
    module.exports = draft;
})();