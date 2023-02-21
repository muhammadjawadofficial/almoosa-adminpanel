import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";
import constants from "../constants/constants"

export const authService = {
    loginAdmin,
    login,
    loginDoctor,
    uploadId,
    register,
    resendOtp,
    verifyOtp,
    resetPassword,
    getNationalities,
    getDepartments,
    getClinics,
    getSpecialities,
    getSpecialitiesV1,
    addStaffMember
}


function loginAdmin(payload) {
    return axios({
        method: apiPath.login.admin.method,
        url: apiPath.login.admin.url,
        data: payload
    })
}
function login(payload) {
    let data = null;
    let loginVia = null;
    if (payload.type == constants.loginByOTP) {
        loginVia = apiPath.login.viaOTP;
        data = {
            [payload.method]: payload.username
        }
    } else {
        loginVia = apiPath.login.viaPassword
        data = {
            "field_name": payload.method,
            "username": payload.username,
            "password": payload.password,
        }
    }
    return axios({
        method: loginVia.method,
        url: loginVia.url,
        data
    })
}
function loginDoctor(payload) {
    let data = {
        "field_name": payload.method,
        "username": payload.username,
        "password": payload.password,
    }
    return axios({
        method: apiPath.login.doctor.method,
        url: apiPath.login.doctor.url,
        data
    })
}
function uploadId(file) {
    let data = new FormData();
    data.append('patient_id', file);
    return axios({
        method: apiPath.user.uploadId.method,
        url: apiPath.user.uploadId.url,
        data
    })
}
function register(data) {
    return axios({
        method: apiPath.register.patient.method,
        url: apiPath.register.patient.url,
        data
    })
}
function addStaffMember(data){
    return axios({
        method: apiPath.user.addStaffMember.method,
        url: apiPath.user.addStaffMember.url,
        data: data
    })
}
function resendOtp(data) {
    return axios({
        method: apiPath.loginOtp.resend.method,
        url: apiPath.loginOtp.resend.url,
        data
    })
}
function verifyOtp(data) {
    return axios({
        method: apiPath.loginOtp.verify.method,
        url: apiPath.loginOtp.verify.url,
        data
    })
}
function resetPassword(data) {
    return axios({
        method: apiPath.login.resetPassword.method,
        url: apiPath.login.resetPassword.url,
        data
    })
}
function getNationalities() {
    return axios({
        method: apiPath.user.getNationalities.method,
        url: apiPath.user.getNationalities.url
    })
}
function getDepartments() {
    return axios({
        method: apiPath.user.getDepartments.method,
        url: apiPath.user.getDepartments.url
    })
}
function getClinics() {
    return axios({
        method: apiPath.user.clinics.method,
        url: apiPath.user.clinics.url
    })
}

function getSpecialities() {
    return axios({
        method: apiPath.user.specialities.method,
        url: apiPath.user.specialities.url
    })
}

function getSpecialitiesV1() {
    return axios({
        method: apiPath.user.specialitiesV1.method,
        url: apiPath.user.specialitiesV1.url
    })
}