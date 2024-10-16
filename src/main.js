import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import { store } from './store';
import VueFeather from 'vue-feather';
import VueI18n from 'vue-i18n';
import VueSweetalert2 from 'vue-sweetalert2';
import Toasted from 'vue-toasted';
import VueExcelXlsx from "vue-excel-xlsx";
import moment from 'moment'
import "./components/svgIcons"
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ar';
import 'vue2-datepicker/locale/en';
import "@lottiefiles/lottie-player";
import socket from './plugins/socket';
socket.install(Vue)

import VueAnalytics from 'vue-analytics';

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
  router,
  autoTracking: {
    screenview: true
  }
});

Vue.prototype.moment = moment

const VueApexCharts = () => import('vue-apexcharts');
const OtpInput = () => import("@bachdgvn/vue-otp-input");
const PxCard = () => import('./components/Pxcard.vue');
const DatePicker = () => import('vue2-datepicker');
const vue2Dropzone = () => import('vue2-dropzone');
const PerPage = () => import("./components/per_page");
const ASHDatePicker = () => import("./components/ash_datepicker");
const Multiselect = () => import("vue-multiselect");
const Breadcrumbs = () => import('./components/bread_crumbs');
const BackNavigation = () => import('./components/back-navigation');

Vue.component("v-otp-input", OtpInput);
Vue.component('px-card', PxCard)
Vue.component("vueDropzone", vue2Dropzone)
Vue.component('perpage', PerPage)
Vue.component('ash-datepicker', ASHDatePicker)
Vue.component('multiselect', Multiselect)
Vue.component('date-picker', DatePicker)
Vue.component('apexchart', VueApexCharts);
Vue.component('Breadcrumbs', Breadcrumbs)
Vue.component('back-navigation', BackNavigation)


// Multi Language Add
import en from './locales/en.json';
import ar from './locales/ar.json';
import { defaultLocale, localeOptions } from './constants/config';

// Import Theme scss
import './assets/scss/app.scss'

import interceptor from './interceptor'
interceptor(store);

Vue.use(VueFeather);
Vue.use(BootstrapVue);
Vue.use(VueExcelXlsx);
Vue.use(VueI18n);
Vue.use(VueSweetalert2);
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});

import GlobalMixin from './mixins/_global-mixin'

Vue.mixin(GlobalMixin)

const messages = { en: en, ar: ar };
const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true
});

// config for firebase
import firebaseMessaging from './firebase'
Vue.prototype.$messaging = firebaseMessaging

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')