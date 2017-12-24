
import Vue from 'vue';
import axios from 'axios'
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import { initialize } from './bootstrap'
import App from './components/App.vue'
import EntryList from './components/EntryList.vue'
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';

initialize(axios)

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);

const routes = [{
    name: 'Index',
    path: '/',
    component: EntryList,
}];

const router = new VueRouter({ 
    mode: 'history',
    routes,
});

Vue.component('example-component', require('./components/ExampleComponent.vue'));

new Vue(Vue.util.extend({ 
    router 
}, App)).$mount('#app');
