let basePath = process.env.VUE_APP_API_BASE_URL + "api/v1/";

let getApiObject = (method, url, pre = basePath) => {
    return { method, url: pre + url };
}

export const apiPath = {
    //Login
    login: {
        admin: getApiObject("post", "auth/admin/login"),
    },

    appointment: {
        view: (type) => getApiObject("get", "appointments?type=" + type),
        fetchInstructions: getApiObject("get", "system-settings?title=TELE_INSTRUCTIONS"),
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
        fetch: (id) => getApiObject("get", "insurances?patient_id=" + id + "&sort=-id"),
    },

    medication: {
        getMedications: (id) => getApiObject("get", "medications?appointment_id=" + id),
        getCurrentMedications: (query) => getApiObject("get", "medications/current" + (query || '')),
    },

    reports: {
        appointmentWithReports: (id, type) => getApiObject("get", "appointments/reports?patient_id=" + id + "&type=" + type),
        appointment: (id, type) => getApiObject("get", "reports?appointment_id=" + id + "&type=" + type),
    },

    user: {
        updateProfile: (id) => getApiObject("patch", "users/" + id),
        getProfile: (profile) => getApiObject("get", "auth/" + profile + "/profile"),
        fetchUsers: (query) => getApiObject("get", "users" + query),
        getNationalities: getApiObject("get", "nationalities"),
        getDepartments: getApiObject("get", "departments"),
        clinics: getApiObject("get", "clinics"),
        specialities: getApiObject("get", "specialities"),
        uploadId: getApiObject("post", "mediafiles/upload"),
    },
};