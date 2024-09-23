import Vue from 'vue'
import Router from "vue-router";

const Body = () => import('../components/body')
const AuthBody = () => import('../components/auth_body')
const AuthBodyAdmin = () => import('../components/auth_body_patient')
const Login = () => import('../pages/authentication/login')
const NewPassword = () => import('../pages/authentication/new_password')
const OTP = () => import('../pages/authentication/otp')
const ForgotPassword = () => import('../pages/authentication/forgot_password')

const Dashboard = () => import('../pages/dashboard')
const OnSpotConsultation = () => import('../pages/onspot-consultation')

const PharmacistDashboard = () => import('../pages/pharmacist/dashboard')
const PharmacistMedicationDetails = () => import('../pages/pharmacist/refill-request-details')

const RouterViewModule = () => import('../pages/reusable/module')

const AppointmentModule = () => import('../pages/appointment')
const ViewAppointment = () => import('../pages/appointment/view-appointments')
const AppointmentHistory = () => import('../pages/appointment/appointment-history')
const AppointmentHistoryDetails = () => import('../pages/appointment/appointment-history-details')
const AppointmentInstructions = () => import('../pages/appointment/appointment-instructions')

const myTimelineModule = () => import('../pages/my-timeline')
const myTimelineDetails = () => import('../pages/my-timeline/timeline-details')
const myTimelineList = () => import('../pages/my-timeline/timeline-list')

const labWorksModule = () => import('../pages/lab-works')
const labWorksReports = () => import('../pages/lab-works/report-list')
const labWorksSessions = () => import('../pages/lab-works/doctor-list')

const radiologyReportModule = () => import('../pages/radiology-reports')
const radiologyReportReports = () => import('../pages/radiology-reports/report-list')
const radiologyReportSessions = () => import('../pages/radiology-reports/doctor-list')

const insuranceModule = () => import('../pages/insurance')
const insuranceMyMedical = () => import('../pages/insurance/my-medical-insurance')
const addNewInsurance = () => import('../pages/insurance/add-new-insurance')

const insuranceManagementModule = () => import('../pages/insurance-management')
const insuranceManagementList = () => import('../pages/insurance-management/insurance-management-list')
const insuranceManagementDetails = () => import('../pages/insurance-management/insurance-management-details')

const specialitiesManagementModule = () => import('../pages/specialities-management')
const specialitiesManagementList = () => import('../pages/specialities-management/specialities-management-list')
const specialitiesManagementDetails = () => import('../pages/specialities-management/specialities-management-details')

const bannerManagementModule = () => import('../pages/banner-management')
const bannerManagementList = () => import('../pages/banner-management/banner-management-list')
const bannerManagementDetails = () => import('../pages/banner-management/banner-management-details')

const myMedicationModule = () => import('../pages/medication')
const myMedicationSessions = () => import('../pages/medication/medication-session-list')
const myMedicationList = () => import('../pages/medication/medication-list')
const myMedicationDetails = () => import('../pages/medication/medication-detail')
const medicationRefills = () => import('../pages/medication/medication-refills')
const editMedicationDetails = () => import('../pages/medication/edit-medication-detail')

const healthEducationModule = () => import('../pages/health-education')
const healthEducationList = () => import('../pages/health-education/health-education-list')
const healthEducationDetails = () => import('../pages/health-education/health-education-details')
const healthEducationEdit = () => import('../pages/health-education/health-education-edit')

const cmsPagesModule = () => import('../pages/cms-pages')
const cmsPagesList = () => import('../pages/cms-pages/cms-pages-list')
const cmsPagesDetails = () => import('../pages/cms-pages/cms-pages-details')
const cmsPagesEdit = () => import('../pages/cms-pages/cms-pages-edit')

const servicesPackagesModule = () => import('../pages/services-packages')
const servicesPackagesList = () => import('../pages/services-packages/services-packages-list')
const servicesPackagesForm = () => import('../pages/services-packages/services-packages-form')
const tamaraLimitsForm = () => import('../pages/services-packages/tamara-limits')

const contactInformationForm = () => import('../pages/system-preference/contact-information')
const configURLForm = () => import('../pages/system-preference/config-url')
const appointmentConfigForm = () => import('../pages/system-preference/appointment-config')

const symptomCheckerModule = () => import('../pages/symptom-checker')
const symptomCheckerList = () => import('../pages/symptom-checker/symptom-checker-list')
const symptomCheckerForm = () => import('../pages/symptom-checker/symptom-checker-form')
const symptomCheckerAgeConditionForm = () => import('../pages/symptom-checker/symptom-checker-age-condition-form')
const symptomCheckerAgeConditionList = () => import('../pages/symptom-checker/symptom-checker-age-condition-list')

const familyMembersList = () => import('../pages/family-members/family-members-list')
const familyMembersProfile = () => import('../pages/family-members/family-members-profile')
const familyMembersForm = () => import('../pages/family-members/family-members-form')

const familyRelationsList = () => import('../pages/family-relations/family-relations-list')
const familyRelationsForm = () => import('../pages/family-relations/family-relations-form')

const UsersModule = () => import('../pages/users')
const PatientList = () => import('../pages/users/patient-list')
const PhysicianList = () => import('../pages/users/physician-list')
const StaffList = () => import('../pages/users/staff-list')
const StaffForm = () => import('../pages/users/staff-form')
const StaffProfile = () => import('../pages/users/staff-profile')
const UserDetails = () => import('../pages/users/user-details')
const UserProfile = () => import('../pages/users/user-profile')

const promotionsModule = () => import('../pages/promotions')
const promotionsList = () => import('../pages/promotions/promotions-list')
const promotionsGroups = () => import('../pages/promotions/promo-groups-list')
const promotionsGroupsCreate = () => import('../pages/promotions/promo-groups-form')
const promotionsDetails = () => import('../pages/promotions/promotions-details')
const promotionsForm = () => import('../pages/promotions/promotions-form')
const promotionListCode = () => import('../pages/promotions/promotion-list-code')
const promotionCreateCode = () => import('../pages/promotions/promotion-create-code')
const firstFreeAppointmentReport = () => import('../pages/promotions/first-free-appointment-list')

const TransactionsList = () => import('../pages/transactions/transactions-list')

const TeleConsultationList = () => import('../pages/tele-consultation/tele-consultation-list')
const TeleConsultationSessions = () => import('../pages/tele-consultation/tele-consultation-session-list')

const RolesList = () => import('../pages/roles-permissions/roles-list')

const PhysicianRating = () => import('../pages/reports/physician-rating')
const NewPatientRequest = () => import('../pages/reports/new-patient-request')
const InsuranceRequest = () => import('../pages/reports/insurance-request')
const PhysicianReport = () => import('../pages/reports/physician-list')
const MedicationRefills = () => import('../pages/reports/medication-refills')
const seeAllNotifications = () => import('../pages/see-all-notifications')
const notificationsLists = () => import('../pages/notifications/notifications-management-list')
const notificationsDetail = () => import('../pages/notifications/notifications-management-details')
const notificationsUsersDetail = () => import('../pages/notifications/notifications-users')
const broadcastNotfication = () => import('../pages/notifications/broadcast')

const LoyaltyPoints = () => import('../pages/reports/loyalty-points')

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
        path: 'onspot-consultation',
        name: 'OnSpot Consultation',
        component: OnSpotConsultation,
        meta: {
          title: 'OnSpot Consultation | Almoosa Specialist Hospital',
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
          }
        ]
      },
      {
        path: 'system-preferences',
        component: RouterViewModule,
        children: [
          {
            path: "tamara-limits",
            name: 'Services Packages Tamara Limits',
            component: tamaraLimitsForm,
            meta: {
              title: 'Services Packages Tamara Limits | Almoosa Specialist Hospital',
            },
          },
          {
            path: "contact-information",
            name: 'Contact Information',
            component: contactInformationForm,
            meta: {
              title: 'Contact Information | Almoosa Specialist Hospital',
            },
          },
          {
            path: "config-url",
            name: 'Config URL',
            component: configURLForm,
            meta: {
              title: 'Config URL | Almoosa Specialist Hospital',
            },
          },
          {
            path: "appointment-config",
            name: 'Appointment Config',
            component: appointmentConfigForm,
            meta: {
              title: 'Appointment Config | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'symptom-checker',
        component: symptomCheckerModule,
        children: [
          {
            path: "create",
            name: 'Symptom Checker Create',
            component: symptomCheckerForm,
            meta: {
              title: 'Symptom Checker Create | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/edit",
            name: 'Symptom Checker Edit',
            component: symptomCheckerForm,
            meta: {
              title: 'Symptom Checker Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list",
            name: 'Symptom Checker List',
            component: symptomCheckerList,
            meta: {
              title: 'Symptom Checker List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "age-condition/list",
            name: 'Symptom Checker Age Condition List',
            component: symptomCheckerAgeConditionList,
            meta: {
              title: 'Symptom Checker Age Condition List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "age-condition/list/edit",
            name: 'Symptom Checker Age Condition Edit',
            component: symptomCheckerAgeConditionForm,
            meta: {
              title: 'Symptom Checker Age Condition Edit | Almoosa Specialist Hospital',
            },
          },
          {
            path: "age-condition/create",
            name: 'Symptom Checker Age Condition Create',
            component: symptomCheckerAgeConditionForm,
            meta: {
              title: 'Symptom Checker Age Condition Create | Almoosa Specialist Hospital',
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
          {
            path: "first-free-appointment",
            name: 'First Free Appointment Report',
            component: firstFreeAppointmentReport,
            meta: {
              title: 'First Free Appointment Report | Almoosa Specialist Hospital',
            },
          },
          {
            path: "code/list",
            name: 'Promotion List',
            component: promotionListCode,
            meta: {
              title: 'Promotions Details | Almoosa Specialist Hospital',
            },
          },
          {
            path: "code/create",
            name: 'Promotions Code Create',
            component: promotionCreateCode,
            meta: {
              title: 'Promotions Create | Almoosa Specialist Hospital',
            },
          },
          {
            path: "code/list/edit",
            name: 'Promotions Code Edit',
            component: promotionCreateCode,
            meta: {
              title: 'Promotions Edit | Almoosa Specialist Hospital',
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
        path: 'tele-consultation',
        component: RouterViewModule,
        children: [
          { path: '', name: "TeleConsultation", redirect: { name: 'Tele Consultation List' } },
          {
            path: "list",
            name: 'Tele Consultation List',
            component: TeleConsultationList,
            meta: {
              title: 'Tele Consultation List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/item",
            name: 'Tele Consultation Sessions',
            component: TeleConsultationSessions,
            meta: {
              title: 'Tele Consultation Sessions | Almoosa Specialist Hospital',
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
          {
            path: "loyalty-points",
            name: 'Loyalty Pointns',
            component: LoyaltyPoints,
            meta: {
              title: 'Loyalty Pointns | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      // notificationsLists
      {
        path: 'notifications',
        component: RouterViewModule,
        children: [
          { path: '', name: "Notifications", redirect: { name: 'Notifications List' } },
          {
            path: "list",
            name: 'Notifications List',
            component: notificationsLists,
            meta: {
              title: 'Notifications List | Almoosa Specialist Hospital',
            },
          },
          {
            path: "list/update",
            name: 'Notification Update',
            component: notificationsDetail,
            meta: {
              title: 'Notification Update | Almoosa Specialist Hospital',
            },
          },
          {
            path: "users-details",
            name: 'Notifications Users',
            component: notificationsUsersDetail,
            meta: {
              title: 'Notifications Users Details | Almoosa Specialist Hospital',
            },
          },

        ]
      },
      {
        path: 'broadcast-notification',
        name: 'Broadcast Notification',
        component: broadcastNotfication,
        meta: {
          title: 'Broadcast Notification | Almoosa Specialist Hospital',
        },
      },
      {
        path: "see-all-notifications",
        name: "All Notifications",
        component: seeAllNotifications,
        meta: {
          title: "All Notifications | Almoosa Health Group",
        },
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
