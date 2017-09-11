/**
 * Created by haoweirui
 * modified on 2017/8/22
 * +++++++++++++++outRecord++++++++++++++++
 */
(function () {
    let create = require('../../plugs/create');
    let _name = '*********outRecord***********';
    class outRecord extends create.Bitmap{
        constructor (id) {
            super();
            this.name = 'outRecord_'+id;
        }
        setPropertyForShape (constConf, hotConf) {
            let name = this.name;
            this.startX = 0;
            this.startY = 0;
            this.propersData = {
                name : name,
                baseSize : constConf.baseSize.value,
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
        /**
         * 将外部数据转化为图形
         * */
        turnShape () {

        }
    }
    module.exports = outRecord;
})();