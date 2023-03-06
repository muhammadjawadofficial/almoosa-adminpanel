import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const specialityService = {
    updateSpeciality
}

function updateSpeciality(id, data) {
    return axios({
        method: apiPath.speciality.update(id).method,
        url: apiPath.speciality.update(id).url,
        data
    })
}