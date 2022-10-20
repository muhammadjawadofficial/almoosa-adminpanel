import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const servicesPackagesService = {
    fetchPackages,
    fetchPackageDetails,
    addNewPackage
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