<template>
  <div class="list" @click="clickList">
    <ListSearch/>
    <ListList/>
    <ListSettings/>
  </div>
</template>

<script setup>
  import ListSearch from '@/components/main/list/ListSearch'
  import ListList from "@/components/main/list/ListList";
  import ListSettings from "@/components/main/list/ListSettings";

  import { appStore } from "@/store";
  const store = appStore()

  function clickList () {
    if (store.subWindow.type.includes('dialogue'))
      store.subWindow.type = ''
  }
</script>

<style scoped>
  .list {
    width: 15%;
    min-width: 300px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    background-color: #212121;
  }
</style>