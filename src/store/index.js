import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import cookie from '../util/cookie'

let user;
try {
    user = cookie.getItem('user') ? JSON.parse(cookie.getItem('user')) : {};
}
catch (e) {
}

const store = new Vuex.Store({
    state: {
        //login user
        user,
        loadingPage: false
    },
    mutations: {
        updateUser(state, data) {
            state.user = data;
        },
        updateLoadingPage(state, data) {
            state.loadingPage = data;
        }
    }
});

export default store;
