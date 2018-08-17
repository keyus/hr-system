import Vue from 'vue'

//格式化时间戳
Vue.filter('time', (val) => {
    try {
        let date = new Date(val);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    } catch (e) {
        return val;
    }
});

//性别
Vue.filter('sex', (val) => {
    if (val) return '男';
    else return '女';
});

