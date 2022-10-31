import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const medicationService = {
    getAppointmentHistory,
    getMedications,
    getCurrentMedications,
    getMedicationRefills,
    updateMedicationRefill,
    deleteMedicationRefill
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
function getMedicationRefills(query) {
    return axios({
        method: apiPath.medication.getMedicationRefills(query || '').method,
        url: apiPath.medication.getMedicationRefills(query || '').url,
    })
}
function updateMedicationRefill(id, data) {
    return axios({
        method: apiPath.medication.updateMedicationRefill(id).method,
        url: apiPath.medication.updateMedicationRefill(id).url,
        data
    })
}
function deleteMedicationRefill(id) {
    return axios({
        method: apiPath.medication.deleteMedicationRefill(id).method,
        url: apiPath.medication.deleteMedicationRefill(id).url,
    })
}