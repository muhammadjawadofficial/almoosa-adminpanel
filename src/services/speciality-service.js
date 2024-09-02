import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const specialityService = {
    updateSpeciality,
    assignParent,
    assignChild
}

function updateSpeciality(id, data) {
    return axios({
        method: apiPath.speciality.update(id).method,
        url: apiPath.speciality.update(id).url,
        data
    })
}

function assignParent(id, data) {
    return axios({
        method: apiPath.speciality.assignParent(id).method,
        url: apiPath.speciality.assignParent(id).url,
        data
    })
}

function assignChild(id, data) {
    return axios({
        method: apiPath.speciality.assignChild(id).method,
        url: apiPath.speciality.assignChild(id).url,
        data
    })
}