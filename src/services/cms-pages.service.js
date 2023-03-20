import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const cmsPagesService = {
    fetchCmsPages,
    fetchCmsPagesDetails,
    addCmsPage,
    updateCmsPage,
    deleteCmsPage
}

function fetchCmsPages() {
    return axios({
        method: apiPath.cmsPages.fetch.method,
        url: apiPath.cmsPages.fetch.url,
    })
}
function fetchCmsPagesDetails(id) {
    return axios({
        method: apiPath.cmsPages.details(id).method,
        url: apiPath.cmsPages.details(id).url,
    })
}
function addCmsPage(data) {
    return axios({
        method: apiPath.cmsPages.save.method,
        url: apiPath.cmsPages.save.url,
        data
    })
}
function updateCmsPage(id, data) {
    return axios({
        method: apiPath.cmsPages.update(id).method,
        url: apiPath.cmsPages.update(id).url,
        data
    })
}
function deleteCmsPage(id) {
    return axios({
        method: apiPath.cmsPages.delete(id).method,
        url: apiPath.cmsPages.delete(id).url
    })
}