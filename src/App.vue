<template>
  <router-view @click="initializeAudio"/>
</template>

<script setup>
  import { onMounted } from "vue";
  import backgroundMusic from "@/assets/sound/background.wav";
  import { appStore } from "@/store";
  import Cookies from "js-cookie";
  import { io } from "socket.io-client";

  const store = appStore();

  const initializeAudio = () => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.volume = 1.0;
    audio.play().catch((error) => {
      console.error("Error attempting to play audio:", error);
    });
  };

  onMounted(() => {
    store.socket = io("http://localhost:5000");
    store.socketListeners();

    const token = Cookies.get("auth_token");
    if (token) {
      store.socket.emit("tokenAuth", token);
    }

    // Добавляем обработчик события клика для запуска аудио
    document.addEventListener("click", () => {
      initializeAudio();
    }, { once: true }); // Обработчик будет вызван только один раз
  });
</script>

<style>
  @font-face {
    font-family: 'Shentox';
    src: url("@/assets/Shentox.ttf") format('truetype');
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Shentox', sans-serif;
  }

  ::-webkit-scrollbar {
    width: 16px;
  }

  ::-webkit-scrollbar-thumb {
    width: 8px;
    background-color: red;
    border: 6px solid #101010;
    border-radius: .5rem;
  }

  ::-webkit-scrollbar-track {
    background: #101010;
  }

  audio {
    display: none;
  }
</style>