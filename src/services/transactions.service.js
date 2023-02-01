import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const transactionsService = {
    fetchTransactionList
}

function fetchTransactionList() {
    return axios({
        method: apiPath.transactions.fetchAll.method,
        url: apiPath.transactions.fetchAll.url
    })
}
