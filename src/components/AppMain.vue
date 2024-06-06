<template>
  <div class="main">
    <AppModal/>
    <AppDialogue/>
    <MainList/>
    <MainChat/>
  </div>
</template>

<script setup>
  import MainList from '@/components/main/MainList'
  import MainChat from '@/components/main/MainChat'
  import AppDialogue from '@/components/AppDialogue'
  import AppModal from '@/components/AppModal'
</script>

<style scoped>
  .main {
    position: relative;

    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>