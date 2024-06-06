<template>
  <div class="modal" v-if="store.subWindow.type.includes('modal')"
       @keydown.enter="handleResult(true)">
    <span class="modal-header">
      {{ store.subWindow.windowName }}
    </span>
    <div class="modal-wrap">
      <ModalRoom v-if="store.subWindow.windowName == 'Create room' || store.subWindow.windowName == 'Rename room'"/>
    </div>
    <div class="controls">
      <button class="cancel"
              @click="handleResult(false)">
        Cancel
      </button>
      <button class="confirm"
              :class="{'confirm-active': store.isModalReady.isAllData}"
              :disabled="!store.isModalReady.isAllData"
              @click="handleResult(true)">
        Confirm
      </button>
    </div>
    <div class="warning" v-if="store.isModalReady.currentWarning != null">
      <span class="warning-text">{{ store.isModalReady.currentWarning }}</span>
    </div>
  </div>
</template>

<script setup>
  import ModalRoom from '@/components/main/modal/ModalRoom'
  import ModalRename from "@/components/main/modal/ModalRename";

  import { appStore } from "@/store";
  import {watchEffect} from "vue";
  const store = appStore()

  function handleResult (result) {
    store.isModalReady.isConfirm = result
  }
</script>

<style scoped>
  .warning-text {
    padding: 1rem;

    color: var(--text-primary-color-active);
    border: 1px solid var(--text-primary-color-active);
    border-radius: .5rem;
  }

  .warning {
    width: 100%;
    padding: .5rem 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
  }

  .cancel:hover {
    border-color: #a9a9a9;
    color: #a9a9a9;
  }

  .confirm-active:active {
    background-color: var(--text-primary-color-active);
  }

  .confirm-active {
    background-color: var(--text-primary-color);
    color: var(--text-secondary-color) !important;
    border-color: var(--text-secondary-color);
  }

  .confirm {
    color: var(--text-primary-color);
    border-color: var(--text-primary-color);

  }

  button {
    padding: .25rem .75rem;

    background-color: transparent;
    border: 1px solid #696969;
    border-radius: .25rem;
    color: #696969;
    font-size: 1rem;
    transition: .4s;
  }

  .controls {
    padding: .25rem .5rem .5rem .5rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: .5rem;

  }

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

  .modal-wrap {
    padding: .5rem;
  }

  .modal-header {
    padding: .25rem .5rem;

    background-color: #303030;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    color: var(--text-secondary-color);
    font-size: 1.125rem;
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    user-select: none;
    background-color: #212121;
    border: 1px solid #696969;
    border-radius: .5rem;
    z-index: 1;
  }
</style>