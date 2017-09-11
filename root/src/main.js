/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++main++++++++++++++++
 */
(function () {
    let config = require('../lib/config.json');
    let coreFuncs = require('./coreFuncs');

    console.log("|*******************************|");
    console.log(`|-------------${config.editor}-------------|`);
    console.log("|*******************************|");
    class WBSDK {
        constructor () {
            this.init();
        }
        /**
         * 打印相关的白板标签
         * */
        init () {
            Object.defineProperties(this, {
                versionInfo: {
                    value: '1.0.0',
                    enumerable: true,
                    configurable: false,
                    writable: false
                }
            });
            this.localSVCID = 0;    //当为本地模式时的模拟svcID
            this.targetID = '';          //代表当前白板的对象i
            this.allShapesArr = {};      //记录所有的shape
            this.orderList = [];         //记录所有的操作顺序
            this.currentTool = '';       //代表当前的默认工具
            this.constConf  = null;      //代表当前的常态配置信息
            this.hotUpdateConf = null;   //代表当前的可更改配置信息，支持热更新
            this.callback = null;        //外部接收笔迹数据的接口
            this.boardElems = null;    //代表当前画布的属性状态信息

            this.scaleX = 1;       //代表当前的横向缩放比例
            this.scaleY = 1;       //代表当前的纵向缩放比例

            this.isCreated = false;  //是否已经创建，避免重复创建

            this.curChangeInfo = {
                targetID : -1,
                name : '',
                type : '',
                isDown : false,
                isUp : true,
                startX : 0,
                startY : 0,
                lastPX : 0,
                lastPY : 0
            };
        }
        /**
         * 获取相关的默认配置信息
         * */
        getconf (type){
            //提供外界获取配置信息
            let data = {};
            if(type==undefined || type == 0){
                data = config.boardInfo;
            }else{
                if(type == 'const' || type == 1){
                    data = config.boardInfo.constConf;
                }else if(type == 'change' || type == 2){
                    data = config.boardInfo.hotUpdateConf;
                }else{
                    console.warn(`${config.headConsole}尝试获取非法的配置信息!`);
                }
            }
            return data;
        }
        /**
         * 创建白板
         * @param targetID 目标id
         * */
        createBoard (targetID,confInfo,dataCB) {
            try{
                if(this.isCreated){
                    //避免重复创建
                    return;
                }
                this.isCreated = true;
                //首先设置相关的配置信息
                coreFuncs.setConf.call(this,targetID,confInfo,dataCB);
                //其次创建并初始化白板
                coreFuncs.initBoard.call(this);
                //然后绑定相关的白板事件
                coreFuncs.bindCanvasEvent.call(this);
                //默认工具
                let firstTool = this.constConf.firstTool.value;
                if(config.openedTools.indexOf(firstTool) == -1){
                    firstTool = config.openedTools[0];
                    console.warn(`${config.headConsole} sdk当前不支持当前设置的默认工具，您可以尝试升级sdk或者查看最新的sdk工具支持相关文档！`);
                }
                coreFuncs.choseTool.call(this,firstTool);
            }
            catch (e){
                console.warn(`${config.headConsole} 创建白板的时候出错：`,e);
            }
        }
        /**
         * 调用工具
         * */
        draw (tool) {
            if(config.openedTools.indexOf(tool) != -1){
                coreFuncs.choseTool.call(this,tool);
            }else{
                console.warn(`${config.headConsole} sdk当前不支持该工具，您可以尝试升级sdk或者查看最新的sdk工具支持相关文档！`);
            }
        }
        /**
         * resize
         * */
        resize (width, height, left, top) {
            this.isCreated && coreFuncs.resize.call(this,width,height,left,top);
        }
        /**
         * 开始/暂停绘制
         * */
        setDrawState (type) {
            this.isCreated && coreFuncs.setDrawState.call(this,type);
        }
        /**
         * 进行展示外部数据
         * */
        turnShape (data,svcID) {
            coreFuncs.turnShape.call(this,data,svcID);
        }
        /**
         * 获取当前对象
         * */
        getChildID (type,name) {
            let i = -1;
            if(this.allShapesArr[type]){
                for(let s of this.allShapesArr[type]){
                    i++;
                    if(s.name == name){
                        return i;
                    }
                }
            }
            i = -1;
            console.warn(`${config.headConsole} 本地图形库未查找到响应的图形对象！`);
            return i;
        }
    }
    module.exports = WBSDK;
})();