/**
 * Created by haoweirui
 * modified on 2017/8/22
 */
#功能介绍：
    #主要提供一个互动白板

#使用方法：
    安装：
        npm install mebutoo-wbsdk@0.3.0 --save
    使用：
        引用：import WBSDK from "mebutoo-wbsdk";
        获取一个白板对象  let wbSDK = new WBSDK();
        第一步：
            获取相关的配置信息，分为两种：
                constConf：（初次配置后不可进行相关的更改）
                hotUpdateConf：（初次配置后之后更改实时有效，可直接更改对象属性）
            相关函数：
                let constConf = wbSDK.getconf(type);
                参数介绍：
                    type == undefined || type == 0   获取全部的配置信息{constConf:{},hotUpdateConf:{}} 具体的数据结构见./lib/config.json
                    type == 'const' || type == 1     获取不可热更新的配置信息          具体的数据结构见./lib/config.json
                    type == 'change' || type == 2    获取可热更新的配置信息            具体的数据结构见./lib/config.json
                    其他                              打印错误信息，返回空对象
        第二步：
            创建白板，初始化对象上该白板所有的属性，包括上面两种配置信息，如果尝试修改const配置信息，将会报错，不会修改成功，修改hotConf将会在下一次有效
            相关函数
                let myWB = new wbSDK.createBoard(targetID,confInfo,dataCB);
                参数介绍：
                    targetID == '外部标签的idName，对外层flex样式支持不好'
                    confInfo == {}  支持四种形式
                                        1、undefined，将会直接使用默认配置
                                        2、空对象{}，将会使用默认的对象配置
                                        3、单独传constConf{}或者hotUpdateConf{}，按照传入的类别进行相关的配置，未传入的按照默认的配置信息进行配置
                                        4、{constConf:{},hotUpdateConf:{}}  全量进行配置
                    dataCB == function(obj){}  在进行同步时接受本端产生的先关笔迹数据信息，如果是本地模式可以不传
                            如何区分使用哪一条协议？
                                obj.agreeType == 'add'      obj.agreeType == 'del'      obj.agreeType == 'clear'
        第三步：
            工具调用
            相关函数
                myWB.draw(type);
                参数介绍
                    type == 'toolType'
                        合法值是： ["pencil","arrow","rect","circle","draft","highPencil","text","rubber","back","clear"]（随时更新，以./lib/config.json openedTools为准，但是reEdit不需要显示调用）
                        注意： 其他不合法的值将会报错
        第四步：
            缩放调用
            相关函数
                myWB.resize(width, height, left, top);
                参数介绍
                    width == 100 || width == '100px'
                    height == 100 || height == '100px'
                    left == 20 || left == '20px'
                    top == 20 || top == '20px'
        第五步：
            临时设置白板状态(开始绘制和暂停绘制)
            相关函数
                myWB.setDrawState(type);
                参数介绍
                    type == undefined || type == false   暂停绘制，如果当前用于正在绘制的过程中收到这条调用则强制完成绘制，这条绘制记录不作废，依旧有效
                    type == true                         开始绘制，下次操作有效
        第六步：
            外部数据展示
                myWB.turnShape(data,svcID);
                参数介绍
                    data == {}      服务器下发的data即对端收到的callback数据信息
                    svcID == '2'    服务器的id信息


        其他注意事项：
            在配置信息时
                注意：
                    1、constConf.isOnline    控制是否是同步模式
                    2、constConf.module      控制白板的功能，并且之后不可改变！分为显示模式和绘制模式，显示模式只可以显示，绘制模式可以绘制+显示
                    3、constConf.baseSize    当前所有的size基准，比如笔迹粗细，文字大小等，注意包含宽度和高度！！需要同步的各端必须一致且宽高比例在缩放过程中不可改变！
                    4、constConf.recordInfo  鼠标移入需要展示的文字信息，数组内的一个元素是一行文字，如果数组为空则不展示！







