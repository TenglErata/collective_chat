<template>
  <div class="login" @keydown.ctrl.enter.prevent="signIn">
    <div class="login-wrap">
      <span class="title">collective</span>
      <span class="subtitle">your blessing of life</span>
      <img src="@/assets/login/logo.png" alt="">
      <form>
        <div class="input-wrap" :class="{'iw-active': username.length != 0}" >
          <i class="ri-user-3-line" :class="{'i-active': username.length != 0}"></i>
          <input v-model="username" type="text" placeholder="Username"
                 ref="usernameInput"
                 @keydown.enter="$refs.passwordInput.focus()">
        </div>
        <div class="input-wrap" :class="{'iw-active': password.length != 0}">
          <i class="ri-lock-2-line" :class="{'i-active': password.length != 0}"></i>
          <input v-model="password" type="password" placeholder="Password"
                 ref="passwordInput"
                 @keydown.enter="$refs.usernameInput.focus()">
        </div>
      </form>
      <button :class="{'button-active': username.length != 0 && password.length != 0}" :disabled="!username || !password"
              @click="signIn">
        sign in
      </button>
    </div>
  </div>
</template>

<script setup>
  import {onMounted, ref} from 'vue'
  const username = ref('')
  const password = ref('')

  import { useRouter } from 'vue-router'
  const router = useRouter()

  import { appStore } from "@/store";
  import CryptoJS from "crypto-js";
  const store = appStore()

  function signIn () {
    // store.createConnection({username: username.value, password: password.value})
    store.socket.emit('requestAuth', {
      username: username.value,
      password: CryptoJS.SHA256(password.value).toString(CryptoJS.enc.Hex),
    })
  }
</script>

<style scoped>
  .button-active:active {
    background-color: var(--text-primary-color-active);
    border-color: var(--text-primary-color-active);
  }

  .button-active {
    background-color: var(--text-primary-color);
    color: var(--text-secondary-color);
  }

  button {
    width: 100%;
    padding: 1rem;
    margin-top: 2rem;

    color: var(--text-primary-color);
    font-size: 1.25rem;
    text-transform: uppercase;
    border: 1px solid var(--text-primary-color);
    outline: none;
    background-color: transparent;
    transition: .4s;
  }

  .i-active {
    color: var(--text-primary-color)
  }

  i {
    font-size: 1.125rem;
    color: gray;
    transition: .4s;
  }

  input {
    font-size: 1.25rem;
    border: none;
    outline: none;
    background-color: transparent;

    color: white;
  }

  .input-wrap.iw-active::after {
    width: 100%;
  }

  .input-wrap::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 0%;
    height: 1px;

    border: none;
    background-color: red;
    transition: .4s;
  }

  .input-wrap {
    padding: .25rem;
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .25rem;

    border-bottom: 1px solid gray;
  }

  form {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;
  }

  img {
    margin: 1rem;
  }

  .subtitle {
    color: var(--text-secondary-color);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 5px;
  }

  .title {
    color: var(--text-primary-color);
    font-size: 3rem;
    text-transform: uppercase;
    letter-spacing: 5px;
  }

  .login-wrap {
    padding: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .login {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: black;
  }
</style>