import Vue from "vue";

export default {
    namespaced: true,
    state: {
        selectedFamilyMember: null,
        selectedFamilyMemberRequest: null,
    },
    actions: {
        setSelectedFamilyMember({ commit }, data) {
            commit('SET_SELECTED_FAMILY_MEMBER', data)
        },
        setSelectedFamilyMemberRequest({ commit }, data) {
            commit('SET_SELECTED_FAMILY_MEMBER_REQUEST', data)
        },
        updateSelectedFamilyMember({ commit }, data) {
            commit('UPDATE_SELECTED_FAMILY_MEMBER', data)
        },
    },
    mutations: {
        SET_SELECTED_FAMILY_MEMBER(state, selectedFamilyMember) {
            Vue.set(state, 'selectedFamilyMember', selectedFamilyMember)
        },
        SET_SELECTED_FAMILY_MEMBER_REQUEST(state, selectedFamilyMemberRequest) {
            Vue.set(state, 'selectedFamilyMemberRequest', selectedFamilyMemberRequest)
        },
        UPDATE_SELECTED_FAMILY_MEMBER(state, selectedFamilyMember) {
            Vue.set(state, 'selectedFamilyMember', { ...state.selectedFamilyMember, ...selectedFamilyMember });
        },
    },
    getters: {
        getSelectedFamilyMember: (state) => state.selectedFamilyMember,
        getSelectedFamilyMemberRequest: (state) => state.selectedFamilyMemberRequest,
    }
};