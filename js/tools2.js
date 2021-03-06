/**
 * Created by user on 2016/8/4.
 */
var tool = (function(){
        var toolCollect =  {
            $id: function(selector){/* #id */
                return document.getElementById(selector.substring(1));
            },
            $class: function(selector,context){/* .class */
                var className = selector.substring(1); //截取掉.;
                var elems = []; //获取指定的context下面的所有的元素
                var arrClass = []; //用于保存满足要求的元素
                var classes = []; //存储一个元素的多个className
                if(context){
                    if(context.indexOf('#')!== -1){//优选
                        context =  toolCollect.$id(context);
                    }else if(context.indexOf('.')!== -1){//性能消耗大些
                        context = toolCollect.$class(context)[0];
                    }
                }else{
                    context = context || document.body; //如果没有传入context参数，默认从document.body下获取元素
                }
                className = selector.substring(1); //截取掉.
                elems = context.getElementsByTagName('*'); //获取指定的context下面的所有的元素
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
                if(typeof context == 'string'){
                    if(context.indexOf('#')!== -1){//优选
                        context =  toolCollect.$id(context);
                    }else if(context.indexOf('.')!== -1){//性能消耗大些
                        context = toolCollect.$class(context)[0];
                    }
                }else{
                    context = context || document.body; //如果没有传入context参数，默认从document.body下获取元素
                }
                context = context || document.body;
                return context.getElementsByTagName(tag);
            },
            $removeClass: function(elems,className){// 某个元素 要移除的class
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
            }
            ,
            stopBubble: function(ev){
                if(ev.stopPropation){ //标准浏览器下
                    ev.stopPropation();
                }else{ //IE下
                    ev.cancelBubble = true;
                }
            }
        }
        return toolCollect;
    }()
)