/**
 * Created by haoweirui
 * modified on 2017/8/28
 * +++++++++++++++reEdit++++++++++++++++
 */
(function () {
    let _name = '*********reEdit***********';
    let reEdit = {
        ownerID : "",
        mouseDown : function (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            if(event.relatedTarget && event.relatedTarget.name.indexOf('text')!=-1){
                //开始重写
                let curTar = event.relatedTarget,
                    name = curTar.name,
                    type = name.substring(0,name.indexOf('_'));
                let tarID = this.getChildID(type,name);
                let curShape = this.allShapesArr[type][tarID];
                this.curChangeInfo.name = name;
                this.curChangeInfo.targetID = tarID;
                this.curChangeInfo.type = type;
                this.curChangeInfo.isDown = true;
                this.curChangeInfo.isUp = false;

                //先提取上一次的数据信息初始化propersData数据
                let newState = curShape.propersData.reEditInfo[curShape.propersData.reEditInfo.length-1];
                reEdit.updatePropers(newState,curShape.propersData);
                curShape.text = "";
                curShape.reEditStart(event,scaleX,scaleY,canvasW,canvasH);
                return false;
            }else if(this.curChangeInfo.type == 'text'){
                //重写打印
                let type = this.curChangeInfo.type,
                    tarID = this.curChangeInfo.targetID,
                    curShape = this.allShapesArr[type][tarID];
                curShape.reEditEnd(event,scaleX,scaleY,canvasW,canvasH);
                //记录数据
                let localSVCID = this.localSVCID++,
                    localID = 'reEdit_'+reEdit.ownerID+'_'+localSVCID,
                    targetID = curShape.name;
                console.log(localSVCID);
                this.orderList.push({
                    svcID : localSVCID,
                    localID : localID,
                    targetID : targetID,
                    actionType : 'reEdit'
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
                let reEditState = reEdit.updatePropers(curShape.propersData,{}),
                    CBData = {
                        _type : type,
                        _localID : localID,
                        _targetID : targetID,
                        command : {}
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
        mouseMove : function (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            //reEdit没有move操作
            let curShape = this.allShapesArr[this.curChangeInfo.type][this.curChangeInfo.targetID];
            if(curShape.isTexting){
                curShape.mouseMove(event,scaleX,scaleY);
            }
        },
        mouseUp : function (event,scaleX,scaleY,canvasW,canvasH) {

        },
        updatePropers : function (source,target) {
            target == undefined && (target = {});
            for(let key in source){
                if(key != 'reEditInfo'){
                    target[key] = Object.prototype.toString.call(source[key]) === '[object Object]' ? reEdit.updatePropers(source[key],target[key]) : source[key];
                }
            }
            return target;
        },
        /**
         * 同步外部数据----back操作
         * */
        update : function (data) {
            let targetID = data._targetID,
                type = targetID.substring(0,targetID.indexOf('_')),
                localID = data._localID,
                command = data.command;
            let tarID = this.getChildID(type,targetID);
            let curShape = this.allShapesArr[type][tarID];

            curShape.text = command.text;
            curShape.color = command.fontColor;
            curShape.font = command.fontSize + 'px ' + command.fontFamily;
            curShape.x = command.left;
            curShape.y = command.top;

            curShape.propersData.reEditInfo.push(curShape.deepCopy(command));
        }
    }
    module.exports = reEdit;
})();
