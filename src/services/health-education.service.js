import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const healthEducationService = {
    fetchHealthEducations,
    fetchHealthEducationsDetails,
    addHealthEducationArticle
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