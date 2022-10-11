import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedAppointment: null,
    },
    actions: {
        setSelectedAppointment({ commit }, data) {
            commit('SET_SELECTED_APPOINTMENT', data)
        },
    },
    mutations: {
        SET_SELECTED_APPOINTMENT(state, selectedAppointment) {
            Vue.set(state, 'selectedAppointment', selectedAppointment)
        },
    },
    getters: {
        getSelectedAppointment: (state) => state.selectedAppointment,
    }
};