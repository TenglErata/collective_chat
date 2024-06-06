<template>
  <div class="input">
    <i class="ri-attachment-2 button"
       @click="fileInput.click()">
    </i>
    <input class="input-file" type="file" ref="fileInput"
           @change="changeFile" accept="text/plain,
           image/jpeg,
           image/png,
           application/vnd.openxmlformats-officedocument.wordprocessingml.document,
           application/vnd.openxmlformats-officedocument.presentationml.presentation"
    />
    <div class="input-wrap">
      <div class="input-action"
           v-if="store.selectFile.file != null">
        <i class="ri-file-line"></i>
        <span>File:</span>
        <input ref="actionText"
               disabled
               :placeholder="store.selectFile.file.name"/>
        <i class="ri-close-line action-button"
           @click="rejectAction">
        </i>
      </div>
      <div class="input-action"
           v-if="store.modifyElement.action == 'edit'">
        <i class="ri-edit-fill"></i>
        <span>Edit:</span>
        <input ref="actionText"
               disabled
               :placeholder="store.modifyElement.id.message"/>
        <i class="ri-close-line action-button"
           @click="rejectAction">
        </i>
      </div>
      <div class="input-action"
           v-if="store.modifyElement.action == 'forward' ||
           store.modifyElement.action == 'forward_to'">
        <i class="ri-share-forward-fill"></i>
        <span>Forward:</span>
        <input ref="actionText"
               disabled
               placeholder="Choose chat to forward message"/>
        <i class="ri-close-line action-button"
           @click="rejectAction">
        </i>
      </div>
      <div class="input-action"
           v-if="store.modifyElement.action == 'reply'">
        <i class="ri-reply-fill"></i>
        <span>Reply:</span>
        <input ref="actionText"
               disabled
               :placeholder="store.modifyElement.id.message"/>
        <i class="ri-close-line action-button"
           @click="rejectAction">
        </i>
      </div>
      <textarea rows="1" ref="textarea"
                v-model="message"
                @input="adjustHeight"
                @keydown.ctrl.enter = "clickSend"
                placeholder="Enter message..."/>
    </div>
    <i class="ri-send-plane-2-line button"
       @click="clickSend"></i>
  </div>
</template>

<script setup>
  import {nextTick, ref, watchEffect} from 'vue'
  const textarea = ref(null)
  const message = ref('')
  const actionText = ref(null)
  const fileInput = ref(null)

  import { appStore } from "@/store";
  const store = appStore()

  function changeFile (event) {
    store.selectFile.file = event.target.files[0]
    if (store.selectFile.file != null) store.modifyElement.action = 'file'
    else store.modifyElement.action = null
    event.target.value = ''
  }

  watchEffect(() => {
    if (store.modifyElement.type == 'message' && store.modifyElement.action == 'edit') {
      message.value = store.modifyElement.id.message
      nextTick(() => {
        console.log(actionText.value.offsetWidth, textarea.value.offsetWidth)
        if (actionText.value.offsetWidth >= textarea.value.offsetWidth)
          actionText.value.offsetWidth = `${textarea.value.offsetWidth - 97}px`
        adjustHeight()
      })
    }
  })

  function adjustHeight () {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }

  function rejectAction () {
    store.selectFile.file = null
    store.selectFile.scribe = false
    store.modifyElement.action = null
    store.selectArray = []
    message.value = ''
    nextTick(() => {
      adjustHeight()
    })
  }

  import CryptoJS from 'crypto-js'
  import NCA from '@/crypto'
  function clickSend () {
    if (message.value.length == 0 &&
        store.modifyElement.action != 'forward' &&
        store.modifyElement.action != 'file') return

    if (store.modifyElement.action == 'edit') {
      store.socket.emit('editMessage', store.modifyElement.id.mID, message.value)
      store.modifyElement.action = null
    }
    else if (store.modifyElement.action == 'forward')  {
      store.modifyElement.action = 'forward_to'
      Object.assign(store.modifyElement.id, {additionMessage: message.value})
    }
    else if (store.modifyElement.action == 'reply') {
      Object.assign(store.modifyElement.id, {additionMessage: message.value})
      store.socket.emit('replyMessage', store.modifyElement.id)
      store.modifyElement.action = null
    }
    else if (store.modifyElement.action == 'file') {
      const reader = new FileReader()
      reader.onload = async function (event) {
        // if (store.selectFile.scribe) {
          const openData = {}

          const hash = CryptoJS.SHA256(event.target.result).toString(CryptoJS.enc.Hex)
          openData['hash'] = hash

          const nca = new NCA();
          await nca.generateKeys();
          openData['publicKey'] = nca.publicKey;
          const privateKey = nca.privateKey;

          // console.log('Public Key:', publicKey);
          // console.log('Private Key:', privateKey);

          openData['signature'] = nca.sign(hash, privateKey);
          // console.log('Signature:', signature.toString());

          // const isValid = nca.verify(openData['signature'], openData['publicKey']);
          // console.log("Verified data:", isValid, hash);

          // console.log(openData)
          store.socket.emit('sendFile', store.selectFile.file.name, event.target.result, message.value, openData)
        // } else
        //     store.socket.emit('sendFile', store.selectFile.file.name, event.target.result, message.value, null)

        store.selectFile.file = null
        store.selectFile.scribe = false
        store.modifyElement.action = null
      }
      reader.readAsArrayBuffer(store.selectFile.file)
    }
    else {
      store.socket.emit('sendMessage', message.value)
    }
    message.value = ''
    nextTick(() => {
      adjustHeight()
    })
  }
</script>

<style scoped>
  .scribe-active i {
    color: white !important;
  }

  .scribe-active {
    background-color: red;
    color: white !important;
  }

  .scribe {
    padding: .25rem .5rem .25rem .25rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .25rem;

    border: 1px solid red;
    color: #898989;
    border-radius: .35rem;
    cursor: default;
    user-select: none;
    transition: .2s;

  }

  .input-file {
    display: none;
  }

  .action-button:active {
    color: white;
    background-color: var(--text-primary-color);
  }

  .action-button {
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: .25rem;
    transition: .2s;
  }

  .input-action input::placeholder {
    color: white;
  }

  .input-action input {
    width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.125rem;
    background-color: transparent;
    border: none;
    outline: none;
  }

  .input-action span {
    color: var(--text-primary-color)
  }

  .input-action i {
    color: var(--text-primary-color);
    font-size: 1.25rem;
  }

  .input-action {
    padding: .5rem;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: .5rem;

    font-size: 1.125rem;
    color: white;
    background-color: #303030;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }

  textarea {
    margin: .5rem;
    width: calc(100% - 1rem);
    max-height: 100px;

    font-size: 1.125rem;
    background-color: transparent;
    color: white;
    border: none;
    outline: none;
    resize: none;
  }

  .button:active {
    background-color: #272727;
  }

  .button {
    padding: .5rem;

    font-size: 1.25rem;
    border-radius: .5rem;
    background-color: #303030;
    transition: .4s;
    color: red;
  }

  .input-wrap {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    border-radius: .5rem;
    border: 1px solid red;
  }

  .input {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 1rem;
  }
</style>