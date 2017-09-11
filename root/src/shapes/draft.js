/**
 * Created by haoweirui
 * modified on 2017/8/28
 * +++++++++++++++draft++++++++++++++++
 */
(function () {
    let _name = '*********draft***********';
    let draft= {
        ownerID : "",
        mouseDown : function (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            if(event.relatedTarget){
                let curTar = event.relatedTarget,
                    name = curTar.name,
                    type = name.substring(0,name.indexOf('_'));
                let tarID = this.getChildID(type,name);
                let curShape = this.allShapesArr[type][tarID],
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
        mouseMove : function (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            if(this.curChangeInfo.isDown){
                let type = this.curChangeInfo.type,
                    tarID = this.curChangeInfo.targetID,
                    curShape = this.allShapesArr[type][tarID];
                curShape.x = stageX - this.curChangeInfo.startX + this.curChangeInfo.lastPX;
                curShape.y = stageY - this.curChangeInfo.startY + this.curChangeInfo.lastPY;
            }
        },
        mouseUp : function (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            this.curChangeInfo.isDown = false;
            this.curChangeInfo.isUp = true;
            if(this.curChangeInfo.targetID != -1){
                let type = this.curChangeInfo.type,
                    tarID = this.curChangeInfo.targetID,
                    curShape = this.allShapesArr[type][tarID],
                    left = stageX - this.curChangeInfo.startX + this.curChangeInfo.lastPX,
                    top = stageY - this.curChangeInfo.startY + this.curChangeInfo.lastPY;
                curShape.x = left;
                curShape.y = top;
                curShape.propersData.x = left;
                curShape.propersData.y = top;
                //记录拖动
                curShape.propersData.dragInfo.push({x:left,y:top});
                let localSVCID = this.localSVCID++,
                    localID = 'draft_'+draft.ownerID+'_'+localSVCID,
                    targetID = curShape.name;
                console.log(localSVCID);
                this.orderList.push({
                    svcID : localSVCID,
                    localID : localID,
                    targetID : targetID,
                    actionType : 'draft'
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
                    command : {
                        left : left,
                        top : top
                    }
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
                localID = data._localID,
                left = data.command.left,
                top = data.command.top;
            let tarID = this.getChildID(type,targetID);
            let curShape = this.allShapesArr[type][tarID];
            curShape.x = left;
            curShape.y = top;
            curShape.propersData.x = left;
            curShape.propersData.y = top;
            //记录拖动
            curShape.propersData.dragInfo.push({x:left,y:top});
        }
    }
    module.exports = draft;
})();
