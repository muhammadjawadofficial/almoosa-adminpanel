import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const appointmentService = {
    fetchAppointments,
    fetchAppointmentInstructions,
    updateAppointmentInstructions,
    fetchAppointmentHistory,
    fetchAllAppointments,
    fetchPaymentsTypes,
    fetchTeleConsultation,
    fetchTeleConsultationSessions,
    ringPatient

}

function ringPatient(data) {
    return axios({
        method: apiPath.appointment.ringPatient.method,
        url: apiPath.appointment.ringPatient.url,
        data
    })
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
function fetchAppointmentInstructions(query) {
    return axios({
        method: apiPath.appointment.fetchInstructions(query).method,
        url: apiPath.appointment.fetchInstructions(query).url,
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
function fetchPaymentsTypes(query) {
    return axios({
        method: apiPath.appointment.getPaymentsTypes(query).method,
        url: apiPath.appointment.getPaymentsTypes(query).url,
    });
}
function fetchTeleConsultation(query) {
    return axios({
        method: apiPath.teleConsultation.fetchAll(query).method,
        url: apiPath.teleConsultation.fetchAll(query).url,
    });
}
function fetchTeleConsultationSessions(query) {
    return axios({
        method: apiPath.teleConsultation.fetchAllSessions(query).method,
        url: apiPath.teleConsultation.fetchAllSessions(query).url,
    });
}
