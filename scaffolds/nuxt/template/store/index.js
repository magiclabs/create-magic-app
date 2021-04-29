import { magic } from '../plugins/magic'

export const state = () => ({
  user: null,
  authenticated: false,
})

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.user = userData
    state.authenticated = true
  },
  CLEAR_USER_DATA(state) {
    state.user = null
    state.authenticated = false
    this.$router.push('/login')
  },
}

export const actions = {
  async login({ commit }, email) {
    await magic.auth.loginWithMagicLink(email)
    const userData = await magic.user.getMetadata()
    commit('SET_USER_DATA', userData)
  },
  async logout({ commit }) {
    await magic.user.logout()
    commit('CLEAR_USER_DATA')
  },
}
