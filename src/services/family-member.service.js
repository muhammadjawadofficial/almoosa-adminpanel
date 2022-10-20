import * as axios from "axios";
import { apiPath } from "../constants/apiPath";

export const familyMemberService = {
    fetchFamilyMembers,
    addFamilyMember
}

function fetchFamilyMembers(id) {
    return axios({
        method: apiPath.familyMembers.fetch(id).method,
        url: apiPath.familyMembers.fetch(id).url,
    })
}

function addFamilyMember(data) {
    return axios({
        method: apiPath.familyMembers.add.method,
        url: apiPath.familyMembers.add.url,
        data
    })
}