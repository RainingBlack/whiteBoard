/**
 * Created by haoweirui
 * modified on 2017/9/8
 * +++++++++++++++circle++++++++++++++++
 */
(function () {
    let create = require('../../plugs/create');
    let _name = '*********circle***********';
    class rect extends create.Shape {
        constructor (id) {
            super();
            this.name = 'circle_'+id;
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
            this.startX = stageX;
            this.startY = stageY;

            this.paintCircle(this.startX,this.startY,stageX,stageY);
            this.graphics.store();
            this.graphics.unstore();
        }

        mouseMove (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            this.clear();
            this.graphics.beginStroke(this.propersData.color);
            this.graphics.setStrokeStyle(this.propersData.size,1,1);
            this.paintCircle(this.startX,this.startY,stageX,stageY);
        }

        mouseUp (event,scaleX,scaleY,canvasW,canvasH) {
            let stageX = event.stageX/scaleX,
                stageY = event.stageY/scaleY;
            this.clear();
            this.graphics.beginStroke(this.propersData.color);
            this.graphics.setStrokeStyle(this.propersData.size,1,1);
            this.paintCircle(this.startX,this.startY,stageX,stageY);
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
            this.propersData.width = data.command[0].w;
            this.propersData.height = data.command[0].h;

            //绘制
            let x = data.command[0].x,
                y = data.command[0].y,
                w = data.command[0].w,
                h = data.command[0].h;
            this.paintCircle(x,y,x,y,w,h);
        }
        /**
         * 绘制图形
         * */
        paintCircle (sx, sy, cx, cy, w, h) {
            let minX = Math.min(sx,cx),
                minY = Math.min(sy,cy),
                wid = w || Math.abs(sx - cx),
                hei = h || Math.abs(sy - cy);
            this.graphics.drawEllipse(minX,minY,wid,hei);

            //更新位置
            this.propersData.width = wid;
            this.propersData.height = hei;
            this.propersData.top = minY;
            this.propersData.left = minX;
        }
    }
    module.exports = rect;
})();