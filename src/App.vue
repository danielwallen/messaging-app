<template>
  <div class="h-screen flex flex-col">


    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <FolderList @select-folder="folderId = $event" />

      <!-- Main -->
      <div class="flex-1 flex flex-col">
        <div class="p-4 border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          <ComposeMessage />
        </div>

        <div class="flex-1 flex">
          <MessageList
            class="flex-1 overflow-auto p-4"
            :folderId="folderId"
            @select-message="message = $event"
          />
          <MessagePane
            class="w-1/2 border-l dark:border-gray-700"
            v-if="message"
            :message="message"
          />
        </div>
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
