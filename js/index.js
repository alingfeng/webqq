/**
 * Created by user on 2016/8/4.
 */
//换肤
window.onload = function(){
    var a = new ChangeSkin();
    a.init();

}

//换肤
function ChangeSkin(tag,selector){
    this.topBtnList = tool.$id('#topBtnList'); //获得顶部按钮列表
    this.skinBtn = tool.$tag('a',this.topBtnList)[0]; //获取顶部换肤按钮
    this.skinBox = tool.$id('#skinBox'); //获取皮肤盒子
    this.sqBtn = tool.$id('#sqBtn'); //获取收起按钮
    this.skinSelect = tool.$id('#skinSelect'); //获得皮肤类型按钮列表
    this.skinSelectorBtn = tool.$tag('li',this.skinSelect); //获取所有皮肤类型按钮
    this.selBox = tool.$id('#selectBox'); //图片盒子列表
    this.aUl = tool.$tag('ul',this.selBox); //每组图片列表
    this.previewArea = tool.$id('#previewArea'); //换肤预览区域
    //this.previewImg = tool.$tag('img',this.previewArea)[0]; //换肤预览图
    this.themeImg = tool.$id('#themeImg'); //桌面大背景
}
ChangeSkin.prototype = {
    constructor: ChangeSkin, //还原constructor
    init: function(){ //初始化
        this.slideDownSkin();
        this.slideUpSkin();
        this.selectorSkin();
        this.preview();
        this.addSkin();
    },
    slideDownSkin: function(){// 展开皮肤盒子
        var This = this;
        this.skinBtn.onclick = function(ev){
            var ev = ev || event;
            tool.stopBubble(ev);
            move(This.skinBox,{
                'height': {
                    target: 246,
                    duration: 500,
                    fx: 'linear'
                },
                'opacity': {
                    target: 100,
                    duration: 500,
                    fx: 'linear'
                }
            })
        }
        if(tool.getCookie('bg')){//如果之前有过存储就加载
            var str = tool.getCookie('bg').substring(14);
            This.previewArea.style.background = 'url(images/skin/'+ str +')';
        }
        this.skinBox.onclick = function(ev){//阻止冒泡，防止打开的时候操作换肤界面，导致document点击事件触发
            var ev = ev || event;
            tool.stopBubble(ev);
        }
    },
    slideUpSkin: function(){ //收起皮肤盒子
        var This = this;
        this.sqBtn.onclick = function(){
            move(This.skinBox,{
                'height': {
                    target: 0,
                    duration: 500,
                    fx: 'linear'
                },
                'opacity': {
                    target: 0,
                    duration: 500,
                    fx: 'linear'
                }
            })
        }
        document.onclick = function(){ //点击document收缩皮肤盒子
            This.sqBtn.onclick();
        }
    },
    selectorSkin: function(){//选择对应的皮肤选项
        var n = 0;//记录当前的索引值
        var This = this;
        for(var i=0;i<this.skinSelectorBtn.length;i++){
            this.skinSelectorBtn[i].index = i;
            this.skinSelectorBtn[i].onclick = function(){ //鼠标点击选项按钮
                tool.$removeClass(This.skinSelectorBtn[n],'');
                tool.$removeClass(This.aUl[n],'');
                tool.$addClass(This.aUl[this.index],'show');
                tool.$addClass(This.skinSelectorBtn[this.index],'top_current');
                n = this.index;
            }
            this.skinSelectorBtn[i].onmouseover = function(){ //鼠标移入选项按钮
                tool.$addClass(This.skinSelectorBtn[this.index],'top_current');
            }
            this.skinSelectorBtn[i].onmouseout = function(){ //鼠标离开选项按钮
                tool.$removeClass(This.skinSelectorBtn[this.index],'');
                tool.$addClass(This.skinSelectorBtn[n],'top_current'); //给当前的元素添加样式
            }
        }
    },
    preview: function(){//预览皮肤
        var This = this;
        for(var i=0;i<this.aUl.length;i++){
            watchBg(this.aUl[i]);
        }
        function watchBg(obj){
            var aImg = tool.$tag('img',obj);
            for(var i=0;i<aImg.length;i++){
                aImg[i].onmouseover = function(){
                    This.previewArea.style.background = 'url('+this.src+')';
                }
                aImg[i].onmouseout = function(){
                    if(tool.getCookie('bg')){
                       var str = tool.getCookie('bg').substring(14);
                        This.previewArea.style.background = 'url(images/skin/'+ str +')';
                    }else{
                        This.previewArea.style.background = '';
                    }
                }
                aImg[i].onclick = function(){
                    //images/skin/53.jpg
                    var str = this.src.match(/\/(\w+\.(?:png|jpg|gif|bmp))$/i)[1];
                    console.log(str)
                    This.themeImg.src = 'images/skin/bg' + str;
                    tool.setCookie('bg','images/skin/bg' + str,30);
                }
            }
        }
    },
    uploadSkin: function(){

    },
    addSkin: function(){//添加皮肤
        var This = this;
        if(tool.getCookie('bg')){
            This.themeImg.src = tool.getCookie('bg');
        }
    }

}

