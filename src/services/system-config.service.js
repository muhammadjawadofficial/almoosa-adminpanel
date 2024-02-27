import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const systemConfigService = {
    fetchConfig,
    updateConfig
};

function fetchConfig(query) {
    return axios({
        method: apiPath.systemConfig.fetchSystemConfig(query).method,
        url: apiPath.systemConfig.fetchSystemConfig(query).url
    })
}

function updateConfig(id, data) {
    return axios({
        method: apiPath.systemConfig.updateSystemConfig(id).method,
        url: apiPath.systemConfig.updateSystemConfig(id).url,
        data
    })
}
