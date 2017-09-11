/**
 * Created by haoweirui
 * modified on 2017/8/30
 * +++++++++++++++clear++++++++++++++++
 */
(function () {
    let _name = '*********clear***********';
    let clear = {
        action : function () {
            if(this.orderList.length > 0){
                this.orderList.length = 0;
                for(let type in this.allShapesArr){
                    for(let shape of this.allShapesArr[type]){
                        shape.visible = false;
                    }
                }
            }else{
                return false;
            }
            //回调数据
            return {
                _type : 'clear'
            };
        },
        /**
         * 同步外部数据----back操作
         * */
        update : function (data) {
            clear.action.call(this);
        }
    }
    module.exports = clear;
})();