import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const healthEducationService = {
    fetchHealthEducations,
    fetchHealthEducationsDetails,
    addHealthEducationArticle,
    updateHealthEducationArticle,
    deleteHealthEducationArticle
}

function fetchHealthEducations() {
    return axios({
        method: apiPath.healthEducation.fetch.method,
        url: apiPath.healthEducation.fetch.url,
    })
}
function fetchHealthEducationsDetails(id) {
    return axios({
        method: apiPath.healthEducation.details(id).method,
        url: apiPath.healthEducation.details(id).url,
    })
}
function addHealthEducationArticle(data) {
    return axios({
        method: apiPath.healthEducation.save.method,
        url: apiPath.healthEducation.save.url,
        data
    })
}
function updateHealthEducationArticle(id, data) {
    return axios({
        method: apiPath.healthEducation.update(id).method,
        url: apiPath.healthEducation.update(id).url,
        data
    })
}
function deleteHealthEducationArticle(id) {
    return axios({
        method: apiPath.healthEducation.delete(id).method,
        url: apiPath.healthEducation.delete(id).url
    })
}