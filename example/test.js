(function () {
    let createjs = require('../root/plugs/create');
    // createJSStage();
    function  createJSStage() {
        var stage = new createjs.Stage("canvasElementId");
//        stage.enableMouseOver(10000);
        createjs.Touch.enable(stage);
        console.log(createjs.Touch.isSupported());
        var image1 = new createjs.Bitmap("1.png"),
            image2 = new createjs.Bitmap("2.png"),
            image3 = new createjs.Bitmap("3.png");
        image1.name='image1';
        image2.name='image2';
        image3.name='image3';
        image1.x = 0;
        image1.y = 0;
        image2.x = 300;
        image2.y = 0;
        image3.x = 600;
        image3.y = 0;
//        var myGraphics = new createjs.Graphics().beginFill("#ff0000").drawCircle(0, 0, 25);
//        var shape = stage.addChild(new createjs.Shape()).set({graphics:myGraphics, x:100, y:100, alpha:0.5});
        var shape = new createjs.Shape(),
            graphics = shape.graphics;
        shape.alpha = 0.5;
        graphics.beginStroke("red");
        graphics.setStrokeStyle(50,1,1);
       shape.graphics.moveTo(50,50);
       shape.graphics.lineTo(100,100);
       shape.name = 'l1';
//        shape.graphics.beginFill("#fff84a").drawRect(0,0,35,35);
//        cacheShape.drawCircle()
//        console.log(shape.cache(-25, -25, 50, 50));
       stage.addChild(shape);
       stage.addChildAt(image1.setTransform(100,100,0.5,0.5),0);
       stage.addChildAt(image2.setTransform(150,150,0.2,0.2),1);
       stage.addChildAt(image3.setTransform(50,50,0.2,0.2),2);
        stage.update();
        stage.enableMouseOver(20);
        setTimeout(function () {
            var img = document.createElement('img');
            img.onload = function () {
                image2.image = img;
                stage.update();
            }
            img.src="3.png";
        },2000)

//        click  dblclick  drawend  drawstart  mousedown  mouseenter   mouseleave  mouseout  mouseover  pressmove  pressup  removed  rollout  rollover
//        stagemousedown  stagemousemove  stagemouseup
        var down = false;
        stage.addEventListener('mousedown',function (event) {

            down = true;
            // shape = new createjs.Shape();
            // graphics = shape.graphics;
            // shape.alpha = 0.5;
            // graphics.beginStroke("red");
            // graphics.setStrokeStyle(50,1);
            // shape.cache(0,0,900,900);
            // graphics.moveTo(event.stageX,event.stageY);
            // graphics.lineTo(event.stageX,event.stageY);
            // stage.addChild(shape);
            // graphics.store();
            // graphics.unstore();
        });
//         stage.addEventListener('stagemousemove',function (event) {
//             // if(down){
//             //     shape.updateCache('source-over');
//             //     graphics.lineTo(event.stageX,event.stageY);
//             //     stage.update();
//             //     shape.cache(0,0,900,900);
//             // }
//         });
//         stage.addEventListener('stagemouseup',function (event) {
//             // down = false;
// //            graphics2.unstore();
// ////            graphics2.moveTo(event.stageX+100,event.stageY+100);
// //            graphics2.lineTo(event.stageX+200,event.stageY+200);
// //            stage.update();
//         });
//         stage.addEventListener('mouseout',function (event) {
//             down = false;
//         });

    }



    let testWB = require('../root/index');
    window.wbChild = null;

    function backData(data) {
        console.log('---------------------->back data:');
        let strData = JSON.stringify(data);
        console.log(JSON.parse(strData));
    }

    window.addEventListener('resize',function () {
        let curW = $('#showTest').width() - 100,
            curH = $('#showTest').height() - 100;

        window.wbChild && window.wbChild.resize(curW,curW);
    })

    window.clickEvent = function (event) {
        let curTool = event.target.id;
        if(curTool && curTool !== 'tools'){
            if(curTool == 'create'){
                window.wbChild = new testWB();
                let conf = wbChild.getconf();
                conf.constConf.firstTool.value = 'pencil';
                conf.constConf.isOnline.value = false;
                conf.constConf.ownerID.value = '123';
                conf.constConf.recordInfo.value.push('test');
                conf.hotUpdateConf.property_board.top = '50px';
                conf.hotUpdateConf.property_board.left = '50px';
                conf.hotUpdateConf.property_board.width = $('#showTest').width() - 100 + 'px';
                conf.hotUpdateConf.property_board.height = $('#showTest').height() - 100 + 'px';
                wbChild.createBoard('showTest',conf,backData);
            }else{
                if(wbChild){
                    window.wbChild.draw(curTool);
                }
            }
        }

    }
})();