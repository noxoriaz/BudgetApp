
import Vue from 'vue';
import axios from 'axios'
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import { initialize } from './bootstrap'
import App from './components/App.vue'
import EntryList from './components/EntryList.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import BootstrapVue from 'bootstrap-vue';
import Vuelidate from 'vuelidate'
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';

initialize(axios)

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.component('multiselect', Multiselect);

const routes = [{
    name: 'Index',
    path: '/',
    component: EntryList,
}];

const router = new VueRouter({ 
    mode: 'history',
    routes,
});

Vue.component('error-message', ErrorMessage);

new Vue(Vue.util.extend({ 
    router 
}, App)).$mount('#app');
