import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const promotionService = {
    fetchPromotions,
    applyPromotions,
    fetchAllPromotions,
    fetchAllPromoGroups,
    createPromotion,
    updatePromotion,
    deletePromotion,
    updatePromoGroupDetails,
    updatePromoGroupUsers,
    createPromoGroup,
    deletePromoGroup
}

function fetchPromotions() {
    return axios({
        method: apiPath.promotions.assigned.method,
        url: apiPath.promotions.assigned.url,
    })
}
function applyPromotions(code) {
    return axios({
        method: apiPath.promotions.apply.method,
        url: apiPath.promotions.apply.url,
        data: {
            "promo_code": code
        }
    })
}
function fetchAllPromotions() {
    return axios({
        method: apiPath.promotions.all.method,
        url: apiPath.promotions.all.url,
    })
}
function createPromotion(data) {
    return axios({
        method: apiPath.promotions.createPromotion.method,
        url: apiPath.promotions.createPromotion.url,
        data
    })
}
function updatePromotion(id, data) {
    return axios({
        method: apiPath.promotions.updatePromotion(id).method,
        url: apiPath.promotions.updatePromotion(id).url,
        data
    })
}
function deletePromotion(id) {
    return axios({
        method: apiPath.promotions.deletePromotion(id).method,
        url: apiPath.promotions.deletePromotion(id).url
    })
}
function fetchAllPromoGroups() {
    return axios({
        method: apiPath.promotions.allPromoGroups.method,
        url: apiPath.promotions.allPromoGroups.url,
    })
}
function createPromoGroup(data) {
    return axios({
        method: apiPath.promotions.createPromoGroups.method,
        url: apiPath.promotions.createPromoGroups.url,
        data
    })
}
function deletePromoGroup(id) {
    return axios({
        method: apiPath.promotions.deletePromoGroups(id).method,
        url: apiPath.promotions.deletePromoGroups(id).url,
    })
}
function updatePromoGroupDetails(id, data) {
    return axios({
        method: apiPath.promotions.updatePromoGroupDetails(id).method,
        url: apiPath.promotions.updatePromoGroupDetails(id).url,
        data
    })
}
function updatePromoGroupUsers(data) {
    return axios({
        method: apiPath.promotions.updatePromoGroupUsers.method,
        url: apiPath.promotions.updatePromoGroupUsers.url,
        data
    })
}