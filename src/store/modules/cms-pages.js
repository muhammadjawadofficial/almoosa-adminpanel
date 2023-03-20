import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedCmsPage: null,
    },
    actions: {
        setSelectedCmsPage({ commit }, data) {
            commit('SET_SELECTED_CMS_PAGE', data)
        },
    },
    mutations: {
        SET_SELECTED_CMS_PAGE(state, selectedCmsPage) {
            Vue.set(state, 'selectedCmsPage', selectedCmsPage)
        },
    },
    getters: {
        getSelectedCmsPage: (state) => state.selectedCmsPage,
    }
};