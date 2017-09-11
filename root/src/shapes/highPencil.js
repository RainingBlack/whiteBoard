/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++highPencil++++++++++++++++
 */
(function () {
    let create = require('../../plugs/create');
    let _name = '*********highPencil***********';
    class highPencil extends create.Shape {
        constructor (id) {
            super();
            this.name = 'highPencil_'+id;
        }

        setPropertyForShape (constConf, hotConf) {
            let name = this.name;
            this.alpha = hotConf.property_highPencil.alpha;
            this.graphics.beginStroke(hotConf.property_highPencil.color);
            this.graphics.setStrokeStyle(hotConf.property_highPencil.size,0,1);
            this.startX = 0;
            this.startY = 0;
            this.propersData = {
                name : name,
                baseSize : constConf.baseSize.value,
                recordInfo : constConf.recordInfo.value,
                size : hotConf.property_highPencil.size,
                color : hotConf.property_highPencil.color,
                alpha : hotConf.property_highPencil.alpha,
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
            this.graphics.moveTo(stageX,stageY);
            this.graphics.lineTo(stageX,stageY);
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
            this.graphics.lineTo(stageX,stageY);
            //记录数据
            this.propersData.width = -1;
            this.propersData.height = -1;
        }

        mouseUp (event,scaleX,scaleY,canvasW,canvasH) {
        }
        /**
         * 将外部数据转化为图形
         * */
        turnShape (constConf, hotConf, data) {
            this.setPropertyForShape(constConf,hotConf);

            //修正数据
            this.alpha = data.alpha;
            this.graphics.beginStroke(data.color);
            this.graphics.setStrokeStyle(data.size,0,1);
            this.propersData.alpha = data.alpha;
            this.propersData.color = data.color;
            this.propersData.size = data.size;
            this.startX = data.command[0].x;
            this.startY = data.command[0].y;
            this.propersData.left = this.startX;
            this.propersData.top = this.startY;
            this.propersData.width = -1;
            this.propersData.height = -1;

            //绘制
            this.paintHighPencil(data.command);
        }
        /**
         * 绘制图形
         * */
        paintHighPencil (points) {
            let f = true;
            for(let p of points){
                if(f){
                    this.graphics.moveTo(p.x,p.y);
                    f = false;
                }else{
                    this.graphics.lineTo(p.x,p.y);
                }
            }
        }

    }
    module.exports = highPencil;
})();