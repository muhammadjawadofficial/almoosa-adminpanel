import Vue from "vue";
import Vuex from "vuex";
import layout from './modules/layout'
import menu from './modules/menu'
import user from './modules/user'
import appointment from './modules/appointment'
import promotion from './modules/promotion'
import labwork from './modules/labwork'
import radiologyReport from './modules/radiology-report'
import healthEducation from './modules/health-education'
import myTimeline from './modules/my-timeline'
import myMedication from './modules/my-medication'
import servicesPackages from './modules/services-packages'
import familyMember from './modules/family-member'
import insuranceManagement from './modules/insurance-management'
import specialitiesManagement from './modules/specialities-management'
import bannerManagement from './modules/banner-management'
import cmsPages from './modules/cms-pages'
import notificationManagement from './modules/notification-management'
import promotionCode from './modules/promotion-code'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    layout,
    menu,
    user,
    appointment,
    promotion,
    labwork,
    radiologyReport,
    healthEducation,
    myTimeline,
    myMedication,
    servicesPackages,
    familyMember,
    insuranceManagement,
    specialitiesManagement,
    bannerManagement,
    cmsPages,
    notificationManagement,
    promotionCode
  }
});

