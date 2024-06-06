<template>
  <div class="select">
    <div class="select-button" v-show="isDelete(item)"
         @click="clickAction(item.name)"
         :style="item.name == 'Cancel' ? { color: 'red'} : {}"
         v-for="item in store.selectButtons">
      <i :class="item.icon"></i>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
  import {appStore} from "@/store";
  const store = appStore()

  function clickAction (itemName) {
    if (itemName == 'Cancel') {
      store.modifyElement.action = null
      store.selectArray = []
    }
    if (itemName == 'Delete') {
      console.log(store.roomMessages)
      store.socket.emit('deleteMessageArray', store.selectArray)
      store.modifyElement.action = null
      store.selectArray = []
    }
    if (itemName == 'Forward') {
      store.modifyElement.action = 'forward_to'
    }
    store.warningList.selectOtherMessages = []
  }

  function isDelete (item) {
    if (item.name != 'Delete') return true
    if (store.warningList.selectOtherMessages.some(element => element != store.user.name)) return false
    return true
  }
</script>

<style scoped>
  .select-button:hover {
    background-color: #303030;
  }

  .select-button {
    padding: .2rem .5rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: center;
    gap: .25rem;

    border-radius: .5rem;
    transition: .4s;
  }

  .select {
    position: relative;
    padding: .25rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .25rem;

    border: 1px solid red;
    border-radius: .5rem;
    color: white;
    font-size: 1.25rem;
    cursor: default;
  }
</style>