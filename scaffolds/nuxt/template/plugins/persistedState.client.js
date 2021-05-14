/*
 * Naming your plugin 'xxx.client.js' will make it execute only on the client-side.
 * https://nuxtjs.org/guide/plugins/#name-conventional-plugin
 */
import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState()(store)
}
