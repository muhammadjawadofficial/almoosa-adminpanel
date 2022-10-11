import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const reportService = {
    getAppointmentsWithReports,
    fetchLabReports,
    fetchRadiologyReports
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