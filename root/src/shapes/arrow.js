/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++arrow++++++++++++++++
 */
(function () {
    let create = require('../../plugs/create');
    let _name = '*********back***********';
    class arrow extends create.Shape {
        constructor (id) {
            super();
            this.name = 'arrow_'+id;
        }

        setPropertyForShape (constConf, hotConf) {
            let name = this.name;
            this.graphics.beginStroke(hotConf.property_other.color);
            this.graphics.setStrokeStyle(hotConf.property_other.size,1,1).beginFill(hotConf.property_other.color);
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
            let self = this,
                p1 = {
                    x:self.startX,
                    y:self.startY
                },
                p2 ={
                    x:stageX,
                    y:stageY
                };

            let points = this.getArrowPoints(p1,p2,20);
            if(points.length > 0){
                this.paintArrow(points);
            }
        }

        mouseUp (event,scaleX,scaleY,canvasW,canvasH) {
        }
        /*
        * 计算箭头的边线绘制点
        * */
        getArrowPoints (point1,point2,sideLen) {
        //需要考虑四个象限
            //首先计算角度和各个边长
            let x1 = point1.x,
                y1 = point1.y,
                x2 = point2.x,
                y2 = point2.y,
                x_x = x2-x1,
                y_y = y2-y1,
                tanYX = 0,
                angle = 0;

            let l1_x = 0,
                l1_y = 0,
                l2_x = 0,
                l2_y = 0,
                l3_x = 0,
                l3_y = 0,
                TP1 = {
                    x : 0,
                    y : 0
                },
                TP2 = {
                    x : 0,
                    y : 0
                },
                TP3 = {
                    x : 0,
                    y : 0
                },
                TP4 = {
                    x : 0,
                    y : 0
                },
                TP5 = {
                    x : 0,
                    y : 0
                },
                TP6 = {
                    x : 0,
                    y : 0
                };
            let p_p = Math.sqrt(x_x*x_x + y_y*y_y);
            p_p = p_p?p_p:0;
            if(p_p < sideLen){
                sideLen = p_p;
            }
            x_x==0?++x_x:x_x;
            y_y==0?++y_y:y_y;
            if(x_x!=0 && y_y!=0){
                tanYX = Math.abs(y_y)/Math.abs(x_x);
                angle = Math.atan(tanYX);
                let sinV = Math.sin(angle),
                    cosV = Math.cos(angle),
                    temSide = Math.sqrt(3)*sideLen/2;
                l1_x = sideLen/2 * sinV;
                l1_y = sideLen/2 * cosV;
                l2_x = temSide * cosV;
                l2_y = temSide * sinV;
                l3_x = sideLen/4 * sinV;
                l3_y = sideLen/4 * cosV;
                let centerPoint_X = 0,
                    centerPoint_Y = 0;
                if(x_x>0 && y_y<0){
                    //第一象限
                    centerPoint_X = x2-l2_x;
                    centerPoint_Y = y2+l2_y;
                    TP1 = point1;

                    TP2.x = centerPoint_X - l3_x;
                    TP2.y = centerPoint_Y - l3_y;

                    TP3.x = centerPoint_X - l1_x;
                    TP3.y = centerPoint_Y - l1_y;

                    TP4 = point2;

                    TP5.x = centerPoint_X + l1_x;
                    TP5.y = centerPoint_Y + l1_y;

                    TP6.x = centerPoint_X + l3_x;
                    TP6.y = centerPoint_Y + l3_y;

                }else if(x_x<0 && y_y<0){
                    //第二象限
                    centerPoint_X = x2+l2_x;
                    centerPoint_Y = y2+l2_y;

                    TP1 = point1;

                    TP2.x = centerPoint_X - l3_x;
                    TP2.y = centerPoint_Y + l3_y;

                    TP3.x = centerPoint_X - l1_x;
                    TP3.y = centerPoint_Y + l1_y;

                    TP4 = point2;

                    TP5.x = centerPoint_X + l1_x;
                    TP5.y = centerPoint_Y - l1_y;

                    TP6.x = centerPoint_X + l3_x;
                    TP6.y = centerPoint_Y - l3_y;

                }else if(x_x<0 && y_y>0){
                    //第三象限
                    centerPoint_X = x2+l2_x;
                    centerPoint_Y = y2-l2_y;

                    TP1 = point1;

                    TP2.x = centerPoint_X + l3_x;
                    TP2.y = centerPoint_Y + l3_y;

                    TP3.x = centerPoint_X + l1_x;
                    TP3.y = centerPoint_Y + l1_y;

                    TP4 = point2;

                    TP5.x = centerPoint_X - l1_x;
                    TP5.y = centerPoint_Y - l1_y;

                    TP6.x = centerPoint_X - l3_x;
                    TP6.y = centerPoint_Y - l3_y;

                }else if(x_x>0 && y_y>0){
                    //第四象限
                    centerPoint_X = x2-l2_x;
                    centerPoint_Y = y2-l2_y;

                    TP1 = point1;

                    TP2.x = centerPoint_X + l3_x;
                    TP2.y = centerPoint_Y - l3_y;

                    TP3.x = centerPoint_X + l1_x;
                    TP3.y = centerPoint_Y - l1_y;

                    TP4 = point2;

                    TP5.x = centerPoint_X - l1_x;
                    TP5.y = centerPoint_Y + l1_y;

                    TP6.x = centerPoint_X - l3_x;
                    TP6.y = centerPoint_Y + l3_y;

                }
                return [TP1,TP2,TP3,TP4,TP5,TP6];
            }
        }

        /**
         * 绘制箭头
         * */
        paintArrow (points) {
            let f = true;
            this.clear();
            for(let p of points){
                if(f){
                    this.graphics.moveTo(p.x,p.y);
                    f = false;
                }
                else
                {
                    this.graphics.lineTo(p.x,p.y);
                }
            }
            this.graphics.lineTo(points[0].x,points[0].y);

            //记录数据
            this.propersData.width = points[3].x - points[0].x;
            this.propersData.height = points[3].y - points[0].y;
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
            this.graphics.setStrokeStyle(data.size,1,1).beginFill(data.color);
            this.propersData.size = data.size;
            this.propersData.color = data.color;
            this.startX = data.command[0].x;
            this.startY = data.command[0].y;
            this.propersData.left = this.startX;
            this.propersData.top = this.startY;

            //绘制
            this.paintArrow(data.command);
        }
    }
    module.exports = arrow;
})();