/**
 * Created by user on 2016/8/6.
 */
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

    this.upFileBtn = tool.$id('#upFileBtn'); //上传图片按钮
    this.upInput = tool.$id('#upInput'); //上传文件控件按钮
    this.file = []; //上传文件
    this.uploadNotes = tool.$id('#uploadNotes'); //上传须知
    this.uploadInfo = tool.$id('#uploadInfo'); //上传时图片信息
    this.uploadArea = tool.$id('#uploadArea'); //上传图片区域
    this.oImg = null; //用于保存即将创建的img标签
    this.userImgBtn = tool.$id('#userImgBtn'); //点击使用上传的图片作为桌面主题背景
}
ChangeSkin.prototype = {
    constructor: ChangeSkin, //还原constructor
    init: function(){ //初始化
        this.slideDownSkin();
        this.slideUpSkin();
        this.selectorSkin();
        this.uploadSkin();
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
        if(localStorage.getItem('upImg')){
            var str = localStorage.getItem('upImg');
            This.previewArea.style.background = 'url('+str+')';
        }else if(tool.getCookie('bg')){//如果之前有过存储就加载
            var str = tool.getCookie('bg').substring(14);
            This.previewArea.style.background = 'url(images/skin/'+ str +')';
        }else{
            This.previewArea.style.background = '';
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
    uploadSkin: function(){
        var This = this;
        var aP = tool.$tag('p',this.uploadInfo); //获得所有的上传信息p标签
        this.upFileBtn.onclick = function(){ //触发表单click事件
            This.upInput.click();
        }
        this.upInput.onchange = function(){ //监控上传状态
            This.file = this.files[0]; //获取上传的文件信息
            console.log(This.file)
            if(This.file && This.file.type.indexOf('image') == -1){ //判断上传的是不是图片类型
                alert('只能支持image类型的上传');
                return; //直接结束代码返回
            }
            if(This.file && (This.file.size/1024).toFixed(2)+'k'>=200+'k'){ //图片单位转换 判断上传图片大小
                alert('图片大小过大，应小于200k');
                return;
            }
            This.uploadNotes.style.display = 'none';
            This.uploadInfo.style.display = 'block';

            aP[0].innerHTML += ': ' + This.file.name; //图片名称
            aP[1].innerHTML += ': ' + (This.file.size / 1024).toFixed(2) + 'k'; //图片大小 tofixed(2)数字保留两位小数

            readFile(This.file); //读取文件 供js使用
        }
        function readFile(obj){
            var fr = new FileReader(); //用HTML5提供的对象，将上传的文件读入缓存当中，供js使用
            fr.onload = function(ev){ //读入缓存成功时触发
                var ev = ev || event;
                if(!This.oImg){ //只创建一个img标签
                    This.oImg = document.createElement('img');
                }
                This.oImg.src = ev.target.result; //读取base64位图片地址
                aP[2].innerHTML += ': ' + This.oImg.width+ '*' +This.oImg.height;
                This.uploadArea.appendChild(This.oImg);

                watch(This.oImg);

            }
            fr.readAsDataURL(obj); //将上传的图片读入内存中，并读取到的图片编码为DataURL

        }
        tool.bindEvent(This.userImgBtn,'click',uploadImg)
        function uploadImg(){
            alert(2);
            var xhr = null; //创建ajax对象

            try{ //兼容至IE7及其以上标准浏览器 html5后重新改写
                xhr = new XMLHttpRequest();
            }catch(e){//兼容至IE6及其以下非标准浏览器
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            xhr.open('post','./php/post_file.php',true); //设置请求信息
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded'); //设置请求头
            xhr.upload.onprogress = function(ev) {//监测上传进度
                console.log('上传成功');
            }
            var fd = new FormData(); //构建提交表单的二进制数据对象
            fd.append('file',This.file); //构建二进制数据
            xhr.send(fd); //发送构建的二进制数据

        }
        function watch(obj){
            This.oImg = tool.$tag('img',This.uploadArea)[0];
            This.oImg.onmouseover = function(ev){
                var ev = ev || event;
                This.previewArea.style.background = 'url('+this.src+')';
            }
            This.oImg.onmouseout = function(ev){
                var ev = ev || event;
                if(localStorage.getItem('upImg')){//如果之前有localStorage就给图片地址付给它
                    var str = localStorage.getItem('upImg');
                    This.previewArea.style.background = 'url('+str+')'
                }else if(tool.getCookie('bg')){ ////如果之前有cookie就给图片地址付给它
                    var str = tool.getCookie('bg').substring(14); //获取图片 去除路径
                    This.previewArea.style.background = 'url(images/skin/'+ str +')'
                }else{
                    This.previewArea.style.background = '';
                }
            }
            This.userImgBtn.onclick = function(){
                This.themeImg.src = This.oImg.src;
                localStorage.setItem('upImg','php/uploads/' + This.file.name);
                tool.removeCookie('bg');
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
                    if(localStorage.getItem('upImg')){
                        var str = localStorage.getItem('upImg'); //获取图片 去除路径
                        This.previewArea.style.background = 'url('+str+')'

                    }else if(tool.getCookie('bg')){
                        var str = tool.getCookie('bg').substring(14); //获取图片 去除路径
                        This.previewArea.style.background = 'url(images/skin/'+ str +')';
                    }else{
                        This.previewArea.style.background = '';
                    }
                }
                aImg[i].onclick = function(){ //点击时候换肤的是大图
                    //images/skin/53.jpg
                    var str = this.src.match(/\/(\w+\.(?:png|jpg|gif|bmp))$/i)[1];
                    This.themeImg.src = 'images/skin/bg' + str;
                    tool.setCookie('bg','images/skin/bg' + str,30);
                    localStorage.removeItem('upImg'); //如果不是使用上传的图片作为桌面主题，那么删除存储
                }
            }
        }
    },
    addSkin: function(){//添加皮肤
        var This = this;
        if(localStorage.getItem('upImg')){
            var str = localStorage.getItem('upImg');
            This.themeImg.src = str ;
        }else if(tool.getCookie('bg')){
            This.themeImg.src = tool.getCookie('bg');
        }
    }

}

