import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedAppointment: null,
        selectedTeleconsultation: null,
        selectedOnspotConsultation: null
    },
    actions: {
        setSelectedAppointment({ commit }, data) {
            commit('SET_SELECTED_APPOINTMENT', data)
        },
        setSelectedTeleconsultation({ commit }, data) {
            commit('SET_SELECTED_TELECONSULTATION', data)
        },
    },
    mutations: {
        SET_SELECTED_APPOINTMENT(state, selectedAppointment) {
            Vue.set(state, 'selectedAppointment', selectedAppointment)
        },
        SET_SELECTED_TELECONSULTATION(state, selectedTeleconsultation) {
            Vue.set(state, 'selectedTeleconsultation', selectedTeleconsultation)
        },
        SET_SELECTED_ONSPOTCONSULTATION(state, selectedOnspotConsultation) {
            Vue.set(state, 'selectedOnspotConsultation', selectedOnspotConsultation)
        },
    },
    getters: {
        getSelectedAppointment: (state) => state.selectedAppointment,
        getSelectedTeleconsultation: (state) => state.selectedTeleconsultation,
        getOnspotConsultation: (state) => state.selectedOnspotConsultation,
    }
};