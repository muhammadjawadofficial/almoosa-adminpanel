import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const promotionCodeService = {
    getAllpromotions,
    createPromotions,
    updatePromotions,
    deletePromotions,
}

function getAllpromotions() {
    return axios({
        method: apiPath.promotions.fetchAllPromotions.method,
        url: apiPath.promotions.fetchAllPromotions.url,
    })
}
function createPromotions(data) {
    return axios({
        method: apiPath.promotions.createPromotions.method,
        url: apiPath.promotions.createPromotions.url,
        data
    })
}
function updatePromotions(id, data) {
    return axios({
        method: apiPath.promotions.updatePromotions(id).method,
        url: apiPath.promotions.updatePromotions(id).url,
        data
    })
}
function deletePromotions(id) {
    return axios({
        method: apiPath.promotions.deletePromotions(id).method,
        url: apiPath.promotions.deletePromotions(id).url
    })
}