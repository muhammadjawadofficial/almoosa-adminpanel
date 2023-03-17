import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedBanner: null,
    },
    actions: {
        setSelectedBanner({ commit }, data) {
            commit('SET_SELECTED_BANNER', data)
        },
    },
    mutations: {
        SET_SELECTED_BANNER(state, selectedBanner) {
            Vue.set(state, 'selectedBanner', selectedBanner)
        },
    },
    getters: {
        getSelectedBanner: (state) => state.selectedBanner,
    }
};