import { apiPath } from "../constants/apiPath";

export const userService = {
    isAuthenticatedUser,
    storeLoginInfo,
    removeLoginInfo,
    currentUser,
    storeUserInfo,
    getToken,
    removeToken,
    setToken,
    setSelectedLayout,
    getSelectedLayout,
    getRole,
    getUserRole,
    setRole,
    getBooking,
    removeBooking,
    setBooking,
    downloadFile,
    updateProfile,
    getProfile,
    getDoctorProfile,
    getOrCreateDoctorProfile,
    getUsers,
    getDuplicatedUsers,
    getPatients,
    getDoctors,
    deleteUser,
    setFCMToken,
    getFCMToken,
    removeFCMToken,
    changeLanguage,
    logout,
    fetchNotifications,
    markAllAsRead,
    updateDoctorProfile
};

import axios from "axios";

const jwtTokenKey = 'token';
const userInfo = 'userInfo';

const preferredLayout = 'user-layout';

const userRole = 'userRole';

const paymentToBeBook = 'booking'

const fcmToken = 'fcmToken';

function isAuthenticatedUser() {
    return !!localStorage.getItem(jwtTokenKey);
}

function storeLoginInfo(user, token) {
    // store Patient Details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem(userInfo, JSON.stringify(user));
    localStorage.setItem(jwtTokenKey, token);
}

function removeLoginInfo() {
    localStorage.removeItem(userInfo);
    localStorage.removeItem(jwtTokenKey);
}

function currentUser() {
    return JSON.parse(localStorage.getItem(userInfo));
}
function storeUserInfo(user) {
    localStorage.setItem(userInfo, JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem(jwtTokenKey);
}
function removeToken() {
    return localStorage.removeItem(jwtTokenKey);
}
function setToken(token) {
    return localStorage.setItem(jwtTokenKey, token);
}
function setSelectedLayout(lang) {
    return localStorage.setItem(preferredLayout, lang);
}
function getSelectedLayout() {
    return localStorage.getItem(preferredLayout);
}
function getRole() {
    return localStorage.getItem(userRole);
}
function getUserRole() {
    return currentUser() && currentUser().role_id;
}
function setRole(role) {
    return localStorage.setItem(userRole, role);
}
function getBooking() {
    return JSON.parse(localStorage.getItem(paymentToBeBook));
}
function removeBooking() {
    return localStorage.removeItem(paymentToBeBook);
}
function setBooking(booking) {
    return localStorage.setItem(paymentToBeBook, JSON.stringify(booking));
}
function downloadFile(file) {
    let fileName = file.name;
    axios({
        url: process.env.VUE_APP_SERVER + file.url,
        method: "GET",
        responseType: "blob",
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
function updateProfile(userId, profile) {
    return axios({
        method: apiPath.user.updateProfile(userId).method,
        url: apiPath.user.updateProfile(userId).url,
        data: profile
    })
}
function updateDoctorProfile(userId, profile) {
    return axios({
        method: apiPath.user.updateDoctorProfile(userId).method,
        url: apiPath.user.updateDoctorProfile(userId).url,
        data: profile
    })
}
function getProfile(profile, mrn) {
    return axios({
        method: apiPath.user.getProfile(profile, mrn).method,
        url: apiPath.user.getProfile(profile, mrn).url,
    })
}
function getDoctorProfile(id) {
    return axios({
        method: apiPath.user.getDoctorProfile(id).method,
        url: apiPath.user.getDoctorProfile(id).url,
    })
}
function getOrCreateDoctorProfile(id) {
    return axios({
        method: apiPath.user.getOrCreateDoctorProfile(id).method,
        url: apiPath.user.getOrCreateDoctorProfile(id).url,
    })
}
function getUsers(query) {
    return axios({
        method: apiPath.user.fetchUsers(query || '').method,
        url: apiPath.user.fetchUsers(query || '').url,
    })
}
function getDuplicatedUsers(query) {
    return axios({
        method: apiPath.user.fetchDuplicatedUsers(query || '').method,
        url: apiPath.user.fetchDuplicatedUsers(query || '').url,
    })
}
function getPatients(query) {
    return axios({
        method: apiPath.user.fetchPatients(query || '').method,
        url: apiPath.user.fetchPatients(query || '').url,
    })
}
function getDoctors(query) {
    return axios({
        method: apiPath.user.fetchDoctors(query || '').method,
        url: apiPath.user.fetchDoctors(query || '').url,
    })
}
function deleteUser(id) {
    return axios({
        method: apiPath.user.deleteUser(id).method,
        url: apiPath.user.deleteUser(id).url,
    })
}
function setFCMToken(token) {
    localStorage.setItem(fcmToken, token);
}
function getFCMToken() {
    return localStorage.getItem(fcmToken);
}
function removeFCMToken() {
    return localStorage.removeItem(fcmToken);
}
function changeLanguage(lang) {
    return axios({
        method: apiPath.user.changeLanguage.method,
        url: apiPath.user.changeLanguage.url,
        data: {
            "language": lang
        }
    })
}
function logout() {
    return axios({
        method: apiPath.user.logout.method,
        url: apiPath.user.logout.url,
    })
}
function fetchNotifications(query) {
    return axios({
        method: apiPath.user.fetchNotifications(query).method,
        url: apiPath.user.fetchNotifications(query).url,
    })
}
function markAllAsRead(data) {
    return axios({
        method: apiPath.user.markAllAsRead.method,
        url: apiPath.user.markAllAsRead.url,
        data
    })
}