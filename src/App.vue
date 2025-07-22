<template>
  <div class="h-full flex flex-col">
    <header class="bg-blue-600 text-white p-4 flex justify-between">
      <h1 class="text-2xl font-semibold">📬 Messaging</h1>
      <EnvSwitcher />
    </header>
    <div class="flex flex-1 overflow-hidden">
      <FolderList @select-folder="folderId = $event" />
      <div class="flex-1 flex flex-col p-4">
        <ComposeMessage />
        <MessageList :folderId="folderId" @select-message="message = $event" />
        <MessagePane v-if="message" :message="message" />
      </div>
    </div>
  </div>
</template>

<script>
import FolderList from './components/FolderList.vue'
import MessageList from './components/MessageList.vue'
import MessagePane from './components/MessagePane.vue'
import ComposeMessage from './components/ComposeMessage.vue'
import EnvSwitcher from './components/EnvSwitcher.vue'

export default {
  name: 'App',
  components: { FolderList, MessageList, MessagePane, ComposeMessage, EnvSwitcher },
  data() {
    return {
      folderId: null,
      message: null
    }
  }
}
</script>
