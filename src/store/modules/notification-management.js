import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedNotification: null,
    },
    actions: {
        setSelectedNotification({ commit }, data) {
            commit('SET_SELECTED_Notification', data)
        },
    },
    mutations: {
        SET_SELECTED_Notification(state, selectedNotification) {
            Vue.set(state, 'selectedNotification', selectedNotification)
        },
    },
    getters: {
        getSelectedNotification: (state) => state.selectedNotification,
    }
};