/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++coreFuncs++++++++++++++++
 */

/*
 * 负责通用调用的方法
 * */

(function () {
    let config = require('../lib/config.json');
    let myBase64 = require('./base64');
    let createjs = require('../plugs/create');
    let leader = require('./shapes/leader');

    let coreFuncs =  {
        //在绘制时记录所有的点信息
        pointsArr : [],
        //代表不同的事件是否被触发过
        eventDown : false,
        eventMove : false,
        eventUp : true,
        //用于绘制过程使用的createjs相关对象
        curStage : null,
        curShape : null,
        //用于选中的操作
        curSelectShape : null,
        selectType : '',

        draftData : {
            targetFunc : null,
            targetShape : null
        },
        reEditData : {
            targetFunc : null,
            targetShape : null
        },
        rubberData : {
            targetFunc : null,
            targetShape : null
        },
        backData : {
            targetFunc : null
        },
        clearData : {
            targetFunc : null
        },

        timer : null,//显示信息时用到的timer对象
        TIME : 3000,//定时消失时间
        curShowName : '',//当前的展示的信息的所有者name，防抖处理

        /**
         * 设置配置信息
         * */
        setConf : function (targetID,confInfo,dataCB) {
            let constConf = null,
                hotUpdateConf = null;
            if(confInfo){
                //如果存在配置信息
                if(confInfo.constConf != undefined || confInfo.type == "const"){
                    constConf = confInfo.constConf || confInfo;
                }
                if(confInfo.hotUpdateConf != undefined || confInfo.type == "hotUpdate"){
                    hotUpdateConf = confInfo.hotUpdateConf || confInfo;
                }
            }
            //如果外部未传入相关的配置信息或者配置信息遭到非法破坏 那么直接取默认的配置信息
            constConf = constConf || config.boardInfo.constConf;
            hotUpdateConf = hotUpdateConf || config.boardInfo.hotUpdateConf;

            //定义权限  可以枚举 但不可编辑和删除
            let root =  {
                enumerable: true,
                configurable: false,
                writable: false
            }

            this.hotUpdateConf = hotUpdateConf;
            this.constConf = constConf;
            this.targetID = targetID;
            this.callback = dataCB;
            // 改变值属性
            Object.defineProperties(this, {constConf : root,targetID : root,callback : root});
            Object.defineProperties(this.constConf, {
                type : root,
                targetID : root,
                callback : root,
                ownerID : root,
                isOnline : root,
                module : root,
                reEdit : root,
                firstTool : root,
                baseSize : root
            });
            Object.defineProperties(this.constConf.ownerID, {value: root,info: root});
            Object.defineProperties(this.constConf.isOnline, {value: root,info: root});
            Object.defineProperties(this.constConf.module, {value: root,info: root});
            Object.defineProperties(this.constConf.reEdit, {value: root,info: root});
            Object.defineProperties(this.constConf.firstTool, {value: root,info: root});
            Object.defineProperties(this.constConf.baseSize, {value: root,info: root});
        },
        /**
         * 创建并初始化白板
         * */
        initBoard : function () {
            //创建画板并记录
            let parentCon = $('#'+this.targetID),
                boardContain = $('<div id="'+this.targetID+'_boardContain'+'" style="overflow: hidden"></div>').appendTo(parentCon),
                canvas = $('<canvas id="'+this.targetID+'_canvas'+'"></canvas>').appendTo(boardContain),
                inputCon =  $('<div id="' + this.targetID + '_inputCon" data-type="border" autofocus="autofocus" tabindex="-1"></div>').appendTo(boardContain),
                input = $('<span id="' + this.targetID + '_input" contenteditable="true"></span>').appendTo(inputCon),
                inputConBak = $('<div id="' + this.targetID + '_inputConBak" data-type="border" autofocus="autofocus" tabindex="-1"></div>').appendTo(boardContain),
                inputBak = $('<span id="' + this.targetID + '_inputBak" contenteditable="true"></span>').appendTo(inputConBak),
                showInfoCon = $('<div id="' + this.targetID + '_showInfoCon"></div>').appendTo(boardContain),
                showInfo = $('<span id="' + this.targetID + '_showInfo"></span>').appendTo(showInfoCon),
                inputConCss = {
                    'display': 'none',
                    'position': 'absolute',
                    'cursor' :'move',
                    'z-index':100,
                    'overflow': 'hidden'
                },
                inputCss = {
                    'border': '0px',
                    'cursor': 'text',
                    'word-break': 'break-all',
                    'white-space': 'pre-wrap',
                    'word-wrap': 'break-word',
                    'overflow': 'hidden',
                    'margin': '0px 0px 0px 0px',
                    'outline':0
                },
                showInfoConCss = {
                    'display' : 'none',
                    'position' : 'absolute',
                    'background' : 'rgba(112,115,121,0.6)',
                    'padding' : '2px 4px 2px 4px',
                    'border-radius': '5px',
                    'z-index' : 100
                },
                showInfoCss = {
                    'overflow': 'hidden',
                    'margin': '0px 0px 0px 0px'
                },
                width = this.hotUpdateConf.property_board.width,
                height = this.hotUpdateConf.property_board.height,
                marginTop = this.hotUpdateConf.property_board.top,
                marginLeft = this.hotUpdateConf.property_board.left,
                color = this.hotUpdateConf.property_board.color,
                top = this.hotUpdateConf.property_board.top,
                left = this.hotUpdateConf.property_board.left,
                boardContainCss = {
                    'position' : 'relative',
                    'width' : width,
                    'height' : height,
                    'margin-top' : marginTop,
                    'margin-left' : marginLeft
                },
                canvasCss = {
                    'position' : 'absolute',
                    'top' : '0px',
                    'left' : '0px',
                    'background-color' : color,
                    'z-index' : config.canvasIndex
                };


            boardContain.css(boardContainCss);

            canvas.attr({
                'width':width,
                'height':parseInt(height)+100
            });
            canvas.css(canvasCss);

            inputCon.css(inputConCss);
            input.css(inputCss);
            inputConBak.css({
                'z-index' : -1,
                'position' : 'absolute',
                'left' : 0,
                'top' : height
            });

            inputCon.css({'background':'red','top':'50px','left':'50px'});

            //展示信息样式
            showInfoCon.css(showInfoConCss);
            showInfo.css(showInfoCss);

            //获取stage对象
            let stage = new createjs.Stage(this.targetID+'_canvas'),
                tem_canvas = document.getElementById(this.targetID+'_canvas'),
                tem_context = tem_canvas.getContext('2d');
            stage.compositeOperation = 'source-over';
            stage.updateContext(tem_context);
            coreFuncs.curStage = stage;
            //下面视情况开放画板的好性能功能
            if(config.openedTools.indexOf('reEdit') != -1 || config.openedTools.indexOf('drag') != -1 || config.openedTools.indexOf('rubber') != -1){
                stage.enableMouseOver(20);
            }
            //记录canvas的相关对象
            this.boardElems = {
                boardContain : {
                    target : boardContain,
                    idName : boardContain[0].id,
                    width : width,
                    height : height,
                    top : top,
                    left : left
                },
                canvas : {
                    target : canvas,
                    idName : canvas[0].id,
                    stage : stage
                },
                inputCon : {
                    target : inputCon,
                    idName : inputCon[0].id,
                    cssInfo : {
                        'min-width' : inputCon.css('min-width'),
                        '_width' : inputCon.css('_width'),
                        'min-height' : inputCon.css('min-height'),
                        '_height' : inputCon.css('_height'),
                        'position' : inputCon.css('position'),
                        'z-index' : inputCon.css('z-index'),
                        'overflow' : inputCon.css('overflow')
                    }
                },
                inputText : {
                    target : input,
                    idName : input[0].id,
                    cssInfo : {
                        'border' : input.css('border'),
                        'background-color' : input.css('background-color'),
                        'cursor' : input.css('cursor'),
                        'word-break' : input.css('word-break'),
                        'white-space' : input.css('white-space'),
                        'word-wrap' : input.css('word-wrap'),
                        'overflow' : input.css('overflow'),
                        'margin' : input.css('margin')
                    }
                },
                inputConBak : {
                    target : inputConBak,
                    idName : inputConBak[0].id
                },
                inputTextBak : {
                    target : inputBak,
                    idName : inputBak[0].id
                },
                showInfoCon : {
                    target : showInfoCon,
                    idName : showInfoCon[0].id
                },
                showInfo : {
                    target : showInfo,
                    idName : showInfo[0].id
                }
            };
            //引入单例函数
            coreFuncs.draftData.targetFunc = leader.getTool('draft',this.constConf.ownerID.value);
            coreFuncs.reEditData.targetFunc = leader.getTool('reEdit',this.constConf.ownerID.value);
            coreFuncs.rubberData.targetFunc = leader.getTool('rubber',this.constConf.ownerID.value);
            coreFuncs.backData.targetFunc = leader.getTool('back',this.constConf.ownerID.value);
            coreFuncs.clearData.targetFunc = leader.getTool('clear',this.constConf.ownerID.value);

            //resize一次 设置scale
            coreFuncs.resize.call(this);

            //屏蔽一些快捷键
            document.onkeydown = function() {
                if (config.BanKey.indexOf(event.keyCode) != -1) {
                    return false;
                }
            }
        },
        /**
         * 绑定白板事件
         * */
        bindCanvasEvent : function () {
            if(this.constConf.module.value != 'draw'){
                return;
            }
            //首先判断是否是移动端 决定是否开启触摸事件监听
            createjs.Touch.isSupported()?(createjs.Touch.enable(this.boardElems.canvas.stage)):1;
            let self = this,
                stage = this.boardElems.canvas.stage;
            let events = [
                {'stagemousedown' : coreFuncs.mouseDown.bind(self)},
                {'stagemousemove' : coreFuncs.mouseMove.bind(self)},
                {'stagemouseup' : coreFuncs.mouseUp.bind(self)}
            ];
            for(let objectEvent of events){
                //首先移除事件再绑定事件   避免多次调用出现多次绑定的情况出现
                stage.removeEventListener(Object.keys(objectEvent)[0],Object.values(objectEvent)[0]);
                stage.addEventListener(Object.keys(objectEvent)[0],Object.values(objectEvent)[0]);
            }
        },
        /**
         * 工具选择
         * */
        choseTool : function (type) {
            let canvasW = this.hotUpdateConf.property_board.width,
                canvasH = this.hotUpdateConf.property_board.height;
            if(this.currentTool == 'text' && coreFuncs.curShape && coreFuncs.curShape.isTexting){
                coreFuncs.mouseDown.call(this,window.event,this.scaleX,this.scaleY,canvasW,canvasH);
            }
            if(type == 'back'){
                let CBData = coreFuncs.backData.targetFunc.action.call(this,this.scaleX,this.scaleY,canvasW,canvasH);
                coreFuncs.curStage.update();
                //检测如果运行成功则回调数据
                if(CBData){
                    coreFuncs.callbackData.call(this,'back',CBData);
                }
            }else if(type == 'clear'){
                let CBData = coreFuncs.clearData.targetFunc.action.call(this,this.scaleX,this.scaleY,canvasW,canvasH);
                coreFuncs.curStage.update();
                //检测如果运行成功则回调数据
                if(CBData){
                    coreFuncs.callbackData.call(this,'clear',CBData);
                }
            }else{
                this.currentTool = type;
                //下面视情况开放画板的好性能功能
                //先全部解绑事件
                let self = this,
                    stage = this.boardElems.canvas.stage;
                stage._listeners['mouseover'] = null;
                stage._listeners['mouseout'] = null;
                if(this.constConf.recordInfo.value.length > 0 || (type == 'text' && config.openedTools.indexOf('reEdit') != -1) || (type == 'draft' && config.openedTools.indexOf('draft') != -1) || (type == 'rubber' && config.openedTools.indexOf('rubber') != -1)){
                    stage.addEventListener('mouseover',coreFuncs.mouseOver.bind(self));
                    stage.addEventListener('mouseout',coreFuncs.mouseOut.bind(self));
                }
            }

            // if(type == 'text'){
            // //文字特殊处理
            // }else if(type == 'outer'){
            // //外部图形库特殊处理
            // }else{
            // //其他工具
            // }
        },
        /**
         * 点击事件
         * */
        mouseDown : function (event) {
            event = event || window.event;
            if(this.hotUpdateConf.pauseDraw){
                return;
            }

            let canvasW = this.hotUpdateConf.property_board.width,
                canvasH = this.hotUpdateConf.property_board.height;
            if(!coreFuncs.eventUp){//确保本次down事件之前的up事件已经发生
                coreFuncs.mouseUp.call(this,event);
                return;
            }

            coreFuncs.eventDown = true;
            let isDraft = (config.openedTools.indexOf('draft') != -1)&&(this.currentTool == 'draft'),//拖动
                isText = (this.currentTool == 'text'),//文字
                isTextStart = isText && (!event.relatedTarget || event.relatedTarget.name.indexOf('text') == -1) &&
                    (coreFuncs.curShape == null || coreFuncs.curShape.isTexting == undefined || coreFuncs.curShape.isTexting == false),//刚开始要写
                isTextEnd = isText && (coreFuncs.curShape && coreFuncs.curShape.isTexting),//写完要打印
                isReEdit = (config.openedTools.indexOf('reEdit') != -1) && isText && !isTextStart && !isTextEnd || this.curChangeInfo.type == 'text',//重写
                isRubber = (config.openedTools.indexOf('rubber') != -1)&&(this.currentTool == 'rubber'),//橡皮
                isOthers = (config.openedTools.indexOf(this.currentTool) != -1);//其他合法的类型
            if(isDraft || isReEdit || isRubber){
                if(isDraft){
                    coreFuncs.selectType = 'draft';
                    coreFuncs.draftData.targetFunc.mouseDown.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
                }else if(isReEdit){
                    coreFuncs.selectType = 'reEdit';
                    let CBData = coreFuncs.reEditData.targetFunc.mouseDown.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
                    //检测如果运行成功则回调数据
                    if(CBData){
                        coreFuncs.callbackData.call(this,'reEdit',CBData);
                    }
                }else if(isRubber){
                    coreFuncs.selectType = 'rubber';
                    coreFuncs.rubberData.targetFunc.mouseDown.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
                }
                coreFuncs.curStage.update();
            }
            else if(isOthers){
                //还原，以便move可以不再重新判断
                coreFuncs.selectType = '';
                if(this.currentTool!='text' || isTextStart){
                    coreFuncs.curShape = leader.getTool(this.currentTool,this.constConf.ownerID.value);
                    coreFuncs.curShape.setPropertyForShape(this.constConf,this.hotUpdateConf,this.boardElems);
                    coreFuncs.curStage.addChild(coreFuncs.curShape);
                    //保存笔迹对象
                    let name = coreFuncs.curShape.name.substring(0,coreFuncs.curShape.name.indexOf('_')),
                        localSVCID = this.localSVCID++;
                    console.log(localSVCID);
                    this.allShapesArr[name] = this.allShapesArr[name] || [];
                    this.allShapesArr[name].push(coreFuncs.curShape);
                    this.orderList.push({
                        svcID : localSVCID,
                        localID : coreFuncs.curShape.name,
                        actionType : 'add'
                    });
                }

                coreFuncs.curShape.mouseDown(event,this.scaleX,this.scaleY,canvasW,canvasH);
                coreFuncs.curStage.update();

                //单独对文字进行一个数据的回调
                if(isTextEnd){
                    coreFuncs.callbackData.call(this,'text',{});
                }
            }
        },
        /**
         * 移动事件
         * */
        mouseMove : function (event) {
            event = event || window.event;
            if(this.hotUpdateConf.pauseDraw){
                return;
            }
            let isDown = coreFuncs.eventDown,//是不是已经点击了
                isText = coreFuncs.curShape && coreFuncs.curShape.isTexting && this.currentTool == 'text' && this.curChangeInfo.type != 'text',//text时拖动
                isSelect = coreFuncs.selectType == "" ? false : true;
            let canvasW = this.hotUpdateConf.property_board.width,
                canvasH = this.hotUpdateConf.property_board.height;
            if((isDown || isText) && !isSelect){
                coreFuncs.eventMove = true;
                coreFuncs.curShape.mouseMove(event,this.scaleX,this.scaleY,canvasW,canvasH);
                coreFuncs.curStage.update();
            }else if(isDown && isSelect){
                if(coreFuncs.selectType == 'draft' || coreFuncs.selectType == 'text'){
                    coreFuncs.draftData.targetFunc.mouseMove.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
                }
                coreFuncs.curStage.update();
            }else if(this.currentTool == 'text' && this.curChangeInfo.type == 'text' && this.curChangeInfo.targetID != -1){
                coreFuncs.reEditData.targetFunc.mouseMove.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
            }
        },
        /**
         * 点击抬起事件
         * */
        mouseUp : function (event) {
            event = event || window.event;
            if(this.hotUpdateConf.pauseDraw){
                return;
            }

            //检测是不是移动过
            let isMove = coreFuncs.eventMove,
                isSelect = coreFuncs.selectType == "" ? false : true;
            let canvasW = this.hotUpdateConf.property_board.width,
                canvasH = this.hotUpdateConf.property_board.height;

            if(coreFuncs.eventDown && !isSelect){//保证down和up事件成双成对
                coreFuncs.curShape.mouseUp(event,this.scaleX,this.scaleY,canvasW,canvasH);
                coreFuncs.curStage.update();
                //统一风格的进行统一的回调(文字除外)
                if(this.currentTool != 'text'){
                    coreFuncs.callbackData.call(this,this.currentTool,{});
                }
            }else if(isSelect){
                if(coreFuncs.selectType == 'draft'){
                    let CBData = coreFuncs.draftData.targetFunc.mouseUp.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
                    //检测如果运行成功则回调数据
                    if(CBData){
                        coreFuncs.callbackData.call(this,'draft',CBData);
                    }
                }else if(coreFuncs.selectType == 'rubber'){
                    let CBData = coreFuncs.rubberData.targetFunc.mouseUp.call(this,event,this.scaleX,this.scaleY,canvasW,canvasH);
                    //检测如果运行成功则回调数据
                    if(CBData){
                        coreFuncs.callbackData.call(this,'rubber',CBData);
                    }
                }
                coreFuncs.curStage.update();
            }
            coreFuncs.eventUp = true;
            coreFuncs.eventDown = false;
        },
        /**
         * 鼠标滑过事件
         * */
        mouseOver : function (event) {
            event = event || window.event;
            let curShape = event.target,
                isDown = coreFuncs.eventDown;
            let isReEdit = (config.openedTools.indexOf('reEdit') != -1) && this.currentTool == 'text' && (!coreFuncs.curShape.isTexting),//写字重写时选择
                isDraftSelect = (config.openedTools.indexOf('draft') != -1)&&(this.currentTool == 'draft'),//拖动时选择
                isRubber = (config.openedTools.indexOf('rubber') != -1)&&(this.currentTool == 'rubber');//橡皮时选择
            if(!coreFuncs.eventDown){
                //只有在没有按下鼠标的时候才会执行
                //只有符合这些条件才会执行
                if(isReEdit || isDraftSelect || isRubber){
                    //首先变化颜色
                    coreFuncs.changeColor.call(this,event,'over');
                    coreFuncs.curStage.update();
                }
                //防抖处理
                if(coreFuncs.curShowName != curShape.name){
                    let pX = event.stageX,
                        pY = event.stageY,
                        info = curShape.propersData.recordInfo;
                    coreFuncs.showInfo.call(this,pX,pY,info);
                }
            }
        },
        /**
         * 鼠标移出事件*/
        mouseOut : function (event) {
            event = event || window.event;
            coreFuncs.changeColor.call(this,event,'out');
            coreFuncs.curStage.update();
            coreFuncs.curShowName = '';
        },
        /**自适应
         * */
        resize : function (width, height, left, top) {
            //容错
            width = width || width == 0 || this.hotUpdateConf.property_board.width;
            height = height || height == 0 || this.hotUpdateConf.property_board.height;
            left = left || left == 0 || this.hotUpdateConf.property_board.left;
            top = top || top == 0 || this.hotUpdateConf.property_board.top;

            //首先更新值信息
            this.hotUpdateConf.property_board.width = parseInt(width);
            this.hotUpdateConf.property_board.height = parseInt(height);
            this.hotUpdateConf.property_board.left = parseInt(left);
            this.hotUpdateConf.property_board.top = parseInt(top);

            //更新视图
            this.boardElems.boardContain.target.css({
                width : width,
                height : height,
                'margin-top' : top,
                'margin-left' : left
            });
            this.boardElems.canvas.target.attr({
                width : width,
                height : height
            });

            //缩放画布，重绘
            let scaleX = parseInt(width) / this.constConf.baseSize.value[0],
                scaleY = parseInt(height) / this.constConf.baseSize.value[1];

            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.boardElems.canvas.stage.scaleX = scaleX;
            this.boardElems.canvas.stage.scaleY = scaleY;
            this.boardElems.canvas.stage.update();
        },
        /**
         * 开始、暂停绘制
         * */
        setDrawState : function (type) {
              if(!type){
                  //暂停绘制
                  if(coreFuncs.eventDown && coreFuncs.currentTool!='text'){
                      coreFuncs.mouseUp.call(this);
                  }else if(coreFuncs.currentTool=='text' && (coreFuncs.curShape && coreFuncs.curShape.isTexting)){
                      coreFuncs.mouseDown.call(this);
                  }
                  this.hotUpdateConf.pauseDraw = true;
              }else{
                  //开始绘制
                  this.hotUpdateConf.pauseDraw = false;
              }
        },
        /**
         * 检测是否有回调函数，并回调绘制信息
         * */
        callbackData (type,CBData) {
            //首先检测是不是是要发送到对面去
            if(this.callback){
                switch (type){
                    case 'text':
                        CBData = coreFuncs.deepCopy(coreFuncs.curShape.propersData);
                        CBData.text = myBase64.encode(CBData.text);
                        CBData.command = {};
                        CBData.agreeType = 'add';
                        break;
                    case 'draft':
                        CBData.agreeType = 'add';
                        break;
                    case 'reEdit':
                        CBData.agreeType = 'add';
                        break;
                    case 'rubber':
                        CBData.agreeType = 'add';
                        break;
                    case 'back':
                        CBData.agreeType = 'del';
                        break;
                    case 'clear':
                        CBData.agreeType = 'clear';
                        break;
                    default:
                        //其他的风格一样的就放一起处理了有：pencil highPencil arrow rect circle
                        let curPosData = coreFuncs.curShape.graphics.getInstructions();
                        CBData = coreFuncs.deepCopy(coreFuncs.curShape.propersData);
                        curPosData = coreFuncs.delRepeat(curPosData);
                        CBData.command = curPosData;
                        CBData._localID = coreFuncs.curShape.name;
                        CBData.agreeType = 'add';
                        break;
                }
                //打标签
                CBData._type = type;
                CBData._ownerID = this.constConf.ownerID.value;
                this.callback(CBData);
            }
        },
        /**
         * 变换选中颜色
         * */
        changeColor : function (event,type) {
            let curTar = event.target,
                curType = event.target.name.substring(0,event.target.name.indexOf('_')),
                selectColor = this.hotUpdateConf.property_other.selectedColor;
            let curShapeID = this.getChildID(curType,curTar.name);
            let curShape = this.allShapesArr[curType][curShapeID];
            let isLeText = this.currentTool == 'text' && curType == 'text';
            if(this.currentTool != 'text' || isLeText){
                if(type == 'out'){
                    switch (curType){
                        case 'pencil':
                            curShape.graphics._stroke.style = curShape.propersData.color;
                            break;
                        case 'arrow':
                            curShape.graphics._stroke.style = curShape.propersData.color;
                            curShape.graphics._fill.style = curShape.propersData.color;
                            break;
                        case 'rect':
                            curShape.graphics._stroke.style = curShape.propersData.color;
                            break;
                        case 'circle':
                            curShape.graphics._stroke.style = curShape.propersData.color;
                            break;
                        case 'highPencil':
                            curShape.graphics._stroke.style = curShape.propersData.color;
                            break;
                        case 'text':
                            curShape.color = curShape.propersData.fontColor;
                            break;
                    }
                }else if(type == 'over'){
                    switch (curType){
                        case 'pencil':
                            curShape.graphics._stroke.style = selectColor;
                            break;
                        case 'arrow':
                            curShape.graphics._stroke.style = selectColor;
                            curShape.graphics._fill.style = selectColor;
                            break;
                        case 'rect':
                            curShape.graphics._stroke.style = selectColor;
                            break;
                        case 'circle':
                            curShape.graphics._stroke.style = selectColor;
                            break;
                        case 'highPencil':
                            curShape.graphics._stroke.style = selectColor;
                            break;
                        case 'text':
                            curShape.color = selectColor;
                            break;
                    }
                }
            }
        },
        /**
         * 用于对象的深度拷贝
         * */
        deepCopy : function (source){
            let result = {};
            for (let key in source) {
                result[key] = Object.prototype.toString.call(source[key]) === '[object Object]' ? this.deepCopy(source[key]) : source[key];
            }
            return result;
        },
        /**
         * 去除重复数据
         * */
        delRepeat : function (arr) {
            let tem = [];
            for(let obj of arr){
                if(obj.x != undefined){
                    tem.push(obj);
                }
            }
            return tem;
        },
        /**
         * 用于展示外部数据
         * */
        turnShape : function (data, svcID) {
            let type = data._type,
                ownerID = data._ownerID,
                name = type,
                normalTypes = ['pencil','highPencil','rect','circle','arrow'];
            let canvasW = this.hotUpdateConf.property_board.width,
                canvasH = this.hotUpdateConf.property_board.height;
            let constConf = this.constConf,
                hotConf = this.hotUpdateConf;
            if(ownerID != constConf.ownerID.value){
                //做统一处理的部分
                type = normalTypes.indexOf(type) != -1 ? '_fool' : type;
                let orderData = null;
                switch(type){
                    case '_fool':
                        coreFuncs.curShape = leader.getTool(name,this.constConf.ownerID.value);
                        //修改name
                        coreFuncs.curShape.name = data.name;
                        coreFuncs.curShape.turnShape(constConf,hotConf,data);
                        coreFuncs.curStage.addChild(coreFuncs.curShape);

                        this.allShapesArr[name] = this.allShapesArr[name] || [];
                        this.allShapesArr[name].push(coreFuncs.curShape);

                        orderData = {
                            svcID : svcID,
                            localID : coreFuncs.curShape.name,
                            actionType : 'add'
                        };
                        break;
                    case 'text':
                        data.text = myBase64.decode(data.text);
                        coreFuncs.curShape = leader.getTool('text',this.constConf.ownerID.value);
                        //修改name
                        coreFuncs.curShape.name = data.name;

                        coreFuncs.curShape.turnShape(constConf,hotConf,this.boardElems,data);
                        coreFuncs.curStage.addChild(coreFuncs.curShape);

                        this.allShapesArr[name] = this.allShapesArr[name] || [];
                        this.allShapesArr[name].push(coreFuncs.curShape);

                        orderData = {
                            svcID : svcID,
                            localID : coreFuncs.curShape.name,
                            actionType : 'add'
                        };
                        break;
                    case 'rubber':
                        coreFuncs.rubberData.targetFunc.update.call(this,data,this.scaleX,this.scaleY,canvasW,canvasH);

                        orderData = {
                            svcID : svcID,
                            localID : data._localID,
                            targetID : data._targetID,
                            actionType : 'rubber'
                        };
                        break;
                    case 'draft':
                        coreFuncs.draftData.targetFunc.update.call(this,data,this.scaleX,this.scaleY,canvasW,canvasH);

                        orderData = {
                            svcID : svcID,
                            localID : data._localID,
                            targetID : data._targetID,
                            actionType : 'draft'
                        };
                        break;
                    case 'reEdit':
                        coreFuncs.reEditData.targetFunc.update.call(this,data,this.scaleX,this.scaleY,canvasW,canvasH);
                        orderData = {
                            svcID : svcID,
                            localID : data._localID,
                            targetID : data._targetID,
                            actionType : 'reEdit'
                        }
                        this.localSVCID++;//保证总数相同
                        break;
                    case 'back':
                        coreFuncs.backData.targetFunc.update.call(this,data,this.scaleX,this.scaleY);
                        break;
                    case 'clear':
                        coreFuncs.clearData.targetFunc.update.call(this);
                        break;
                    default:
                        console.warn(`${config.headConsole} 出现新的同步但是未设置同步操作！`);
                        break;
                }
                if(orderData){
                    this.orderList.push(orderData);
                    this.localSVCID++;//保证总数相同
                    this.orderList = coreFuncs.quitSort(this.orderList);//重排序
                }

                coreFuncs.curStage.update();
            }
            else{
                //处理自己信息的id排序
                let localID = data.name || data._localID || -1;//像back clear这种协议是不需要记录在orderlist中的所以不需要排序
                if(localID != -1){
                    for(let s of this.orderList){
                        if(s.localID == localID){
                            s.svcID = svcID;
                            break;
                        }
                    }
                    this.orderList = coreFuncs.quitSort(this.orderList);
                }
            }
        },
        /**
         * 快速排序
         * */
        quitSort :function (arr) {
            if(arr.length <= 1){
                return arr;
            }
            let middleIndex = Math.floor(arr.length/2),
                middle = arr.splice(middleIndex,1)[0],
                left = [],
                right = [];
            for(let s of arr){
                if(s.svcID < middle.svcID){
                    left.push(s);
                }else{
                    right.push(s);
                }
            }
            return coreFuncs.quitSort(left).concat([middle],coreFuncs.quitSort(right));
        },
        /**
         * 提示笔迹信息
         * */
        showInfo : function (posX, posY, infos) {
            if(coreFuncs.timer){
                window.clearTimeout(coreFuncs.timer);
                coreFuncs.timer = null;
            }
            let showCon = this.boardElems.showInfoCon.target,
                show = this.boardElems.showInfo.target,
                info = '',
                top = this.boardElems.boardContain.height + 10,
                left = posX + 5;
            showCon.show();
            showCon.css({
                top : top,
                left : left
            });
            for(let k of infos){
                info += (k+'\r\n');
            }
            info.substring(0,info.lastIndexOf('\r\n'));//移除最后的回车
            showCon.text(info);
            top = posY - showCon.height();
            showCon.css({
                top : top,
                left : left
            });
            //设置失效
            coreFuncs.timer = window.setTimeout(function () {
                this.boardElems.showInfoCon.target.hide();
                window.clearTimeout(coreFuncs.timer);
                coreFuncs.timer = null;
            }.bind(this),coreFuncs.TIME);
        }
    }
    module.exports = coreFuncs;
})();