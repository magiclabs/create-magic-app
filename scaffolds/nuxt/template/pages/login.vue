<template>
  <div class="container">
    <div class="login">
      <form @submit.prevent="userLogin">
        <h3 class="form-header">Login</h3>
        <div class="input-wrapper">
          <input
            v-model="email"
            class="input-email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="btn-wrapper">
          <button type="submit" class="btn-submit">Send Magic Link</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    }
  },
  mounted() {
    // If the user is authenticated, redirect to profile page.
    if (this.$store.state.authenticated) {
      this.$router.push('/profile')
    }
  },
  methods: {
    async userLogin() {
      this.$store
        .dispatch('login', {
          email: this.email,
        })
        .then(() => {
          this.$router.push('/profile')
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style>
.login {
  max-width: 20rem;
  margin: 40px auto 0;
  padding: 1rem;
  border: 1px solid #dfe1e5;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0px 0px 6px 6px #f7f7f7;
  box-sizing: border-box;
}
form,
label {
  display: flex;
  flex-flow: column;
  text-align: center;
}
.form-header {
  font-size: 22px;
  margin: 25px 0;
  font-weight: 500;
}
.input-wrapper {
  width: 80%;
  margin: 0 auto 20px;
}
.input-email {
  padding: 7px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  font-size: 16px;
  font-weight: 400;
}
.input-email:focus,
.input-email:hover {
  border: 1px solid #6851ff;
}
.btn-wrapper {
  margin: 0px auto 25px;
}
.btn-submit {
  padding: 6px 24px;
  border: 1px solid transparent;
  border-radius: 2147483647px;
  background-color: rgba(103, 81, 255, 1);
  color: #fff;
  cursor: pointer;
  outline: none;
  font-size: 16px;
  font-weight: 400;
}
</style>
