import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const symptomChecker = {
  fetchSymptoms,
  fetchSymptomDetails,
  addNewSymptom,
  updateSymptom,
  deleteSymptom,
  fetchAgeConditions,
  addAgeCondition,
  updateAgeCondition,
  deleteAgeCondition,
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
function fetchAgeConditions() {
  return axios({
    method: apiPath.symptomChecker.fetchAgeConditions.method,
    url: apiPath.symptomChecker.fetchAgeConditions.url,
  });
}
function addAgeCondition(data) {
  return axios({
    method: apiPath.symptomChecker.addAgeCondition.method,
    url: apiPath.symptomChecker.addAgeCondition.url,
    data,
  });
}
function updateAgeCondition(id, data) {
  return axios({
    method: apiPath.symptomChecker.updateAgeCondition(id).method,
    url: apiPath.symptomChecker.updateAgeCondition(id).url,
    data,
  });
}
function deleteAgeCondition(id) {
  return axios({
    method: apiPath.symptomChecker.deleteAgeCondition(id).method,
    url: apiPath.symptomChecker.deleteAgeCondition(id).url,
  });
}
