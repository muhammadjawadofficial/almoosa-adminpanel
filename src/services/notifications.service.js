import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const notificationService = {
    fetchAllNotifications,
    fetchAllUsersNotifications,
    updateNotification,
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
