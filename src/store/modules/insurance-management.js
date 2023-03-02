import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedInsuranceManagement: null,
    },
    actions: {
        setSelectedInsuranceManagement({ commit }, data) {
            commit('SET_SELECTED_INSURANCE_MANAGEMENT', data)
        },
    },
    mutations: {
        SET_SELECTED_INSURANCE_MANAGEMENT(state, selectedInsuranceManagement) {
            Vue.set(state, 'selectedInsuranceManagement', selectedInsuranceManagement)
        },
    },
    getters: {
        getSelectedInsuranceManagement: (state) => state.selectedInsuranceManagement,
    }
};