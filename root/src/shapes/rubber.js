/**
 * Created by haoweirui
 * modified on 2017/8/28
 * +++++++++++++++rubber++++++++++++++++
 */
(function () {
    let _name = '*********rubber***********';
    let rubber= {
        ownerID : "",
        mouseDown : function (event,scaleX,scaleY) {
            if(event.relatedTarget){
                let curTar = event.relatedTarget,
                    name = curTar.name,
                    type = name.substring(0,name.indexOf('_'));
                let tarID = this.getChildID(type,name);
                this.curChangeInfo.name = name;
                this.curChangeInfo.targetID = tarID;
                this.curChangeInfo.type = type;
                this.curChangeInfo.isDown = true;
                this.curChangeInfo.isUp = false;
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
        mouseMove : function (event,scaleX,scaleY) {
            //橡皮擦没有move事件
        },
        mouseUp : function (event,scaleX,scaleY) {
            this.curChangeInfo.isDown = false;
            this.curChangeInfo.isUp = true;
            if(this.curChangeInfo.targetID != -1){
                let type = this.curChangeInfo.type,
                    tarID = this.curChangeInfo.targetID,
                    curShape = this.allShapesArr[type][tarID];
                curShape.visible = false;
                curShape.propersData.rubberInfo.push(false);

                //记录数据
                let localSVCID = this.localSVCID++,
                    localID = 'rubber_'+rubber.ownerID+'_'+localSVCID,
                    targetID = curShape.name;
                console.log(localSVCID);
                this.orderList.push({
                    svcID : localSVCID,
                    localID : localID,
                    targetID : targetID,
                    actionType : 'rubber'
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
                let CBData = {
                    _type : type,
                    _localID : localID,
                    _targetID : targetID,
                    command : {}
                };
                return CBData;
            }
            return false;
        },
        /**
         * 同步外部数据----back操作
         * */
        update : function (data) {
            let targetID = data._targetID,
                type = targetID.substring(0,targetID.indexOf('_')),
                localID = data._localID;
            let tarID = this.getChildID(type,targetID);
            let curShape = this.allShapesArr[type][tarID];
            curShape.visible = false;
            curShape.propersData.rubberInfo.push(false);
        }
    }
    module.exports = rubber;
})();