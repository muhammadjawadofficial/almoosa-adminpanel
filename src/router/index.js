import Vue from 'vue'
import Router from "vue-router";

import Body from '../components/body'
import AuthBody from '../components/auth_body'
import AuthBodyAdmin from '../components/auth_body_patient'
import Login from '../pages/authentication/login';
import NewPassword from '../pages/authentication/new_password';
import OTP from '../pages/authentication/otp';
import ForgotPassword from '../pages/authentication/forgot_password';

import Dashboard from '../pages/dashboard'

import PharmacistDashboard from '../pages/pharmacist/dashboard'
import PharmacistMedicationDetails from '../pages/pharmacist/refill-request-details'

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

import insuranceManagementModule from '../pages/insurance-management'
import insuranceManagementList from '../pages/insurance-management/insurance-management-list'
import insuranceManagementDetails from '../pages/insurance-management/insurance-management-details'

import specialitiesManagementModule from '../pages/specialities-management'
import specialitiesManagementList from '../pages/specialities-management/specialities-management-list'
import specialitiesManagementDetails from '../pages/specialities-management/specialities-management-details'

import bannerManagementModule from '../pages/banner-management'
import bannerManagementList from '../pages/banner-management/banner-management-list'
import bannerManagementDetails from '../pages/banner-management/banner-management-details'

import myMedicationModule from '../pages/medication'
import myMedicationSessions from '../pages/medication/medication-session-list'
import myMedicationList from '../pages/medication/medication-list'
import myMedicationDetails from '../pages/medication/medication-detail'
import medicationRefills from '../pages/medication/medication-refills'
import editMedicationDetails from '../pages/medication/edit-medication-detail'

import healthEducationModule from '../pages/health-education'
import healthEducationList from '../pages/health-education/health-education-list'
import healthEducationDetails from '../pages/health-education/health-education-details'
import healthEducationEdit from '../pages/health-education/health-education-edit'

import cmsPagesModule from '../pages/cms-pages'
import cmsPagesList from '../pages/cms-pages/cms-pages-list'
import cmsPagesDetails from '../pages/cms-pages/cms-pages-details'
import cmsPagesEdit from '../pages/cms-pages/cms-pages-edit'

import servicesPackagesModule from '../pages/services-packages'
import servicesPackagesList from '../pages/services-packages/services-packages-list'
import servicesPackagesDetails from '../pages/services-packages/services-packages-details'
import servicesPackagesForm from '../pages/services-packages/services-packages-form'

import familyMembersList from '../pages/family-members/family-members-list'
import familyMembersProfile from '../pages/family-members/family-members-profile'
import familyMembersForm from '../pages/family-members/family-members-form'

import familyRelationsList from '../pages/family-relations/family-relations-list'
import familyRelationsForm from '../pages/family-relations/family-relations-form'

import UsersModule from '../pages/users'
import PatientList from '../pages/users/patient-list'
import PhysicianList from '../pages/users/physician-list'
import StaffList from '../pages/users/staff-list'
import StaffForm from '../pages/users/staff-form'
import StaffProfile from '../pages/users/staff-profile'
import UserDetails from '../pages/users/user-details'
import UserProfile from '../pages/users/user-profile'

import promotionsModule from '../pages/promotions'
import promotionsList from '../pages/promotions/promotions-list'
import promotionsGroups from '../pages/promotions/promo-groups-list'
import promotionsGroupsCreate from '../pages/promotions/promo-groups-form'
import promotionsDetails from '../pages/promotions/promotions-details'
import promotionsForm from '../pages/promotions/promotions-form'

import TransactionsList from '../pages/transactions/transactions-list'

import RolesList from '../pages/roles-permissions/roles-list'

import PhysicianRating from '../pages/reports/physician-rating'
import NewPatientRequest from '../pages/reports/new-patient-request'
import InsuranceRequest from '../pages/reports/insurance-request'
import PhysicianReport from '../pages/reports/physician-list'
import MedicationRefills from '../pages/reports/medication-refills'

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
        path: 'pharmacist-dashboard',
        name: 'Pharmacist Dashboard',
        component: PharmacistDashboard,
        meta: {
          title: 'Pharmacist Dashboard | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'pharmacist-dashboard/details',
        name: 'Pharmacist Medication Details',
        component: PharmacistMedicationDetails,
        meta: {
          title: 'Pharmacist Dashboard | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'medication-refills',
        name: 'All Medication',
        component: medicationRefills,
        meta: {
          title: 'Medications | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'medication-refills/details',
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
            path: 'create',
            name: 'Health Education Create',
            component: healthEducationEdit,
            meta: {
              title: 'Health Education Create | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list',
            name: 'Health Education List',
            component: healthEducationList,
            meta: {
              title: 'Health Education List | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list/edit',
            name: 'Health Education Edit',
            component: healthEducationEdit,
            meta: {
              title: 'Health Education Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list/details/:id',
            name: 'Health Education Details',
            component: healthEducationDetails,
            meta: {
              title: 'Health Education Details | Almoosa Specialist Hospital',
            },
          }
        ]
      },
      {
        path: 'cms-pages',
        component: cmsPagesModule,
        children: [
          {
            path: 'create',
            name: 'CMS Pages Create',
            component: cmsPagesEdit,
            meta: {
              title: 'CMS Pages Create | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list',
            name: 'CMS Pages List',
            component: cmsPagesList,
            meta: {
              title: 'CMS Pages List | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list/edit',
            name: 'CMS Pages Edit',
            component: cmsPagesEdit,
            meta: {
              title: 'CMS Pages Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: 'list/details/:id',
            name: 'CMS Pages Details',
            component: cmsPagesDetails,
            meta: {
              title: 'CMS Pages Details | Almoosa Specialist Hospital',
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
              { path: '', name: "Patient", redirect: { name: 'Patient List', params: { tab: 'registered' } } },
              {
                path: ":tab",
                name: 'Patient List Tabs',
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
                  {
                    path: "family",
                    name: 'Patient Family Members',
                    component: familyMembersList,
                    meta: {
                      title: 'Patient Family Members | Almoosa Specialist Hospital',
                    },
                  },
                  {
                    path: "family/profile",
                    name: 'Patient Family Member Profile',
                    component: familyMembersProfile,
                    meta: {
                      title: 'Patient Family Member Profile | Almoosa Specialist Hospital',
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
                ]
              },
            ]
          },
          {
            path: 'physician',
            component: RouterViewModule,
            children: [
              {
                path: "",
                name: 'Physician List',
                component: PhysicianList,
                meta: {
                  title: 'Physician List | Almoosa Specialist Hospital',
                },
              },
              {
                path: "profile",
                name: 'Physician Profile',
                component: UserProfile,
                meta: {
                  title: 'Physician Profile | Almoosa Specialist Hospital',
                },
              },
            ]
          },
          {
            path: "staff/:roleId",
            name: 'Staff List',
            component: StaffList,
            meta: {
              title: 'Staff List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "update/staff",
            name: 'Staff Form',
            component: StaffForm,
            meta: {
              title: 'Staff Form | Almoosa Specialist Hospital',
            },
          },
          {
            path: "staff/:roleId/profile",
            name: 'Staff Profile',
            component: StaffProfile,
            meta: {
              title: 'Staff Profile | Almoosa Specialist Hospital',
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
      {
        path: 'family-members',
        component: RouterViewModule,
        children: [
          { path: '', name: "Family Members", redirect: { name: 'Family Members List' } },
          {
            path: "list",
            name: 'Family Members List',
            component: familyMembersList,
            meta: {
              title: 'Family Members List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "profile",
            name: 'Family Members Profile',
            component: familyMembersProfile,
            meta: {
              title: 'Family Members Profile | Almoosa Specialist Hospital',
            },
          },
          {
            path: "request",
            name: 'Family Members Request',
            component: familyMembersForm,
            meta: {
              title: 'Family Members Request | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'family-relations',
        component: RouterViewModule,
        children: [
          { path: '', name: "Family Relations", redirect: { name: 'Family Relations List' } },
          {
            path: "create",
            name: 'Family Relations Create',
            component: familyRelationsForm,
            meta: {
              title: 'Family Relations Create | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/edit",
            name: 'Family Relations Edit',
            component: familyRelationsForm,
            meta: {
              title: 'Family Relations Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list",
            name: 'Family Relations List',
            component: familyRelationsList,
            meta: {
              title: 'Family Relations List | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'insurance-management',
        component: insuranceManagementModule,
        children: [
          { path: '', name: "Insurance Management", redirect: { name: 'Insurance Management List' } },
          {
            path: "list",
            name: 'Insurance Management List',
            component: insuranceManagementList,
            meta: {
              title: 'Insurance Management List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "details",
            name: 'Insurance Management Details',
            component: insuranceManagementDetails,
            meta: {
              title: 'Insurance Management Details | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'specialities-management',
        component: specialitiesManagementModule,
        children: [
          { path: '', name: "Specialities Management", redirect: { name: 'Specialities Management List' } },
          {
            path: "list",
            name: 'Specialities Management List',
            component: specialitiesManagementList,
            meta: {
              title: 'Specialities Management List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "details",
            name: 'Specialities Management Details',
            component: specialitiesManagementDetails,
            meta: {
              title: 'Specialities Management Details | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'banner-management',
        component: bannerManagementModule,
        children: [
          { path: '', name: "Banner Management", redirect: { name: 'Banner Management List' } },
          {
            path: "list",
            name: 'Banner Management List',
            component: bannerManagementList,
            meta: {
              title: 'Banner Management List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/details",
            name: 'Banner Management Details',
            component: bannerManagementDetails,
            meta: {
              title: 'Banner Management Details | Almoosa Specialist Hospital',
            },
          },
          {
            path: "create",
            name: 'Banner Management Create',
            component: bannerManagementDetails,
            meta: {
              title: 'Banner Management Create | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'transactions',
        component: RouterViewModule,
        children: [
          { path: '', name: "Transactions", redirect: { name: 'Transactions List' } },
          {
            path: "list",
            name: 'Transactions List',
            component: TransactionsList,
            meta: {
              title: 'Transactions List | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'roles-permissions',
        component: RouterViewModule,
        children: [
          { path: '', name: "Roles Permissions", redirect: { name: 'Roles List' } },
          {
            path: "list",
            name: 'Roles List',
            component: RolesList,
            meta: {
              title: 'Roles List | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'reports',
        component: RouterViewModule,
        children: [
          { path: '', name: "Reports", redirect: { name: 'Physician Rating' } },
          {
            path: "physician-rating",
            name: 'Physician Rating',
            component: PhysicianRating,
            meta: {
              title: 'Physician Rating | Almoosa Specialist Hospital',
            },
          },
          {
            path: "new-patient-request",
            name: 'New Patient Request',
            component: NewPatientRequest,
            meta: {
              title: 'New Patient Request | Almoosa Specialist Hospital',
            },
          },
          {
            path: "insurance-request",
            name: 'Insurance Request',
            component: InsuranceRequest,
            meta: {
              title: 'Insurance Request | Almoosa Specialist Hospital',
            },
          },
          {
            path: "physician-report",
            name: 'Physician Report',
            component: PhysicianReport,
            meta: {
              title: 'Physician Report | Almoosa Specialist Hospital',
            },
          },
          {
            path: "medication-refills",
            name: 'Medication Refills',
            component: MedicationRefills,
            meta: {
              title: 'Medication Refills | Almoosa Specialist Hospital',
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
          {
            path: 'otp',
            name: 'OTP',
            component: OTP,
            meta: {
              title: 'OTP | Almoosa Health Group',
              public: true,
              hideButtons: true
            }
          },
          {
            path: 'forgot-password',
            name: 'Forgot Password',
            component: ForgotPassword,
            meta: {
              title: 'Forgot Password | Almoosa Health Group',
              public: true
            }
          },
          {
            path: 'new-password',
            name: 'New Password',
            component: NewPassword,
            meta: {
              title: 'New Password | Almoosa Health Group',
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
  base: '/',
  linkActiveClass: "active",
  linkExactActiveClass: "",
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
});

import { resetCancellation } from '../services/axios';

router.beforeEach((to, from, next) => {
  resetCancellation();
  if (to.meta.title)
    document.title = to.meta.title;
  if (to.meta.public || to.path === '/callback' || userService.isAuthenticatedUser()) {
    return next();
  }
  next({ name: "Login" });
});

export default router
