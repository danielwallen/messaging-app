<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden">
      <FolderList @select-folder="folderId = $event" />
      <div class="flex-1 flex flex-col">
        <div class="p-4 border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"></div>
        <div class="flex-1 flex flex-col relative">
          <MessageList
            :folderId="folderId"
            @select-message="message = $event"
            @new-message="showCompose = true"
            v-show="!message"
            class="h-full"
          />
          <template v-if="message">
            <div :style="{height: listHeight + 'px'}" class="relative">
              <MessageList
                :folderId="folderId"
                @select-message="message = $event"
                @new-message="showCompose = true"
                class="h-full"
              />
              <!-- Splitter -->
              <div
                class="absolute bottom-0 left-0 w-full h-2 cursor-row-resize bg-gray-200 dark:bg-gray-700 z-10"
                @mousedown="startDrag"
              ></div>
            </div>
            <MessagePane
              :message="message"
              :style="{height: 'calc(100% - ' + listHeight + 'px)'}"
              class="border-t dark:border-gray-700"
            />
          </template>
        </div>
        <ComposeMessage
          v-if="showCompose"
          @close="showCompose = false"
          class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
        />
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
      message: null,
      showCompose: false,
      listHeight: 300, // beginhoogte in px
      dragging: false,
      minHeight: 100,
      maxHeight: 600
    }
  },
  methods: {
    startDrag(e) {
      this.dragging = true
      document.body.style.cursor = 'row-resize'
      window.addEventListener('mousemove', this.onDrag)
      window.addEventListener('mouseup', this.stopDrag)
    },
    onDrag(e) {
      if (!this.dragging) return
      const container = this.$el.querySelector('.flex-1.flex.flex-col.relative')
      const rect = container.getBoundingClientRect()
      let newHeight = e.clientY - rect.top
      if (newHeight < this.minHeight) newHeight = this.minHeight
      const minPaneHeight = 100 // minimale hoogte van MessagePane
      if (newHeight > rect.height - minPaneHeight) newHeight = rect.height - minPaneHeight
      this.listHeight = newHeight
    },
    stopDrag() {
      this.dragging = false
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', this.onDrag)
      window.removeEventListener('mouseup', this.stopDrag)
    }
  }
}
</script>