/**
 * Created by user on 2016/8/4.
 */
var tool = (function(){
        var toolCollect =  {
            $id: function(selector){/* #id */
                return document.getElementById(selector.substring(1));
            },
            $class: function(selector,context){/* .class */
                context = context || document.body; //如果没有传入context参数，默认从document.body下获取元素
                var className = selector.substring(1); //截取掉.;
                var arrClass = []; //用于保存满足要求的元素
                var classes = []; //存储一个元素的多个className
                var elems = context.getElementsByTagName('*'); //获取指定的context下面的所有的元素
                if(selector !== ''){//判断selector参数是否存在，存在则执行下面的代码
                    for(var i=0;i<elems.length;i++){
                        classes = elems[i].className.split(' ');//针对一个元素多个class
                        for(var j=0;j<classes.length;j++){
                            if(classes[j] === className){
                                arrClass.push(elems[i]);
                            }
                        }
                    }
                }
                return arrClass;
            },
            $tag: function(tag,context){
                context = context || document.body; //如果没有传入context参数，默认从document.body下获取元素
                return context.getElementsByTagName(tag);
            },
            $addClass: function(elem,className){
                var classes = elem.className.split(' ');
                for(var i=0;i<classes.length;i++){
                    if(classes[i] === className){
                        return;
                    }
                }
                console.log(elem.className)
                if(!elem.className){
                    elem.className = className;
                }else{

                    elem.className += ' '+className;
                }

            },
            $removeClass: function(elem,className){// 某个元素 要移除的class
                if(className){
                    var classNameArr = elem.className.split(' ');
                    for(var i=0;i<classNameArr.length;i++){
                        if(classNameArr[i] == className){
                            classNameArr.splice(i,1); //从中删除满足条件的那个className
                            i--; //重置写i的值
                        }
                    }
                    elem.className = classNameArr.join(' ');
                }else{
                    elem.className = '';
                }
            },
            $removeClassAll: function(elems,className){// 某个元素 要移除的class
                var classNameArr;
                for(var i=0;i<elems.length;i++){
                    classNameArr = elems[i].className.split(' ');
                    for(var j=0;j<classNameArr.length;j++){
                        if(classNameArr[j] == className){
                            classNameArr.splice(j,1); //从中删除满足条件的那个className
                            j--; //重置写i的值
                        }
                    }
                    elems[i].className = classNameArr.join(' ');
                }
            },
            stopBubble: function(ev){ //阻止冒泡
                if(ev.stopPropation){ //标准浏览器下
                    ev.stopPropation();
                }else{ //IE下
                    ev.cancelBubble = true;
                }
            },
            getCookie: function(key){
                var cookies = document.cookie.split('; '); //拆分
                var keyValue = []; //用来存储不同的cookie数据
                for(var i=0;i<cookies.length;i++){
                    keyValue = cookies[i].split('=');
                    if(keyValue[0] == key){
                        return keyValue[1];
                    }
                }
            },
            setCookie: function(key,value,d){
                //获取日期对象
                var date = new Date();
                //设置过期时间
                date.setDate(date.getDate() + d);
                //设置cookie
                document.cookie = key+ '=' +value+ ';expires='+ date.toUTCString();
            },
            removeCookie: function(key){
                toolCollect.setCookie(key,'',-1);
            },
            bindEvent: function(obj,eventType,fn){ //绑定事件
                if(obj.addEventListener){//标注下
                    obj.addEventListener(eventType,fn,false)
                }else{
                    obj.attachEvent('on'+eventType,function(){ //IE下
                        fn.call(obj);
                    })
                }
            },
            unbindEvent: function(obj,eventType,fn){ //解决绑定事件
                if(obj.removeEventListener){
                    obj.removeEventListener(eventType,fn,false);
                }else{
                    obj.detachEvent('on'+eventType,function(){
                        fn.call(obj);
                    })
                }
            },
            viewW: function(){ //获取可视区的宽度
                return document.documentElement.clientWidth;
            },
            viewH: function(){//获取可视区的高度
                return document.documentElement.clientHeight;
            }
        }
        return toolCollect;
    }()
)