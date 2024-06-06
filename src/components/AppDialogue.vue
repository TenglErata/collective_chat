<template>
  <div class="dialogue" v-if="store.subWindow.type.includes('dialogue')" ref="dialogue"
       :style="{
          'top': `${position.y}px`,
          'left': `${position.x}px`
       }">
    <div class="item" v-for="item in store.subWindowType[store.subWindow.type.toString()]"
         @click="clickAction(item.name)">
      <i :class="item.icon"></i>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
  import { appStore } from "@/store";
  const store = appStore()

  import {nextTick, ref, watchEffect, reactive, onMounted, onUpdated} from 'vue'
  const dialogue = ref(null)
  const position = reactive({
    x: '0',
    y: '0'
  })

  watchEffect(() => {
    if (store.subWindow.position.y > window.innerHeight / 2) {
      nextTick(() => {
        position.y = store.subWindow.position.y - dialogue.value.offsetHeight
      })
    } else position.y = store.subWindow.position.y


    if (store.subWindow.position.x > window.innerWidth / 2) {
      nextTick(() => {
        position.x = store.subWindow.position.x - dialogue.value.offsetWidth
      })
    } else position.x = store.subWindow.position.x
  })


  import error from '@/assets/sound/error.mp3'
  function clickAction (itemName) {
    if (store.modifyElement.type == 'room')
      if (itemName == 'Delete')
        store.socket.emit('deleteRoom', store.modifyElement.id)
      if (itemName == 'Create') {
        store.subWindow.type = 'modal'
        store.subWindow.windowName = 'Create room'
        return
      }
      if (itemName == 'Rename') {
        store.subWindow.type = 'modal'
        store.subWindow.windowName = 'Rename room'
        return
      }

    if (store.modifyElement.type == 'message')
      if (itemName == 'Forward')
        store.modifyElement.action = 'forward'
      if (itemName == 'Reply')
        store.modifyElement.action = 'reply'
      if (itemName == 'Delete')
        store.socket.emit('deleteMessage', store.modifyElement.id.mID)
      if (itemName == 'Edit')
        store.modifyElement.action = 'edit'
      if (itemName == 'Select')
        store.modifyElement.action = 'select'
    store.subWindow.type = ''
  }
</script>

<style scoped>
  span {
    color: white
  }

  i {
    color: red;
  }

  .item:hover {
    background-color: #303030;
  }

  .item {
    padding: .25rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .25rem;

    border-radius: .25rem;
    transition: .4s;
    cursor: default;
    user-select: none;
  }

  .dialogue {
    padding: .25rem;

    position: absolute;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    border: 1px solid red;
    border-radius: .25rem;
    background-color: #212121;
    z-index: 1;
  }
</style>