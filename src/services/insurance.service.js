import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const insuranceService = {
    fetchInsurances,
    fetchInsuranceServices,
    addNewInsurace,
    fetchAllInsurances,
    updateInsurances,
    deleteInsurance
}

function fetchInsurances(id) {
    return axios({
        method: apiPath.insurance.fetch(id).method,
        url: apiPath.insurance.fetch(id).url,
    })
}
function fetchInsuranceServices(id) {
    return axios({
        method: apiPath.insurance.services(id).method,
        url: apiPath.insurance.services(id).url,
    })
}
function addNewInsurace(insurance) {
    return axios({
        method: apiPath.insurance.addNew.method,
        url: apiPath.insurance.addNew.url,
        data: insurance
    })
}
function fetchAllInsurances() {
    return axios({
        method: apiPath.insurance.fetchAll.method,
        url: apiPath.insurance.fetchAll.url,
    })
}
function updateInsurances(id, data) {
    return axios({
        method: apiPath.insurance.update(id).method,
        url: apiPath.insurance.update(id).url,
        data
    })
}
function deleteInsurance(id) {
    return axios({
        method: apiPath.insurance.delete(id).method,
        url: apiPath.insurance.delete(id).url,
    })
}