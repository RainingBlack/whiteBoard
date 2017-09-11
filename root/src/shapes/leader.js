/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++leader++++++++++++++++
 */
(function () {
    let _name = '*********leader***********';
    let pencil = require ('./pencil'),
        highPencil = require('./highPencil'),
        arrow = require('./arrow'),
        rect = require('./rect'),
        circle = require('./circle'),
        outRecord = require('./outRecord'),
        text = require('./text'),
        reEdit = require('./reEdit'),
        draft = require('./draft'),
        rubber = require('./rubber'),
        back = require('./back'),
        clear = require('./clear');
    let typeIDS = {
        pencil : -1,
        highPencil : -1,
        arrow : -1,
        rect : -1,
        circle : -1,
        text : -1,
        outRecord : -1
    };
    let leader = {
        getTool : function (toolType, ownerID) {
            let objTool = null;
            switch (toolType){
                case 'pencil':
                    typeIDS.pencil++;
                    objTool = new pencil(ownerID+"_"+typeIDS.pencil);
                    break;
                case 'highPencil':
                    typeIDS.highPencil++;
                    objTool = new highPencil(ownerID+"_"+typeIDS.highPencil);
                    break;
                case 'arrow':
                    typeIDS.arrow++;
                    objTool = new arrow(ownerID+"_"+typeIDS.arrow);
                    break;
                case 'rect':
                    typeIDS.rect++;
                    objTool = new rect(ownerID+"_"+typeIDS.rect);
                    break;
                case 'circle':
                    typeIDS.circle++;
                    objTool = new circle(ownerID+"_"+typeIDS.circle);
                    break;
                case 'text':
                    typeIDS.text++
                    objTool = new text(ownerID+"_"+typeIDS.text);
                    break;
                case 'outRecord':
                    typeIDS.outRecord++;
                    objTool = new outRecord(ownerID+"_"+typeIDS.outRecord);
                    break;
                case 'rubber':
                    objTool = rubber;
                    objTool.ownerID = ownerID;
                    break;
                case 'reEdit':
                    objTool = reEdit;
                    objTool.ownerID = ownerID;
                    break;
                case 'draft':
                    objTool = draft;
                    objTool.ownerID = ownerID;
                    break;
                case 'back':
                    objTool = back;
                    break;
                case 'clear':
                    objTool = clear;
                    break;
            }
            return objTool;
        }
    }
    module.exports = leader;
})();