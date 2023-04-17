let getApiObject = (method, url, version = "v1", pre = null) => {
    let versionKey = version.toUpperCase();
    let envKey = 'VUE_APP_API_' + versionKey + '_BASE_URL';
    let baseUrl = pre || process.env[envKey];
    // baseUrl = "http://172.16.247.126:3000/";
    // baseUrl = "http://localhost:3000/";
    return { method, url: baseUrl + "api/" + version + "/" + url };
}

export const apiPath = {
    //Login
    login: {
        admin: getApiObject("post", "auth/admin/login"),
        resetPassword: getApiObject("post", "password/reset")
    },

    loginOtp: {
        resend: getApiObject("post", "otp/send"),
        verify: getApiObject("post", "otp/verify", "v2"),
    },

    appointment: {
        view: (type) => getApiObject("get", "appointments?type=" + type),
        all: (query) => getApiObject("get", "admin/appointments" + query, "v2"),
        fetchInstructions: (query) => getApiObject("get", "system-settings" + query),
        updateInstructions: (id) => getApiObject("patch", "system-settings/" + id),
        fetchUpcomingAppointments: getApiObject("get", "appointments/upcoming"),
        fetchAppointmentHistory: getApiObject("get", "appointments/history"),
        fetchPatientAppointmentHistory: (id) => getApiObject("get", "appointments/history?patient_id=" + id),
    },

    promotions: {
        assigned: getApiObject("get", "promotions/assigned"),
        apply: getApiObject("post", "promotions/apply"),
        all: getApiObject("get", "promotions"),
        createPromotion: getApiObject("post", "promotions"),
        updatePromotion: (id) => getApiObject("patch", "promotions/" + id),
        deletePromotion: (id) => getApiObject("delete", "promotions/" + id),
        allPromoGroups: getApiObject("get", "promo-groups"),
        createPromoGroups: getApiObject("post", "promo-groups"),
        deletePromoGroups: (id) => getApiObject("delete", "promo-groups/" + id),
        updatePromoGroupDetails: (id) => getApiObject("patch", "promo-groups/" + id),
        updatePromoGroupUsers: getApiObject("post", "users/promo-group"),
    },

    insurance: {
        addNew: getApiObject("post", "insurances"),
        services: (id) => getApiObject("get", "insurances/services?mrn_number=" + id, "v2"),
        fetch: (id) => getApiObject("get", "insurances?mrn_number=" + id + "&sort=-id", "v2"),
        fetchAll: getApiObject("get", "insurances"),
        update: (id) => getApiObject("patch", "insurances/" + id),
        delete: (id) => getApiObject("delete", "insurances/" + id),
    },

    medication: {
        getCurrentMedications: (query) => getApiObject("get", "medications/current" + (query || '')),
        getMedicationRefills: (query) => getApiObject("get", "medication-refills" + (query || '')),
        updateMedicationRefill: (id) => getApiObject("patch", "medication-refills/" + id),
        deleteMedicationRefill: (id) => getApiObject("delete", "medication-refills/" + id),
    },

    reports: {
        getAppointmentMedication: (id) => getApiObject("get", "appointments/with-medications?mrn_number=" + id, "v2"),
        getMedications: (id) => getApiObject("get", "medications?appointment_id=" + id + "&is_active=2  ", "v2"),
        appointmentWithReports: (id) => getApiObject("get", "appointments/reports?mrn_number=" + id, "v2"),
        appointment: (id, type) => getApiObject("get", "reports?appointment_id=" + id + "&type=" + type),
        reportsWithAppointments: (id) => getApiObject("get", "reports?appointment_id=" + id, "v2"),
        appointmentStats: (query) => getApiObject("get", "reports/statistics/appointment" + query, "v2"),
    },

    user: {
        updateProfile: (id) => getApiObject("patch", "users/" + id),
        getProfile: (profile, mrn) => getApiObject("get", "auth/patient/profile?mrn_number=" + mrn, "v2"),
        getDoctorProfile: (id) => getApiObject("get", "users?id=" + id),
        fetchUsers: (query) => getApiObject("get", "users" + query),
        deleteUser: (id) => getApiObject("delete", "users/" + id),
        fetchDuplicatedUsers: (query) => getApiObject("get", "users/duplicate" + query),
        fetchPatients: (query) => getApiObject("get", "admin/patients" + query, "v2"),
        fetchDoctors: (query) => getApiObject("get", "admin/doctors" + query, "v2"),
        getNationalities: getApiObject("get", "nationalities"),
        getDepartments: getApiObject("get", "departments"),
        clinics: getApiObject("get", "clinics"),
        specialities: getApiObject("get", "specialities", "v2"),
        specialitiesV1: getApiObject("get", "specialities"),
        uploadId: getApiObject("post", "mediafiles/upload"),
        addStaffMember: getApiObject("post", "auth/staff/register"),
    },

    speciality: {
        update: (id) => getApiObject("patch", "specialities/" + id),
    },

    healthEducation: {
        fetch: getApiObject("get", "health-education"),
        details: (id) => getApiObject("get", "health-education/" + id),
        save: getApiObject("post", "health-education"),
        update: (id) => getApiObject("patch", "health-education/" + id),
        delete: (id) => getApiObject("delete", "health-education/" + id),
    },

    cmsPages: {
        fetch: getApiObject("get", "cms-content"),
        details: (id) => getApiObject("get", "cms-content/" + id),
        save: getApiObject("post", "cms-content"),
        update: (id) => getApiObject("patch", "cms-content/" + id),
        delete: (id) => getApiObject("delete", "cms-content/" + id),
    },

    timeline: {
        sessions: (id) => getApiObject("get", "timelines?mrn_number=" + id, "v2"),
        details: (mrn, id) => getApiObject("get", "timelines/details?mrn_number=" + mrn + "&id=" + id, "v2"),
    },

    servicesPackages: {
        fetch: getApiObject("get", "packages"),
        details: (id) => getApiObject("get", "health-education/" + id),
        add: getApiObject("post", "packages"),
        update: (id) => getApiObject("patch", "packages/" + id),
        delete: (id) => getApiObject("delete", "packages/" + id),
    },

    familyMembers: {
        fetch: (id) => getApiObject("get", "users?guardian_id=" + id),
        fetchAll: (query) => getApiObject("get", "all-family-members" + (query || '')),
        add: getApiObject("post", "family-members/add"),
    },

    transactions: {
        fetchAll: (query) => getApiObject("get", "payments/transactions" + query),
    },

    rolesPermissions: {
        fetchRoles: getApiObject("get", "roles"),
        fetchPermissions: getApiObject("get", "permissions"),
        fetchRoleDetails: (id) => getApiObject("get", "roles-permissions?role_id=" + id),
        updateRoleDetails: (id) => getApiObject("patch", "roles-permissions/" + id),
    },

    bannerManagement: {
        fetchAll: (query) => getApiObject("get", "banner" + query),
        save: getApiObject("post", "banner"),
        update: (id) => getApiObject("patch", "banner/" + id),
        delete: (id) => getApiObject("delete", "banner/" + id),
    }
};