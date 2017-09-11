/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++text++++++++++++++++
 */
(function () {
    let create = require('../../plugs/create');
    let _name = '*********text***********';
    class text extends create.Text {
        constructor (id) {
            super();
            this.name = 'text_'+id;
        }

        setPropertyForShape (constConf, hotConf, boardElems) {
            let name = this.name;
            this.isTexting = false;//代表当前的文本状态 hide show
            this.isMoving = false;//代表是不是移动文本模式

            this.borderWidth = 0;
            //拖拽的位置
            this.dragX = 0;
            this.dragY = 0;
            this.inputCon = boardElems.inputCon;
            this.input = boardElems.inputText;
            this.inputConBak = boardElems.inputConBak;
            this.inputTextBak = boardElems.inputTextBak;
            this.inputConCss = boardElems.inputCon.cssInfo;
            this.inputTextCss = boardElems.inputText.cssInfo;

            this.propersData = {
                name : name,
                baseSize : constConf.baseSize.value,
                recordInfo : constConf.recordInfo.value,
                fontSize : hotConf.property_text.size,
                fontFamily : hotConf.property_text.family,
                fontColor : hotConf.property_text.color,
                fontBGC : hotConf.property_text.bgColor,
                borderWidth : 5,
                borderColor : hotConf.property_other.color,
                defaultWidth : 0,
                defaultHeight : 0,
                top : 0,
                left :0,
                inputConCss : {},
                inputCss : {},
                width : 0,
                height : 0,
                text : '',
                dragInfo : [],
                rubberInfo : [],
                reEditInfo : []
            }
        }

        mouseDown (event,scaleX,scaleY,canvasW,canvasH) {
            if(!this.isTexting){
                //显示文本位置，进行边界显示，事件绑定
                let self = this,
                    fontSize = this.propersData.fontSize*scaleX,
                    borderWidth = this.propersData.borderWidth*scaleX,
                    left = event.stageX,
                    top = event.stageY;
                this.isTexting = true;

                this.borderWidth = borderWidth;

                this.propersData.defaultWidth = 2 * (fontSize+2*borderWidth);
                this.propersData.defaultHeight = fontSize+2*borderWidth;
                this.propersData.top = top/scaleY;
                this.propersData.left = left/scaleX;

                //显示文本框
                let cssTemInputCon = {
                        'min-width' : self.propersData.defaultWidth,
                        '_width' : self.propersData.defaultWidth,
                        'min-height' : self.propersData.defaultHeight,
                        '_height' : self.propersData.defaultHeight,
                        'max-height':self.propersData,
                        'top' : top,
                        'left' : left,
                        'background-color' : self.propersData.fontBGC,
                        'display' : 'block',
                        'border' : borderWidth+'px '+self.propersData.borderColor+' dashed'
                    },
                    cssTemInput = {
                        'min-width' : self.propersData.defaultWidth,
                        '_width' : self.propersData.defaultWidth,
                        'min-height' : self.propersData.defaultHeight,
                        '_height' : self.propersData.defaultHeight,
                        'font-size' : fontSize,
                        'font-family' : self.propersData.fontFamily,
                        'color' : self.propersData.fontColor,
                        'border' : '0px',
                        'display' : 'inline-block'
                    };

                this.input.target.text('');

                //记录数据
                this.propersData.width = cssTemInputCon._width;
                this.propersData.height = cssTemInputCon._height;
                this.propersData.inputConCss=Object.assign(this.inputConCss,cssTemInputCon);
                this.propersData.inputCss = Object.assign(this.inputTextCss,cssTemInput);

                this.inputCon.target.css(this.propersData.inputConCss);
                this.input.target.css(this.propersData.inputCss);

                //调整位置
                this.updateInputConPosition(scaleX,scaleY);
                //获取焦点
                this.input.target.focus();

                let names = create.Touch.isSupported()?['touchstart','touchend']:['mousedown','mouseup'];
                this.inputCon.target.on(names[0],function (e) {
                    self.inputConEvent.call(self,e,'down',scaleX,scaleY);
                });
                window.addEventListener('mouseup',function (e) {
                    self.inputConEvent.call(self,e,'up',scaleX,scaleY);
                });
            }
            else{
                //打印时
                this.isTexting = false;
                //释放必要的内存，防止内存泄漏现象发生
                this.inputCon.target.unbind();
                this.input.target.unbind();
                window.removeEventListener('mouseup',function (e) {
                    self.inputConEvent.call(self,e,'up',scaleX,scaleY);
                });
                //先同步一下数据
                this.propersData.width = this.inputCon.target.width();
                this.propersData.height = this.inputCon.target.height();
                //判断是不是靠边的情况，靠边的情况会有自动换行
                let isEdge = false,
                    marginRight = canvasW - this.propersData.left*scaleX - this.propersData.width - 2*this.borderWidth,
                    errorValue = 5;
                if(marginRight >= (-1*errorValue) && marginRight<=errorValue){
                    isEdge = true;
                }

                //打印并保存数据
                this.text = this.updateInputText(this.input.target.text(),this.propersData.inputConCss,this.propersData.inputCss,isEdge,canvasW,canvasH);
                this.color = this.propersData.fontColor;
                this.font = (this.propersData.fontSize)+ 'px ' + this.propersData.fontFamily;
                
                let l = (this.propersData.left+this.borderWidth*2/scaleX),
                    t = (this.propersData.top+this.borderWidth*2/scaleY);
                this.x = l > 0 ? l : 0;
                this.y = t > 0 ? t : 0;
                //文字比较特殊保存下数据
                this.propersData.text = this.text;
                this.propersData.reEditInfo.push(this.deepCopy(this.propersData,'reEditInfo'));

                this.inputCon.target.hide();
            }
        }

        mouseMove (event,scaleX,scaleY,canvasW,canvasH) {
            if(this.isMoving){
                //如果是在移动中的状态
                let left = event.stageX - this.dragX,
                    top = event.stageY - this.dragY;
                this.propersData.left = left / scaleX;
                this.propersData.top = top / scaleY;
                this.propersData.inputConCss.top = top + 'px';
                this.propersData.inputConCss.left = left + 'px';
                this.propersData.width = this.inputCon.target.width();
                this.propersData.height = this.inputCon.target.height();
                this.inputCon.target.css(this.propersData.inputConCss);
            }
        }

        mouseUp (event,scaleX,scaleY,canvasW,canvasH) {
        }

        reEditStart (event,scaleX,scaleY,canvasW,canvasH) {
            //显示文本位置，进行边界显示，事件绑定
            let self = this,
                fontSize = this.propersData.fontSize*scaleX,
                borderWidth = this.propersData.borderWidth*scaleX,
                left = this.x*scaleX-2*borderWidth,
                top = this.y*scaleY-2*borderWidth;
            this.isTexting = true;
            this.propersData.top = top/scaleY;
            this.propersData.left = left/scaleX;
            this.borderWidth = borderWidth;
            //显示文本框
            let cssTemInputCon = {
                    'min-width' : self.propersData.defaultWidth,
                    '_width' : self.propersData.defaultWidth,
                    'min-height' : self.propersData.defaultHeight,
                    '_height' : self.propersData.defaultHeight,
                    'max-height':self.propersData,
                    'top' : top,
                    'left' : left,
                    'background-color' : self.propersData.fontBGC,
                    'display' : 'block',
                    'border' : borderWidth+'px '+self.propersData.borderColor+' dashed'
                },
                cssTemInput = {
                    'min-width' : self.propersData.defaultWidth,
                    '_width' : self.propersData.defaultWidth,
                    'min-height' : self.propersData.defaultHeight,
                    '_height' : self.propersData.defaultHeight,
                    'font-size' : fontSize,
                    'font-family' : self.propersData.fontFamily,
                    'color' : self.propersData.fontColor,
                    'border' : '0px',
                    'display' : 'inline-block'
                };

            this.input.target.text(this.propersData.text);

            //记录数据
            this.propersData.width = cssTemInputCon._width;
            this.propersData.height = cssTemInputCon._height;
            this.propersData.inputConCss=Object.assign(this.inputConCss,cssTemInputCon);
            this.propersData.inputCss = Object.assign(this.inputTextCss,cssTemInput);

            this.inputCon.target.css(this.propersData.inputConCss);
            this.input.target.css(this.propersData.inputCss);

            //调整位置
            this.updateInputConPosition(scaleX,scaleY);
            //获取焦点
            this.input.target.focus();

            let names = create.Touch.isSupported()?['touchstart','touchend']:['mousedown','mouseup'];
            this.inputCon.target.on(names[0],function (e) {
                self.inputConEvent.call(self,e,'down',scaleX,scaleY);
            });
            window.addEventListener('mouseup',function (e) {
                self.inputConEvent.call(self,e,'up',scaleX,scaleY);
            });
        }

        reEditEnd (event,scaleX,scaleY,canvasW,canvasH) {
            //打印时
            this.isTexting = false;
            //释放必要的内存，防止内存泄漏现象发生
            this.inputCon.target.unbind();
            this.input.target.unbind();
            let self = this;
            window.removeEventListener('mouseup',function (e) {
                self.inputConEvent.call(self,e,'up',scaleX,scaleY);
            });
            //先同步一下数据
            this.propersData.width = this.inputCon.target.width();
            this.propersData.height = this.inputCon.target.height();
            //判断是不是靠边的情况，靠边的情况会有自动换行
            let isEdge = false,
                marginRight = canvasW - this.propersData.left*scaleX - this.propersData.width - 2*this.borderWidth,
                errorValue = 5;
            if(marginRight >= (-1*errorValue) && marginRight<=errorValue){
                isEdge = true;
            }

            //打印并保存数据
            this.text = this.updateInputText(this.input.target.text(),this.propersData.inputConCss,this.propersData.inputCss,isEdge,canvasW,canvasH);
            this.color = this.propersData.fontColor;
            this.font = (this.propersData.fontSize)+ 'px ' + this.propersData.inputCss['font-family'];
            let l = (this.propersData.left+this.borderWidth*2/scaleX),
                t = (this.propersData.top+this.borderWidth*2/scaleY);
            this.x = l > 0 ? l : 0;
            this.y = t > 0 ? t : 0;

            //文字比较特殊保存下数据
            this.propersData.text = this.text;
            this.propersData.reEditInfo.push(this.deepCopy(this.propersData,'reEditInfo'));

            this.inputCon.target.hide();
        }

        /**
         * 文字输入事件处理
         * */
        keyEvent (event) {

        }
        /**
         * 文本框的点击事件，用于拖拽
         * */
        inputConEvent (event,type,scaleX,scaleY,canvasW,canvasH) {
            let name = event.target.dataset.type;
            if(name == 'border'){
                if(type == 'down'){
                    this.isMoving = true;
                    this.dragX = event.offsetX>0?event.offsetX:0;
                    this.dragY = event.offsetY>0?event.offsetY:0;
                }
            }
            if(type == 'up' &&  this.isMoving){
                this.isMoving = false;
                this.updateInputConPosition(scaleX,scaleY);
            }
            // event.preventDefault();
            event.stopPropagation();
        }
        /**
         * 获取光标并移到最后
         * */
        keyAction (that) {//光标到最后
            let textbox = that;
            let sel = window.getSelection();
            let range = document.createRange();
            range.selectNodeContents(textbox);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        /**
         * 调整输入框
         * */
        updateInputConPosition (scaleX, scaleY,canvasW,canvasH) {
            //判断是不是刚开始的位置是合适的，不合适的话就做一个矫正
            let left = this.propersData.left*scaleX,
                top = this.propersData.top*scaleY,
                leftBak = left,
                topBak = top;
            //先同步一下数据
            this.propersData.width = this.inputCon.target.width();
            this.propersData.height = this.inputCon.target.height();

            if((leftBak+this.propersData.width+2*this.borderWidth)>canvasW){
                //如果横向向右超出
                left = (canvasW - this.propersData.width - 2*this.borderWidth);
            }
            if((topBak+this.propersData.height+2*this.borderWidth)>canvasH){
                //如果纵向向下超出
                top = (canvasH - this.propersData.height - 2*this.borderWidth);
            }
            if(leftBak < 0){
                //如果横向向左超出
                left = 0;
            }
            if(topBak < 0){
                //如果纵向向上超出
                top = 0;
            }
            this.propersData.inputConCss.top = top;
            this.propersData.inputConCss.left = left;
            let maxHeight = canvasH - top;
            this.propersData.inputConCss['max-height'] = maxHeight;
            this.inputCon.target.css(this.propersData.inputConCss);

            this.propersData.top = top/scaleY;
            this.propersData.left = left/scaleX;

            this.keyAction(this.input.target[0]);
        }
        /**
         * 打印在画布之前先处理下里面的文字，主要处理哪里有换行符
         * */
        updateInputText (theString,cssConData,cssInputData,isEdge,canvasW,canvasH) {
            let str_temp = "";
            let recordI = 0;//avoid dead loop  避免死循环
            let curHeight = 0;//current height  当前的高度
            let changedStr = '';//保存结果
            let fontSize = this.propersData.fontSize;
            let inputBak = this.inputTextBak.target,
                inputConBak = this.inputConBak.target;
            let self = this;
            if(isEdge){
                cssConData = this.deepCopy(cssConData);
                cssInputData = this.deepCopy(cssInputData);
                if(cssConData){
                    cssConData['z-index'] = -1;
                    cssConData.top = canvasH;
                    cssConData.left = 0;
                    cssConData.width = self.propersData.width;
                    inputConBak.css(cssConData);
                }
                if(cssInputData){
                    inputBak.css(cssInputData);
                }
                inputBak = inputBak[0];
                inputConBak = inputConBak[0];
                inputBak.innerText = "";
                for (let i = 0; i < theString.length; i++, recordI++) {
                    if (theString.charAt(i) != "\n" && theString.charAt(i) != "\r\n")//当前的字符不是换行符
                    {//no any \n
                        inputBak.innerText += theString.charAt(i);
                        //策略：
                        //先判断当前的clientHeight和上一个curHeight比较是不是变化了，如果变化了还不足以说明已经还行了，因为一些操作也能造成这种现象
                        //再拿text.fontSize/3和上面两者之间的差值作比较，以确保现在是换行
                        //这样做的理由是如果真的是换行的话，一定会大于text.fontSize/3
                        if (curHeight != 0 && inputConBak.clientHeight > curHeight &&
                            Math.abs(inputConBak.clientHeight - curHeight) > fontSize / 3)//sign of \n
                        {
                            str_temp += '\n';
                            changedStr += str_temp;
                            str_temp = theString.charAt(i);
                        } else {//no any \n 当前的字符还不是可以换行的字符
                            str_temp += theString.charAt(i);
                        }
                        if (i + 1 == theString.length) {//end  当前为最后一个字符
                            changedStr += str_temp;
                        }
                        //更新记录当前的高度
                        curHeight = inputConBak.clientHeight;
                    }
                    else//当前的字符是换行符
                    {//handle of \n
                        str_temp += '\n';
                        changedStr += str_temp;
                        str_temp = "";
                        //换行后从头再来
                        inputBak.innerText = '';
                        curHeight = inputConBak.clientHeight;
                    }
                }
                //回复现场
                inputBak.innerText = "";
            }else{
                changedStr = theString;
            }

            return changedStr;
        }
        /**
         * 深拷贝
         * */
        deepCopy (source,outKey) {
            let result = {};
            for (let key in source) {
                if(outKey != key){
                    result[key] = Object.prototype.toString.call(source[key]) === '[object Object]' ? this.deepCopy(source[key]) : source[key];
                }
            }
            return result;
        }

        /**
         * 将外部数据转化为图形
         * */
        turnShape (constConf, hotConf, boardElems, data) {
            this.setPropertyForShape(constConf,hotConf,boardElems);

            //修正数据
            this.propersData.fontSize = data.fontSize;
            this.propersData.fontFamily = data.fontFamily;
            this.propersData.fontColor = data.fontColor;
            this.propersData.top = data.top;
            this.propersData.left = data.left;
            this.propersData.width = data.width;
            this.propersData.height = data.height;
            this.propersData.defaultWidth = data.defaultWidth;
            this.propersData.defaultHeight = data.defaultHeight;
            this.propersData.text = data.text;
            this.isTexting = false;//代表当前的文本状态 hide show
            this.borderWidth = this.propersData.borderWidth*boardElems.canvas.stage.scaleX;

            //绘制
            this.paintText(boardElems.canvas.stage.scaleX,boardElems.canvas.stage.scaleY);

            //文字比较特殊保存下数据
            this.propersData.text = this.text;
            this.propersData.reEditInfo.push(this.deepCopy(this.propersData,'reEditInfo'));
        }
        /**
         * 绘制图形
         * */
        paintText (scaleX,scaleY,canvasW,canvasH) {
            let l = (this.propersData.left+this.borderWidth*2/scaleX),
                t = (this.propersData.top+this.borderWidth*2/scaleY);
            this.text = this.propersData.text;
            this.color = this.propersData.fontColor;
            this.font = (this.propersData.fontSize)+ 'px ' + this.propersData.fontFamily;
            this.x = l > 0 ? l : 0;
            this.y = t > 0 ? t : 0;
        }
    }
    module.exports = text;
})();