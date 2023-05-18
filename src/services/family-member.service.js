import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const familyMemberService = {
    fetchFamilyMembers,
    fetchAllFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    updateFamilyMemberStatus,
    deleteFamilyMemberRequest
}

function fetchFamilyMembers(id) {
    return axios({
        method: apiPath.familyMembers.fetch(id).method,
        url: apiPath.familyMembers.fetch(id).url,
    })
}
function fetchAllFamilyMembers(query) {
    return axios({
        method: apiPath.familyMembers.fetchAll(query || '').method,
        url: apiPath.familyMembers.fetchAll(query || '').url,
    })
}
function addFamilyMember(data) {
    return axios({
        method: apiPath.familyMembers.add.method,
        url: apiPath.familyMembers.add.url,
        data
    })
}
function updateFamilyMember(data) {
    return axios({
        method: apiPath.familyMembers.update.method,
        url: apiPath.familyMembers.update.url,
        data
    })
}
function updateFamilyMemberStatus(data) {
    return axios({
        method: apiPath.familyMembers.updateStatus.method,
        url: apiPath.familyMembers.updateStatus.url,
        data
    })
}

function deleteFamilyMemberRequest(id) {
    return axios({
        method: apiPath.familyMembers.delete(id).method,
        url: apiPath.familyMembers.delete(id).url,
    })
}