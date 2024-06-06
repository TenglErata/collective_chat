<template>
  <div class="chat" @click="clickMain">
    <ChatChat/>
    <ChatInput/>
  </div>
</template>

<script setup>
  import { appStore } from "@/store";
  const store = appStore()

  import ChatChat from '@/components/main/chat/ChatChat'
  import ChatInput from "@/components/main/chat/ChatInput";

  function clickMain () {
    if (store.subWindow.type.includes('dialogue'))
      store.subWindow.type = ''
  }
</script>

<style scoped>
  .chat {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /*align-items: stretch;*/

    background-color: #111111;
  }
</style>