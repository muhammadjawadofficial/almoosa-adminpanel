import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const servicesPackagesService = {
    fetchPackages,
    fetchPackageDetails,
    addNewPackage,
    updatePackage,
    deletePackage
}

function fetchPackages() {
    return axios({
        method: apiPath.servicesPackages.fetch.method,
        url: apiPath.servicesPackages.fetch.url,
    })
}
function fetchPackageDetails(id) {
    return axios({
        method: apiPath.servicesPackages.details(id).method,
        url: apiPath.servicesPackages.details(id).url,
    })
}
function addNewPackage(data) {
    return axios({
        method: apiPath.servicesPackages.add.method,
        url: apiPath.servicesPackages.add.url,
        data
    })
}
function updatePackage(id, data) {
    return axios({
        method: apiPath.servicesPackages.update(id).method,
        url: apiPath.servicesPackages.update(id).url,
        data
    })
}
function deletePackage(id) {
    return axios({
        method: apiPath.servicesPackages.delete(id).method,
        url: apiPath.servicesPackages.delete(id).url,
    })
}