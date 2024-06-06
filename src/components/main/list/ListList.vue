<template>
  <div class="list">
    <div class="list-chat"
         :class="{'list-chat-active': room.active == true}"
         ref="listChat"
         @click="forwardRoom(room.name)"
         @dblclick="changeRoom(room.name)"
         @click.right.prevent="createSubwindowRoom(room.name)"
         v-for="room in cloneRoomArray">
      <span class="chat-title">{{ room.name }}
        <i class="ri-arrow-left-fill"
           v-if="room.active == false && store.modifyElement.action == 'forward_to'">
        </i>
      </span>
      <div class="chat-users" v-if="room.users.length != 0">
        <div class="user-props" v-for="user in room.users">
          <i :class="user.status"></i>
          <div class="username">{{ user.name }}</div>
        </div>
      </div>
    </div>
    <div class="list-whitespace"
         @click.right.prevent="createSubwindowRoom(null)">
    </div>
  </div>
</template>

<script setup>
  import { appStore } from '@/store'
  const store = appStore()

  import {ref, watchEffect} from 'vue'
  const listChat = ref(null)
  const cloneRoomArray = ref(null)

  import lodash from 'lodash'
  watchEffect(() => {
    cloneRoomArray.value = lodash.cloneDeep(store.roomArray);
    if (store.searchBar.length!= 0) {
      cloneRoomArray.value = cloneRoomArray.value.filter(item =>
          item.name.toString().toLowerCase().includes(store.searchBar.toLowerCase())
      );
    }
  });

  function createSubwindowRoom (roomName) {
    if (store.modifyElement.action != null) return

    if (roomName !== null) {
      store.subWindow.type = 'dialogueRoomName'
      store.modifyElement.id = roomName
    } else {
      store.subWindow.type = 'dialogueList'
    }

    store.subWindow.position.x = event.clientX
    store.subWindow.position.y = event.clientY
    store.modifyElement.type = 'room'
  }

  function forwardRoom (roomName) {
    if (store.modifyElement.action !== 'forward_to') return
    changeRoom(roomName)
    if (store.selectArray.length != 0) {
      store.socket.emit('forwardMessageArray', store.selectArray, store.modifyElement.id.room)
      store.selectArray = []
    } else {
      store.socket.emit('forwardMessage', store.modifyElement.id)
    }
    store.modifyElement.action = null
  }

  import clickSound from '@/assets/sound/accept.mp3'
  function changeRoom (roomName) {
    // Изменена текущая комната пользователя
    store.user.room = roomName

    // Сделать комнату активной
    const roomIndex = store.roomArray.findIndex(room => room.name === roomName)
    store.roomArray[roomIndex].active = true
    for (let i = 0; i < store.roomArray.length; i++) {
      if (i != roomIndex) {
        store.roomArray[i].active = false
      }
    }
    // Поменять активную комнату в базе данных
    store.socket.emit('changeRoom', roomName)
    new Audio(clickSound).play()
  }
</script>

<style scoped>
  .ri-arrow-left-fill {
    position: absolute;
    top: 50%;
    left: calc(100% - 20px);
    transform: translateY(-50%);
    color: white !important;
  }

  .username {
    color: white
  }

  i {
    font-size: 1.25rem;
    color: var(--text-primary-color)
  }

  .user-props {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .5rem;
  }

  .chat-users {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: .5rem;
  }

  .chat-title {
    position: relative;

    color: var(--text-primary-color);
    font-size: 1.25rem;
  }

  .list-chat-active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;

    background-color: red;
  }

  .list-chat.list-chat-active::after {
    left: 0px;
    background-color: var(--text-primary-color);
  }

  .list-chat-active {
    background-color: #303030;
  }

  .list-chat::after {
    content: '';
    position: absolute;
    top: 0;
    left: -6px;
    width: 6px;
    height: 100%;

    background-color: transparent;
    transition: .4s;
  }

  .list-chat {
    padding: .75rem 1rem;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: .75rem;

    user-select: none;
    transition: .4s;
  }

  .list-whitespace {
    height: 100%;
  }

  .list {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    overflow-y: auto;
    scrollbar-width: none;
  }
</style>