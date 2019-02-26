import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ccbJs from '@/pjf/ccbJs.common.js'
import ElementUI from 'element-ui';
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import { $axios, $myDecode } from '@/utils/myAxios.js'
import { $http } from '@/utils/http.js' //非 protobuf 的 ajax 请求
import * as myFilter from '@/utils/myFilter'
Vue.use(ccbJs)
Vue.use(ElementUI);
Vue.config.productionTip = false;

//注册全局过滤器
Object.keys(myFilter).forEach(key => {
    Vue.filter(key, myFilter[key])
})
Object.assign(Vue.prototype, {$axios, $myDecode, $http});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
