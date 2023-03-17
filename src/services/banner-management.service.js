import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const bannerManagementService = {
    fetchAllBanner,
    createBanner,
    updateBanner,
    deleteBanner
}

function fetchAllBanner(query) {
    return axios({
        method: apiPath.bannerManagement.fetchAll(query || '').method,
        url: apiPath.bannerManagement.fetchAll(query || '').url,
    })
}

function createBanner(data) {
    return axios({
        method: apiPath.bannerManagement.save.method,
        url: apiPath.bannerManagement.save.url,
        data
    })
}

function updateBanner(id, data) {
    return axios({
        method: apiPath.bannerManagement.update(id).method,
        url: apiPath.bannerManagement.update(id).url,
        data
    })
}

function deleteBanner(id) {
    return axios({
        method: apiPath.bannerManagement.delete(id).method,
        url: apiPath.bannerManagement.delete(id).url
    })
}