<template>
  <div class="chat-input">
    <transition name="fade" mode="out-in">
      <InputSelect v-if="store.modifyElement.action == 'select' || store.selectArray.length != 0"/>
      <InputInput v-else/>
    </transition>
  </div>
</template>

<script setup>
  import InputInput from './input/InputInput'
  import InputSelect from './input/InputSelect'

  import {appStore} from "@/store";
  const store = appStore()
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: all 0.2s ease;
  }

  .fade-enter-from {
    transform: translateX(-10px);
    opacity: 0;
  }

  .fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  .chat-input {
    padding: 1rem 1.5rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
  }
</style>