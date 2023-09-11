export default {
    loginByPassword: 1,
    loginByOTP: 2,
    auth: {
        login: "authLogin",
        register: "authRegister",
        forgotPassword: "forgotPassword",
        loginOtp: "authLoginOtp"
    },
    validation: {
        iqama: {
            min: 8,
            max: 15
        },
        saudi: {
            min: 10,
            max: 10
        },
        mrn: {
            min: 7,
            max: 7
        },
        phoneNumber: {
            min: 10,
            max: 15
        }
    },
    FAMILY_MEMBERS: "Family Members",
    APPOINTMENTS: "Appointments",
    HEALTH_EDUCATION: "Health Education",
    LAB_RADIOLOGY: "Lab & Radiology",
    REPORTS_MANAGEMENT: "Reports Management",
    INSURANCE_MANAGEMENT: "Insurance Management",
    CHATBOT: "Chatbot",
    SERVICES_PACKAGES: "Services & Packages",
    PROMOTIONS_AND_LOYALTY_POINTS: "Promotions and Loyalty Points",
    MEDICATIONS: "Medications",
    PHARMACIST_DASHBOARD: "Pharmacist Dashboard",
    RATINGS_MONITORING: "Ratings monitoring",
    HEALTH_EDUCATION: "Health Education",
}