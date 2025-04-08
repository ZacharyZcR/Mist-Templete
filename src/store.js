// src/store.js
import { createStore } from 'vuex'

export default createStore({
    state: {
        isDarkMode: localStorage.getItem('darkMode') === 'true'
    },
    mutations: {
        toggleDarkMode(state) {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('darkMode', state.isDarkMode);
        }
    },
    actions: {
        toggleDarkMode({ commit }) {
            commit('toggleDarkMode');
        }
    }
})
