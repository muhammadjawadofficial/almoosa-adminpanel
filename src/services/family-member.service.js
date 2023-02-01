import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const familyMemberService = {
    fetchFamilyMembers,
    fetchAllFamilyMembers,
    addFamilyMember
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