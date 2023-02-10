import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const rolesPermissionsService = {
    fetchRolesList,
    fetchPermissionsList,
    fetchRoleDetails,
    updateRolePermissions
}

function fetchRolesList() {
    return axios({
        method: apiPath.rolesPermissions.fetchRoles.method,
        url: apiPath.rolesPermissions.fetchRoles.url
    })
}

function fetchPermissionsList() {
    return axios({
        method: apiPath.rolesPermissions.fetchPermissions.method,
        url: apiPath.rolesPermissions.fetchPermissions.url
    })
}

function fetchRoleDetails(id) {
    return axios({
        method: apiPath.rolesPermissions.fetchRoleDetails(id).method,
        url: apiPath.rolesPermissions.fetchRoleDetails(id).url
    })
}

function updateRolePermissions(id, permissions) {
    return axios({
        method: apiPath.rolesPermissions.updateRoleDetails(id).method,
        url: apiPath.rolesPermissions.updateRoleDetails(id).url,
        data: {
            permissions
        }
    })
}
