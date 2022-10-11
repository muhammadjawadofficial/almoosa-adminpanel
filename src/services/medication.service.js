import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const medicationService = {
    getAppointmentHistory,
    getMedications,
    getCurrentMedications
}

function getAppointmentHistory(id) {
    return axios({
        method: apiPath.appointment.fetchPatientAppointmentHistory(id).method,
        url: apiPath.appointment.fetchPatientAppointmentHistory(id).url,
    })
}
function getMedications(id) {
    return axios({
        method: apiPath.medication.getMedications(id).method,
        url: apiPath.medication.getMedications(id).url,
    })
}
function getCurrentMedications(query) {
    return axios({
        method: apiPath.medication.getCurrentMedications(query || '').method,
        url: apiPath.medication.getCurrentMedications(query || '').url,
    })
}