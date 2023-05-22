import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const reportService = {
    getAppointmentsWithReports,
    fetchLabReports,
    fetchRadiologyReports,
    getReportsWithAppointments,
    getDashboardStats
}

function getAppointmentsWithReports(id, type) {
    return axios({
        method: apiPath.reports.appointmentWithReports(id, type).method,
        url: apiPath.reports.appointmentWithReports(id, type).url,
    })
}

function fetchLabReports(id) {
    return axios({
        method: apiPath.reports.appointment(id, 'lab').method,
        url: apiPath.reports.appointment(id, 'lab').url,
    })
}
function fetchRadiologyReports(id) {
    return axios({
        method: apiPath.reports.appointment(id, 'radiology').method,
        url: apiPath.reports.appointment(id, 'radiology').url,
    })
}

function getReportsWithAppointments(id) {
    return axios({
        method: apiPath.reports.reportsWithAppointments(id).method,
        url: apiPath.reports.reportsWithAppointments(id).url,
    })
}

function getDashboardStats(query) {
    return axios({
        method: apiPath.reports.dashboardStats(query).method,
        url: apiPath.reports.dashboardStats(query).url,
    })
}