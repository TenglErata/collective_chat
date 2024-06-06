<template>
  <div class="search">
    <div class="search-wrap">
      <input v-model="store.searchBar" type="text" placeholder="Search...">
      <i class="ri-search-line" :class="{'i-active': store.searchBar.length != 0}"></i>
    </div>
  </div>
</template>

<script setup>
  import {appStore} from "@/store";
  const store = appStore()
</script>

<style scoped>
  .i-active {
    color: var(--text-primary-color)
  }

  i {
    padding-left: .75rem;

    font-size: 1.125rem;
    color: #696969;
    border-left: 1px solid #696969;
    transition: .4s;
  }

  input {
    width: 100%;

    font-size: 1.125rem;
    color: white;
    border: none;
    outline: none;
    background-color: transparent;
  }

  .search-wrap {
    padding: .5rem .75rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .5rem;

    border: 1px solid var(--text-primary-color);
    border-radius: .5rem;
  }

  .search {
    padding: 1rem;
  }
</style>