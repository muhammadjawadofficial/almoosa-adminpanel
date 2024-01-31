import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const symptomChecker = {
  fetchSymptoms,
  fetchSymptomDetails,
  addNewSymptom,
  updateSymptom,
  deleteSymptom,
};

function fetchSymptoms() {
  return axios({
    method: apiPath.symptomChecker.fetch.method,
    url: apiPath.symptomChecker.fetch.url,
  });
}
function fetchSymptomDetails(id) {
  return axios({
    method: apiPath.symptomChecker.details(id).method,
    url: apiPath.symptomChecker.details(id).url,
  });
}
function addNewSymptom(data) {
  return axios({
    method: apiPath.symptomChecker.add.method,
    url: apiPath.symptomChecker.add.url,
    data,
  });
}
function updateSymptom(id, data) {
  return axios({
    method: apiPath.symptomChecker.update(id).method,
    url: apiPath.symptomChecker.update(id).url,
    data,
  });
}
function deleteSymptom(id) {
  return axios({
    method: apiPath.symptomChecker.delete(id).method,
    url: apiPath.symptomChecker.delete(id).url,
  });
}
