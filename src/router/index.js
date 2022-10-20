import Vue from 'vue'
import Router from "vue-router";

import Body from '../components/body'
import AuthBody from '../components/auth_body'
import AuthBodyAdmin from '../components/auth_body_patient'
import Login from '../pages/authentication/login';

import Dashboard from '../pages/dashboard'

import RouterViewModule from '../pages/reusable/module'

import AppointmentModule from '../pages/appointment'
import ViewAppointment from '../pages/appointment/view-appointments'
import AppointmentHistory from '../pages/appointment/appointment-history'
import AppointmentHistoryDetails from '../pages/appointment/appointment-history-details'
import AppointmentInstructions from '../pages/appointment/appointment-instructions'

import myTimelineModule from '../pages/my-timeline'
import myTimelineDetails from '../pages/my-timeline/timeline-details'
import myTimelineList from '../pages/my-timeline/timeline-list'

import labWorksModule from '../pages/lab-works'
import labWorksReports from '../pages/lab-works/report-list'
import labWorksSessions from '../pages/lab-works/doctor-list'

import radiologyReportModule from '../pages/radiology-reports'
import radiologyReportReports from '../pages/radiology-reports/report-list'
import radiologyReportSessions from '../pages/radiology-reports/doctor-list'

import insuranceModule from '../pages/insurance'
import insuranceMyMedical from '../pages/insurance/my-medical-insurance'
import addNewInsurance from '../pages/insurance/add-new-insurance'

import myMedicationModule from '../pages/medication'
import myMedicationSessions from '../pages/medication/medication-session-list'
import myMedicationList from '../pages/medication/medication-list'
import myMedicationDetails from '../pages/medication/medication-detail'
import allMedications from '../pages/medication/all-medications'
import editMedicationDetails from '../pages/medication/edit-medication-detail'

import healthEducationModule from '../pages/health-education'
import healthEducationList from '../pages/health-education/health-education-list'
import healthEducationDetails from '../pages/health-education/health-education-details'
import healthEducationEdit from '../pages/health-education/health-education-edit'

import servicesPackagesModule from '../pages/services-packages'
import servicesPackagesList from '../pages/services-packages/services-packages-list'
import servicesPackagesDetails from '../pages/services-packages/services-packages-details'
import servicesPackagesForm from '../pages/services-packages/services-packages-form'

import UsersModule from '../pages/users'
import PatientList from '../pages/users/patient-list'
import PhysicianList from '../pages/users/physician-list'
import StaffList from '../pages/users/staff-list'
import UserDetails from '../pages/users/user-details'
import UserProfile from '../pages/users/user-profile'

import promotionsModule from '../pages/promotions'
import promotionsList from '../pages/promotions/promotions-list'
import promotionsGroups from '../pages/promotions/promo-groups-list'
import promotionsGroupsCreate from '../pages/promotions/promo-groups-form'
import promotionsDetails from '../pages/promotions/promotions-details'
import promotionsForm from '../pages/promotions/promotions-form'

import { userService } from '../services';

// component

Vue.use(Router)

const routes = [
  { path: '', redirect: { name: 'default' } },
  {
    path: '/',
    component: Body,
    children: [
      {
        path: 'dashboard',
        name: 'default',
        component: Dashboard,
        meta: {
          title: 'Dashboard | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'all-medication',
        name: 'All Medication',
        component: allMedications,
        meta: {
          title: 'Medications | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'all-medication/details',
        name: 'All Medication Details',
        component: editMedicationDetails,
        meta: {
          title: 'Medication Details | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'health-education',
        component: healthEducationModule,
        children: [
          {
            path: 'edit',
            name: 'Health Education Edit',
            component: healthEducationEdit,
            meta: {
              title: 'Health Education Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list',
            name: 'Health Education List',
            component: healthEducationList,
            meta: {
              title: 'Health Education List | Almoosa Specialist Hospital',
            },
          }
        ]
      },
      {
        path: 'services-packages',
        component: servicesPackagesModule,
        children: [
          {
            path: "create",
            name: 'Services Packages Create',
            component: servicesPackagesForm,
            meta: {
              title: 'Services Packages Create | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/edit",
            name: 'Services Packages Edit',
            component: servicesPackagesForm,
            meta: {
              title: 'Services Packages Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list",
            name: 'Services Packages List',
            component: servicesPackagesList,
            meta: {
              title: 'Services Packages List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/details",
            name: 'Services Packages Details',
            component: servicesPackagesDetails,
            meta: {
              title: 'Services Packages Details | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'appointment',
        component: AppointmentModule,
        children: [
          {
            path: 'view',
            name: 'View Appointment',
            component: ViewAppointment,
            meta: {
              title: 'View Appointment | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'history',
            name: 'Appointment History',
            component: AppointmentHistory,
            meta: {
              title: 'Appointment History | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'history/details',
            name: 'Appointment History Details',
            component: AppointmentHistoryDetails,
            meta: {
              title: 'Appointment History Details | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'instructions',
            name: 'Appointment Instructions',
            component: AppointmentInstructions,
            meta: {
              title: 'Appointment Instructions | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'history/my-timeline',
            component: myTimelineModule,
            children: [
              { path: '', name: "My Timeline", redirect: { name: 'My Timeline Details' } },
              {
                path: "details",
                name: 'My Timeline Details',
                component: myTimelineDetails,
                meta: {
                  title: 'My Timeline Details | Almoosa Specialist Hospital',
                },
              },
            ]
          },
          {
            path: 'history/lab-works',
            component: labWorksModule,
            children: [
              { path: '', name: "Lab Works", redirect: { name: 'Lab Work Reports' } },
              {
                path: "reports",
                name: 'Lab Work Reports',
                component: labWorksReports,
                meta: {
                  title: 'Lab Work - Reports | Almoosa Specialist Hospital',
                },
              },
            ]
          },
          {
            path: 'history/radiology-report',
            component: radiologyReportModule,
            children: [
              { path: '', name: "Radiology Report", redirect: { name: 'Radiology Reports' } },
              {
                path: "reports",
                name: 'Radiology Reports',
                component: radiologyReportReports,
                meta: {
                  title: 'Radiology Report - Reports | Almoosa Specialist Hospital',
                },
              },
            ]
          },
          {
            path: 'history/insurance',
            component: insuranceModule,
            children: [
              { path: '', name: "Medical Insurance", redirect: { name: 'Medical Insurance List' } },
              {
                path: "list",
                name: 'Medical Insurance List',
                component: insuranceMyMedical,
                meta: {
                  title: 'Medical Insurance | Almoosa Specialist Hospital',
                },
              },
              {
                path: "add",
                name: 'Add New Insurance',
                component: addNewInsurance,
                meta: {
                  title: 'Add New Insurance | Almoosa Specialist Hospital',
                },
              },
            ]
          },
          {
            path: 'history/my-medication',
            component: myMedicationModule,
            children: [
              { path: '', name: "My Medication", redirect: { name: 'My Medication List' } },
              {
                path: "list",
                name: 'My Medication List',
                component: myMedicationList,
                meta: {
                  title: 'My Medications | Almoosa Specialist Hospital',
                },
              },
              {
                path: "details",
                name: 'My Medication Details',
                component: myMedicationDetails,
                meta: {
                  title: 'My Medication Details | Almoosa Specialist Hospital',
                },
              },
            ]
          },
        ]
      },
      {
        path: 'users',
        component: UsersModule,
        children: [
          {
            path: 'patient',
            component: RouterViewModule,
            children: [
              {
                path: "",
                name: 'Patient List',
                component: PatientList,
                meta: {
                  title: 'Patient List | Almoosa Specialist Hospital',
                },
              },
              {
                path: "insurance",
                name: 'Patient Medical Insurance',
                component: insuranceMyMedical,
                meta: {
                  title: 'Medical Insurance | Almoosa Specialist Hospital',
                },
              },
              {
                path: 'lab',
                component: RouterViewModule,
                children: [
                  {
                    path: "sessions",
                    name: 'Patient Lab Sessions',
                    component: labWorksSessions,
                    meta: {
                      title: 'Lab Sessions | Almoosa Specialist Hospital',
                    },
                  },
                  {
                    path: "reports",
                    name: 'Patient Lab Reports',
                    component: labWorksReports,
                    meta: {
                      title: 'Lab Reports | Almoosa Specialist Hospital',
                    },
                  },
                ]
              },
              {
                path: 'radiology',
                component: RouterViewModule,
                children: [
                  {
                    path: "sessions",
                    name: 'Patient Radiology Sessions',
                    component: radiologyReportSessions,
                    meta: {
                      title: 'Radiology Sessions | Almoosa Specialist Hospital',
                    },
                  },
                  {
                    path: "reports",
                    name: 'Patient Radiology Reports',
                    component: radiologyReportReports,
                    meta: {
                      title: 'Radiology Reports | Almoosa Specialist Hospital',
                    },
                  },
                ]
              },
              {
                path: "timeline",
                name: 'Patient Timeline List',
                component: myTimelineList,
                meta: {
                  title: 'Timeline List | Almoosa Specialist Hospital',
                },
              },
              {
                path: "timeline/details",
                name: 'Patient Timeline Details',
                component: myTimelineDetails,
                meta: {
                  title: 'Timeline Details | Almoosa Specialist Hospital',
                },
              },
              {
                path: 'medication',
                component: myMedicationModule,
                children: [
                  {
                    path: "sessions",
                    name: 'Patient Medication Session',
                    component: myMedicationSessions,
                    meta: {
                      title: 'My Medications | Almoosa Specialist Hospital',
                    },
                  },
                  {
                    path: "list",
                    name: 'Patient Medication List',
                    component: myMedicationList,
                    meta: {
                      title: 'My Medications | Almoosa Specialist Hospital',
                    },
                  },
                  {
                    path: "details",
                    name: 'Patient Medication Details',
                    component: myMedicationDetails,
                    meta: {
                      title: 'My Medication Details | Almoosa Specialist Hospital',
                    },
                  },
                ]
              },
              {
                path: "details",
                name: 'Patient Details',
                component: UserDetails,
                meta: {
                  title: 'Patient Details | Almoosa Specialist Hospital',
                },
              },
              {
                path: "profile",
                name: 'Patient Profile',
                component: UserProfile,
                meta: {
                  title: 'Patient Profile | Almoosa Specialist Hospital',
                },
              },
            ]
          },
          {
            path: "physician",
            name: 'Physician List',
            component: PhysicianList,
            meta: {
              title: 'Physician List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "staff",
            name: 'Staff List',
            component: StaffList,
            meta: {
              title: 'Staff List | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'promotions',
        component: promotionsModule,
        children: [
          {
            path: "list",
            name: 'Promotions List',
            component: promotionsList,
            meta: {
              title: 'Promotions List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "groups/list",
            name: 'Promotions Groups',
            component: promotionsGroups,
            meta: {
              title: 'Promotions Groups | Almoosa Specialist Hospital',
            },
          },
          {
            path: "groups/create",
            name: 'Create Promotion Group',
            component: promotionsGroupsCreate,
            meta: {
              title: 'Create Promotion Group | Almoosa Specialist Hospital',
            },
          },
          {
            path: "groups/list/edit",
            name: 'Edit Promotion Group',
            component: promotionsGroupsCreate,
            meta: {
              title: 'Update Promotion Group | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/details",
            name: 'Promotions Details',
            component: promotionsDetails,
            meta: {
              title: 'Promotions Details | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/edit",
            name: 'Promotions Edit',
            component: promotionsForm,
            meta: {
              title: 'Promotions | Almoosa Specialist Hospital',
            },
          },
          {
            path: "create",
            name: 'Promotions Create',
            component: promotionsForm,
            meta: {
              title: 'Promotions Create | Almoosa Specialist Hospital',
            },
          },
        ]
      },
    ]
  },
  {
    path: '/auth',
    component: AuthBody,
    children: [
      {
        path: 'user',
        name: 'Admin Login',
        component: AuthBodyAdmin,
        children: [
          {
            path: 'login',
            name: 'Login',
            component: Login,
            meta: {
              title: 'Admin Login | Almoosa Specialist Hospital',
              public: true
            }
          },
        ]
      },
    ]
  }
];

const router = new Router({
  routes,
  base: '/ashadmin/',
  linkActiveClass: "active",
  linkExactActiveClass: "",
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.title)
    document.title = to.meta.title;
  if (to.meta.public || to.path === '/callback' || userService.isAuthenticatedUser()) {
    return next();
  }
  next({ name: "Login" });
});

export default router
