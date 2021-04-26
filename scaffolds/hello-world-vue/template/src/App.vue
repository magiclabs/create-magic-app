<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link>
			<router-link v-if="this.$store.state.user" to="/profile"
				>Profile</router-link
			>
			<router-link v-if="!this.$store.state.user" to="/login"
				>Login</router-link
			>
			<button v-else type="button" class="button" @click="logout">
				Logout
			</button>
		</div>
		<router-view />
	</div>
</template>
<script>
export default {
	methods: {
		logout() {
			this.$store.dispatch('logout')
		},
	},
}
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	padding: 5px;
	text-decoration: none;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

#nav > button {
	padding: 0.6rem 1rem;
	cursor: pointer;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 50px;
	width: 5rem;
	outline: none;
	transition: 0.3s;
	margin: 0 auto;
	font-size: 14px;
	font-weight: bold;
}

#nav > button:hover {
	background-color: #42b983;
	color: white;
}
</style>
