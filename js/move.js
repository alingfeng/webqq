/*
 * t : time 已过时间
 * b : begin 起始值
 * c : count 总的运动值
 * d : duration 持续时间
 * */
//将所有的属性从传入的参数取出来，保存在json对象当中 等开启定时器的时候直接遍历使用即可

function move(obj, attrs, callBack) {
    var json = {}, //用于存储遍历出来的attrs属性值
        arrTime = [], //用于存储每个运动属性的持续时间
        d = 0; //用于存储运动的最大持续时间
        startTime = 0, //获得运动的起始时间
        value = 0, //用于保存运动过程中属性运动的值
        t = 0; //用于保存已经过去的时间

    for (var attr in attrs) {
        json[attr] = {};//与参数结构做映射 一一对应

        if (attr == 'opacity') { //获得运动的起始位置
            json[attr].b = Math.round(getStyle(obj, attr) * 100);
        } else {
            json[attr].b = parseFloat(getStyle(obj, attr));
        }
        json[attr].c = attrs[attr].target - json[attr].b; //运动的总距离

        json[attr].d = attrs[attr].duration; //运动的持续时间

        arrTime.push(json[attr].d); //存储运动时间
    }

    d = Math.max.apply(null, arrTime); //获得最大的运动持续时间

    startTime = +new Date();  //获得运动的起始时间 时间戳

    clearInterval(obj.timer);  //清除旧的定时器
    obj.timer = setInterval(function () {
        t = +new Date() - startTime; //已过去的时间
        if (t >= d) {
            t = d;
            clearInterval(obj.timer);//虽然此时停止定时器，但是下面的代码还是会走一遍的
        }
        for (var attr in json) {
            json[attr].t = t; //获取已经运动时间

            if (json[attr].t >= json[attr].d) {//如果时间超出了duration时间就让他等于duration
                json[attr].t = json[attr].d;
            }
            if (json[attr].t <= json[attr].d) {//不写else if 原因是防止当json[attr].t > json[attr].d 时候还没有运动到目标点
                value = Tween[attrs[attr].fx](
                    json[attr].t,
                    json[attr].b,
                    json[attr].c,
                    json[attr].d
                )
                if (attr == 'opacity') {
                    obj.style.opacity = value / 100;
                    obj.style.filter = 'alpha(opacity=' + value + ')';
                } else {
                    obj.style[attr] = value + 'px';
                }
            }


        }
        if (t == d) {//放在此处为了计算更精准 当t>=d时运动完之后肯定到了目标点，此时就可以调用回调函数了
            callBack && callBack.call(obj);
        }

    }, 30)

}
function getStyle(obj, attr) {
    //IE 6-8                      标准浏览器    其中false 解决firefox下出错问题（其他参数也可以 有占位即可）
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
}

/*
 * t : time 已过时间
 * b : begin 起始值
 * c : count 总的运动值
 * d : duration 持续时间
 * */

//Tween.linear();

var Tween = {
    linear: function (t, b, c, d) {  //匀速
        return c * t / d + b;
    },
    easeIn: function (t, b, c, d) {  //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) {  //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function (t, b, c, d) {  //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) {  //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function (t, b, c, d) {  //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) {  //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function (t, b, c, d, a, p) {  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function (t, b, c, d, a, p) {    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function (t, b, c, d, s) {     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2 ) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) {    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function (t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}