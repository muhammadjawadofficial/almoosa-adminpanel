import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedSpecialitiesManagement: null,
    },
    actions: {
        setSelectedSpecialitiesManagement({ commit }, data) {
            commit('SET_SELECTED_SPECIALITIES_MANAGEMENT', data)
        },
    },
    mutations: {
        SET_SELECTED_SPECIALITIES_MANAGEMENT(state, selectedSpecialitiesManagement) {
            Vue.set(state, 'selectedSpecialitiesManagement', selectedSpecialitiesManagement)
        },
    },
    getters: {
        getSelectedSpecialitiesManagement: (state) => state.selectedSpecialitiesManagement,
    }
};