<template>
  <header>
    <nav>
      <ul v-if="$store.state.authenticated">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/profile">Profile</NuxtLink></li>
        <li><a class="logout" @click="userLogout">Logout</a></li>
      </ul>
      <ul v-else>
        <li>
          <a class="logout">Magic Nuxt Demo</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  methods: {
    async userLogout() {
      this.$store.dispatch('logout')
    },
  },
}
</script>

<style>
nav {
  max-width: 45rem;
  margin: 0 auto 50px;
  padding: 1.25rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}
ul {
  display: flex;
  list-style: none;
}
li {
  margin-right: 1.5rem;
  line-height: 38px;
}
li:first-child {
  margin-left: auto;
}
a {
  text-decoration: none;
  color: rgba(103, 81, 255, 1);
}
a:hover {
  color: rgba(103, 81, 255, 0.5);
}
.logout {
  color: rgba(191, 144, 69, 1);
  cursor: pointer;
}
.logout:hover {
  color: rgba(191, 144, 69, 0.8);
}
</style>
