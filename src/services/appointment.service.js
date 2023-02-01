import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    fetchAppointments,
    fetchAppointmentInstructions,
    updateAppointmentInstructions,
    fetchAppointmentHistory,
    fetchAllAppointments
}


function fetchAppointments(type) {
    return axios({
        method: apiPath.appointment.view(type).method,
        url: apiPath.appointment.view(type).url,
    })
}
function fetchAllAppointments(query) {
    return axios({
        method: apiPath.appointment.all(query).method,
        url: apiPath.appointment.all(query).url,
    })
}
function fetchAppointmentInstructions() {
    return axios({
        method: apiPath.appointment.fetchInstructions.method,
        url: apiPath.appointment.fetchInstructions.url,
    })
}
function updateAppointmentInstructions(id, value) {
    return axios({
        method: apiPath.appointment.updateInstructions(id).method,
        url: apiPath.appointment.updateInstructions(id).url,
        data: {
            value: value
        }
    })
}
function fetchAppointmentHistory(type) {
    let obj = type == 'upcoming' ? apiPath.appointment.fetchUpcomingAppointments : apiPath.appointment.fetchAppointmentHistory;
    return axios({
        method: obj.method,
        url: obj.url,
    })
}
