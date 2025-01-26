import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: null,
    token: null,
    cards: [],
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
  },
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setToken(state, token) {
        state.token = token;
    },
  },
  actions: {
    loadAuthData({ commit }) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
          commit("setToken", token);
          commit("setUserId", userId);
      }
    },
    logout({ commit }) {
        commit("setToken", null);
        commit("setUserId", null);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    },
  },
  modules: {
  }
})
