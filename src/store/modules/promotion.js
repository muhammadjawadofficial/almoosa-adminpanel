import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedPromotion: null,
        selectedPromotionGroup: null,
        promotionsList: null,
    },
    actions: {
        setSelectedPromotion({ commit }, data) {
            commit('SET_SELECTED_PROMOTION', data)
        },
        setSelectedPromotionGroup({ commit }, data) {
            commit('SET_SELECTED_PROMOTION_GROUP', data)
        },
        setPromotionsList({ commit }, data) {
            commit('SET_PROMOTIONS_LIST', data)
        },
    },
    mutations: {
        SET_SELECTED_PROMOTION(state, selectedPromotion) {
            Vue.set(state, 'selectedPromotion', selectedPromotion)
        },
        SET_SELECTED_PROMOTION_GROUP(state, selectedPromotionGroup) {
            Vue.set(state, 'selectedPromotionGroup', null)
            Vue.set(state, 'selectedPromotionGroup', selectedPromotionGroup)
        },
        SET_PROMOTIONS_LIST(state, promotionsList) {
            Vue.set(state, 'promotionsList', promotionsList)
        },
    },
    getters: {
        getSelectedPromotion: (state) => state.selectedPromotion,
        getSelectedPromotionGroup: (state) => state.selectedPromotionGroup,
        getPromotionsList: (state) => state.promotionsList,
    }
};