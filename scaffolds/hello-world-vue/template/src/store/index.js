import Vue from 'vue'
import Vuex from 'vuex'
import { Magic } from 'magic-sdk'

Vue.use(Vuex)

const m = new Magic(process.env.VUE_APP_MAGIC_KEY)

export default new Vuex.Store({
	state: {
		user: null,
	},
	mutations: {
		SET_USER_DATA(state, userData) {
			state.user = userData
			localStorage.setItem('user', JSON.stringify(userData))
		},
		CLEAR_USER_DATA() {
			localStorage.removeItem('user')
			location.reload()
		},
	},
	actions: {
		async login({ commit }, email) {
			await m.auth.loginWithMagicLink(email)
			const data = await m.user.getMetadata()
			commit('SET_USER_DATA', data)
		},
		async logout({ commit }) {
			await m.user.logout()
			commit('CLEAR_USER_DATA')
		},
	},
	modules: {},
})
