<template>
  <div class="settings">
    <button :class="{'button-active': value == true}"
        @click="clickButton(key)"
        v-for="(value, key) in store.buttonArray" :key="key">
      <i :class="key"></i>
    </button>
  </div>
</template>

<script setup>
  import { appStore } from "@/store";
  const store = appStore()

  function clickButton(key) {
    store.buttonArray[key] = !store.buttonArray[key]
    if (store.buttonArray[key] == true) {
      store.user.status = key
      store.socket.emit('changeStatus', key)
    } else {
      const entries = Object.entries(store.buttonArray)
      const firstActiveModifier = entries.find(([key, value]) => value == true)
      if (firstActiveModifier != undefined) {
        store.user.status = firstActiveModifier[0]
        store.socket.emit('changeStatus', firstActiveModifier[0])
      } else {
        store.user.status = 'ri-circle-line'
        store.socket.emit('changeStatus', 'ri-circle-line')
      }
    }
  }
</script>

<style scoped>
  i {
    font-size: 1.25rem;
    color: #696969;
    transition: .4s;
  }

  .button-active, .button-active > i {
    border-color: var(--text-primary-color);
    color: var(--text-primary-color)
  }

  button {
    padding: .5rem;

    background-color: transparent;
    border: 1px solid #696969;
    border-radius: .5rem;
    outline: none;
    transition: .4s;
  }

  .settings {
    padding: 1rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: .5rem;

    border-top: 1px solid var(--text-primary-color)
  }
</style>