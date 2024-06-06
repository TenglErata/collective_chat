<template>
  <div class="chat" ref="chat">
      <div :class="item.user == store.user.name ? 'message-self' : 'message-common'"
           @click.right.prevent="createSubwindowRoom(item)"
           @click="handleSelect(item)"
           v-for="item in store.roomMessages">
        <transition name="fade">
          <i
             :class="isSelected(item)"
             v-if="store.modifyElement.action == 'select'">
          </i>
        </transition>
        <div class="message-body"
             :class="slideMessage(item.user == store.user.name)"
             :style="item.user == store.user.name ? { backgroundColor: 'red' } : {}">
          <span class="username"
                v-if="item.user != store.user.name">
            {{ item.user }}
          </span>
          <div class="forwarded" :class="{'f-self': item.user == store.user.name}"
               v-if="item.forwarded != null && item.file == null">
            <span>Forwarded from: <b>{{JSON.parse(item.forwarded).user}}</b></span>
            <p>{{JSON.parse(item.forwarded).message}}</p>
          </div>
          <div class="forwarded" :class="{'f-self': item.user == store.user.name}"
               v-if="item.replied != null && item.file == null">
            <span>Replied from: <b>{{JSON.parse(item.replied).user}}</b></span>
            <p>{{JSON.parse(item.replied).message}}</p>
          </div>
          <div class="forwarded file" :class="{'f-self': item.user == store.user.name}"
               v-if="item.file != null">
            <i class="ri-download-2-line"
               @click="downloadFile(item)">
            </i>
            <div class="file-text">
              <span class="signature" v-if="checkSignatureItem == item"
                    :style="store.msgSignature.isValid ? {backgroundColor: '#056365'} : { backgroundColor: '#125e04'}">
                {{store.msgSignature.ownerName}} - {{store.msgSignature.isValid ? 'Correct' : 'Corrupted'}}
              </span>
              <span v-if="item.replied != null && item.forwarded == null">
                Replied from: <b>{{JSON.parse(item.replied).user}}</b>
              </span>
              <span v-if="item.replied == null && item.forwarded != null">
                Forwarded from: <b>{{JSON.parse(item.forwarded).user}}</b>
              </span>
              <p>{{ item.file.split('_').slice(2).join('_') }}</p>
            </div>
          </div>
          <p>{{ item.message }}</p>
          <div class="message-info">
            <span class="edited" v-if="item.edited == 1">edited</span>
            <span class="time">{{ getDate(parseInt(item.id)) }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { appStore } from "@/store";
  const store = appStore()

  import { ref } from 'vue'
  const chat = ref(null)
  const checkSignatureItem = ref(null)

  function createSubwindowRoom (item) {
    if (store.modifyElement.action != null) return

    store.modifyElement.type = 'message'
    store.modifyElement.id = {room: store.user.room, mID: item.id, message: item.message, user: item.user, file: item.file}

    if (item.user == store.user.name)
      store.subWindow.type = 'dialogueYourMessage'
    else
      store.subWindow.type = 'dialogueMessage'

    store.subWindow.position.x = event.clientX
    store.subWindow.position.y = event.clientY
  }

  function downloadFile (item) {
    checkSignatureItem.value = item
    store.socket.emit('downloadFile', item.file)
  }

  function handleSelect (item) {

    if (store.modifyElement.action != 'select') return
    const findIndex = store.selectArray.findIndex(element => element == item.id)

    if (findIndex != -1) {
      store.selectArray.splice(findIndex, 1)
      const indexUser = store.warningList.selectOtherMessages.findIndex(element => element == item.user)
      store.warningList.selectOtherMessages.splice(indexUser, 1)
      console.log(store.warningList.selectOtherMessages)
    } else {
      store.selectArray.push(item.id)
      store.warningList.selectOtherMessages.push(item.user)
      console.log(store.warningList.selectOtherMessages)
    }
  }

  function isSelected (item) {
    let isSelf = 'i-common'
    let isSelect = 'ri-checkbox-circle-line'

    if (store.selectArray.includes(item.id))
      isSelect = 'ri-checkbox-circle-fill'

    if (item.user == store.user.name)
      isSelf = 'i-self'

    return `${isSelf} ${isSelect}`
  }

  function getDate (ms) {
    const date = new Date(ms)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const hh = String(hours).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')

    return `${hh}:${mm}`
  }

  function slideMessage (isSelf) {
    if (store.modifyElement.action != 'select') return
    if (isSelf) return 'mb-self'
    else return 'mb-common'
  }

  import { onUpdated } from "vue";
  onUpdated(() => {
    // chat.value.scrollTop = chat.value.scrollHeight
  })
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: .4s;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  .f-self {
    border-left: 4px solid white !important;
    background-color: var(--text-primary-color-active) !important;
  }

  .forwarded {
    padding: .25rem .5rem;
    width: 100%;
    border-left: 4px solid red;
    border-radius: .125rem;
    background-color: #353535;
  }

  .message-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-self: flex-end;

    font-size: .75rem;
    gap: .5rem;
  }

  p {
    width: 100%;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-size: 1.125rem;
  }

  .username {
    color: var(--text-primary-color)
  }

  .mb-self {
    transform: translateX(-2.5rem);
  }

  .mb-common {
    transform: translateX(2.5rem);
  }

  .message-body {
    padding: .5rem .75rem;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: .5rem;

    background-color: #212121;
    border-radius: .5rem;
    color: white;
    cursor: default;
    transition: transform .4s;
  }

  .i-self {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(-100%, -50%);
  }

  .i-common {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  i {
    font-size: 1.5rem;
    color: white;
  }

  .message-self {
    position: relative;
    max-width: 80%;

    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
    align-self: flex-end;
    gap: 1rem;
  }

  .message-common {
    position: relative;
    max-width: 80%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
  }

  .chat {
    /*padding: 1rem 3.75rem;*/
    padding: 1rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: .5rem;

    overflow-y: auto;
    scroll-behavior: smooth;
  }

  .file {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .5rem;
  }

  .file i {
    padding: .25rem;
    /*border: 2px solid white;*/
    /*border-radius: .5rem;*/
  }

  .forwarded-file-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .file-text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: .15rem;
  }

  .signature {
    padding: .15rem .25rem;
    border-radius: .5rem;
    background-color: #125e04;
    color: white;
  }
</style>