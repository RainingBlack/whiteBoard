/**
 * Created by haoweirui
 * modified on 2017/8/30
 * +++++++++++++++back++++++++++++++++
 */
(function () {
    let conf = require('../../lib/config.json');
    let _name = '*********back***********';
    let back = {
        action : function (scaleX,scaleY,canvasW,canvasH) {
            console.log(this.orderList);
            let lastHandle = this.orderList.pop();
            if(lastHandle){
                let svcID = lastHandle.svcID,
                    localID = lastHandle.localID,
                    targetID = lastHandle.targetID || localID,
                    actionType = lastHandle.actionType,
                    type = targetID.substring(0,targetID.indexOf('_')),
                    tarID = this.getChildID(type,targetID);
                let curShape = this.allShapesArr[type][tarID];
                if(curShape){
                    if(actionType == 'add'){
                        //回退添加 直接把他隐藏
                        curShape.visible = false;
                    }else if(actionType == 'draft'){
                        curShape.propersData.dragInfo.pop();
                        let isText = (type == 'text'),
                            textState = null;
                        if(isText && curShape.propersData.reEditInfo.length>0){
                            textState = curShape.propersData.reEditInfo[curShape.propersData.reEditInfo.length-1];
                        }
                        if(curShape.propersData.dragInfo.length == 0){
                            if(textState){
                                curShape.x = textState.left;
                                curShape.y = textState.top;
                            }else{
                                curShape.x = 0;
                                curShape.y = 0;
                            }
                        }else{
                            let currentState = curShape.propersData.dragInfo[curShape.propersData.dragInfo.length-1];
                            curShape.x = currentState.x;
                            curShape.y = currentState.y;
                            }
                    }else if(actionType == 'rubber'){
                        curShape.propersData.rubberInfo.pop();
                        if(curShape.propersData.rubberInfo.length == 0){
                            curShape.visible = true;
                        }else{
                            let currentState = curShape.propersData.rubberInfo[curShape.propersData.dragInfo.length-1];
                            curShape.visible = currentState;
                        }
                    }else if(actionType == 'reEdit'){
                        if(type == 'text'){
                            curShape.propersData.reEditInfo.pop();
                            if(curShape.propersData.reEditInfo.length == 0){
                                curShape.visible = false;
                            }else{
                                let curTextState = curShape.propersData.reEditInfo[curShape.propersData.reEditInfo.length-1],
                                    text = curTextState.text,
                                    left = curTextState.left + 2*curShape.propersData.borderWidth,
                                    top = curTextState.top + 2*curShape.propersData.borderWidth;
                                curShape.text = text;
                                curShape.x = left;
                                curShape.y = top;
                            }
                        }else{
                            console.warn(`${conf.headConsole} 尝试对一个非文字回退重写操作！`)
                            return false;
                        }
                    }
                }else{
                    console.warn(`${conf.headConsole} 尝试回退一个不存在的目标轨迹！`);
                    return false;
                }
                //组装并回调数据
                let CBData = {
                    type : type,
                    _targetID : targetID,
                    _type : 'back',
                    _svcId : -1,
                    command : {}
                };
                return CBData;
            }else{
                return false;
            }
            return false;
        },
        /**
         * 同步外部数据----back操作
         * */
        update : function (data, scaleX, scaleY) {
            let targetID = data._targetID,
                type = data.type;
            //检查当前是不是存在这个笔迹,并处在最后的位置
            if(this.orderList[this.orderList.length-1].localID != data._targetID){
                console.warn(`${conf.headConsole} 尝试回退不同的笔迹数据，会造成视觉不一致`);
            }
            back.action.call(this,scaleX,scaleY);
        }
    }
    module.exports = back;
})();