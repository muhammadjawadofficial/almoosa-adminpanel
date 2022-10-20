import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedFamilyMember: null,
    },
    actions: {
        setSelectedFamilyMember({ commit }, data) {
            commit('SET_SELECTED_FAMILY_MEMBER', data)
        },
        updateSelectedFamilyMember({ commit }, data) {
            commit('UPDATE_SELECTED_FAMILY_MEMBER', data)
        },
    },
    mutations: {
        SET_SELECTED_FAMILY_MEMBER(state, selectedFamilyMember) {
            Vue.set(state, 'selectedFamilyMember', selectedFamilyMember)
        },
        UPDATE_SELECTED_FAMILY_MEMBER(state, selectedFamilyMember) {
            Vue.set(state, 'selectedFamilyMember', { ...state.selectedFamilyMember, ...selectedFamilyMember });
        },
    },
    getters: {
        getSelectedFamilyMember: (state) => state.selectedFamilyMember,
    }
};