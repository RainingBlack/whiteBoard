/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++rect++++++++++++++++
 */
(function () {
    let create = require('../../plugs/create');
    let _name = '*********rect***********';
    class rect extends create.Shape {
        constructor (id) {
            super();
            this.name = 'rect_'+id;
        }

        setPropertyForShape (constConf, hotConf) {
            let name = this.name;
            this.graphics.beginStroke(hotConf.property_other.color);
            this.graphics.setStrokeStyle(hotConf.property_other.size,1,1);
            this.startX = 0;
            this.startY = 0;
            this.propersData = {
                name : name,
                baseSize : constConf.baseSize.value,
                recordInfo : constConf.recordInfo.value,
                size : hotConf.property_other.size,
                color : hotConf.property_other.color,
                top : 0,
                left :0,
                width : 0,
                height : 0,
                dragInfo : [],
                rubberInfo : []
            }
        }

        mouseDown (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            this.paintRect(stageX,stageY,0,0);
            this.graphics.store();
            this.graphics.unstore();
            this.startX = stageX;
            this.startY = stageY;
            //记录数据
            this.propersData.top = this.startY;
            this.propersData.left = this.startX;
        }

        mouseMove (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            this.clear();
            this.graphics.beginStroke(this.propersData.color);
            this.graphics.setStrokeStyle(this.propersData.size,1,1);
            this.paintRect(this.startX,this.startY,stageX - this.startX,stageY - this.startY);
        }

        mouseUp (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            this.clear();
            this.graphics.beginStroke(this.propersData.color);
            this.graphics.setStrokeStyle(this.propersData.size,1,1);
            this.paintRect(this.startX,this.startY,stageX - this.startX,stageY - this.startY);
            //记录数据
            this.propersData.width = stageX - this.startX;
            this.propersData.height = stageY - this.startY;
        }

        clear (){
            this.graphics._instructions.length = this.graphics._activeInstructions.length = this.graphics._commitIndex = 0;
        }

        /**
         * 将外部数据转化为图形
         * */
        turnShape (constConf, hotConf, data) {
            this.setPropertyForShape(constConf,hotConf);

            //修正数据
            this.graphics.beginStroke(data.color);
            this.graphics.setStrokeStyle(data.size,1,1);
            this.propersData.color = data.color;
            this.propersData.size = data.size;
            this.startX = data.command[0].x;
            this.startY = data.command[0].y;
            this.propersData.left = this.startX;
            this.propersData.top = this.startY;
            this.propersData.width = -1;
            this.propersData.height = -1;

            //绘制
            let x = data.command[0].x,
                y = data.command[0].y,
                w = data.command[0].w,
                h = data.command[0].h;
            this.paintRect(x,y,w,h);
        }
        /**
         * 绘制图形
         * */
        paintRect (x, y, w, h) {
            this.graphics.drawRect(x,y,w,h);
        }
    }
    module.exports = rect;
})();