import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedPromotionCode: null,
    },
    actions: {
        setSelectedPromotionCode({ commit }, data) {
            commit('SET_SELECTED_PROMOTION_CODE', data)
        },
    },
    mutations: {
        SET_SELECTED_PROMOTION_CODE(state, selectedPromotionCode) {
            Vue.set(state, 'selectedPromotionCode', selectedPromotionCode)
        },
    },
    getters: {
        getSelectedPromotionCode: (state) => state.selectedPromotionCode,
    }
};