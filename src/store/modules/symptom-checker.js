import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedSymptom: null,
    },
    actions: {
        setSelectedSymptom({ commit }, data) {
            commit('SET_SELECTED_Symptom', data)
        },
    },
    mutations: {
        SET_SELECTED_Symptom(state, selectedSymptom) {
            Vue.set(state, 'selectedSymptom', selectedSymptom)
        },
    },
    getters: {
        getSelectedSymptom: (state) => state.selectedSymptom,
    }
};