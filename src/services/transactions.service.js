import { axios } from "./axios";
import { apiPath } from "../constants/apiPath";

export const transactionsService = {
    fetchTransactionList
}

function fetchTransactionList(query) {
    return axios({
        method: apiPath.transactions.fetchAll(query).method,
        url: apiPath.transactions.fetchAll(query).url
    })
}
