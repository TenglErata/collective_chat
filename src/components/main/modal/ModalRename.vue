<template>
  <input v-model=roomName type="text" placeholder="Enter new room name"
         :class="{'input-active': roomName.length != 0}" ref="Input">
</template>

<script setup>
  import {onMounted, ref, watchEffect} from 'vue'
  const roomName = ref('')
  const Input = ref(null)

  import { appStore } from "@/store";
  const store = appStore()

  onMounted(() => {
    Input.value.focus()
  })

  watchEffect(() => {
    if (roomName.value.length != 0)
      store.isModalReady.hasAllData = true
    else
      store.isModalReady.hasAllData = false
  })

  watchEffect(() => {
    if (store.isModalReady.isConfirm == true) {
      for (const room of store.roomArray) {
        if (roomName.value == room.name) {
          store.isModalReady.currentWarning = 'Room is already exists!'
          roomName.value = ''
          store.isModalReady.isConfirm = null
          return
        }
      }
      store.socket.emit('createRoom', roomName.value)
      store.isModalReady.isConfirm = null
      store.subWindow.type = ''
      store.subWindow.windowName = ''
    }
    if (store.isModalReady.isConfirm == false) {
      store.isModalReady.isConfirm = null
      store.isModalReady.currentWarning = null
      store.subWindow.type = ''
      store.subWindow.windowName = ''
    }
  })
</script>

<style scoped>
.input-active {
  border-color: var(--text-primary-color);
}

input {
  width: 100%;
  padding: 0.125rem .25rem;

  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  background-color: transparent;
  border-bottom: 1px solid #696969;
  transition: .4s;
}
</style>