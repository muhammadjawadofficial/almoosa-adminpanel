import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const medicalReportsService = {
    fetchAllRequests,
    updateRequest,
    deleteRequest
}

function fetchAllRequests(query) {
    return axios({
        method: apiPath.medicalReports.fetchAllRequests(query).method,
        url: apiPath.medicalReports.fetchAllRequests(query).url,
    })
}
function updateRequest(id, data) {
    return axios({
        method: apiPath.medicalReports.updateRequest(id).method,
        url: apiPath.medicalReports.updateRequest(id).url,
        data
    })
}
function deleteRequest(id) {
    return axios({
        method: apiPath.medicalReports.deleteRequest(id).method,
        url: apiPath.medicalReports.deleteRequest(id).url,
    })
}