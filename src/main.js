import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import ElementUi from 'element-ui'
import Images from './components/images'
import * as Api from './api/index'

import './filters/index'


import 'element-ui/lib/theme-chalk/index.css'
import './scss/default.scss'

Vue.config.productionTip = true;
Vue.component(Images.name, Images);
Vue.use(ElementUi);
Vue.prototype.$api = Api;
Vue.prototype.$tree = function (data) {
    const map = {};
    data.forEach(it=>{
        if(!map[it.departmentId]){
            map[it.departmentId] = {
                departmentId : 1,
                departmentName : it.departmentName,
                children : [],
                active : true,
            }
        }
    });
    data.forEach(it=>{
        map[it.departmentId].children.push(Object.assign({},it));
    });
    return map;
};

new Vue({
    router,
    store,
    components: {App},
    template: '<App/>'
}).$mount('#app');
