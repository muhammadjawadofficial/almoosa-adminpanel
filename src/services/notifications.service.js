import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const notificationService = {
    fetchAllNotifications,
    fetchAllUsersNotifications,
    updateNotification,
    sendBroadcastNotification,
    getBroadcastNotifications
}

function fetchAllNotifications(query) {
    return axios({
        method: apiPath.noticationsManagement.fetchAll(query || '').method,
        url: apiPath.noticationsManagement.fetchAll(query || '').url,
    })
}
function fetchAllUsersNotifications(query) {
    return axios({
        method: apiPath.noticationsManagement.fetchAllUsersNotifications(query || '').method,
        url: apiPath.noticationsManagement.fetchAllUsersNotifications(query || '').url,
    })
}

function updateNotification(id, data) {
    return axios({
        method: apiPath.noticationsManagement.update(id).method,
        url: apiPath.noticationsManagement.update(id).url,
        data
    })
}
function sendBroadcastNotification(data) {
    return axios({
        method: apiPath.noticationsManagement.sendBroadcast.method,
        url: apiPath.noticationsManagement.sendBroadcast.url,
        data
    })
}
function getBroadcastNotifications(query) {
    return axios({
        method: apiPath.noticationsManagement.fetchBroadcast(query || "").method,
        url: apiPath.noticationsManagement.fetchBroadcast(query || "").url,
    })
}
