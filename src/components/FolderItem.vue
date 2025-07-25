<template>
  <li>
    <div
      :style="{ paddingLeft: (level * 16) + 'px' }"
      @click="$emit('select', folder.id)"
      :class="[
        'flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors',
        isSelected
          ? 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200',
        isDragOver ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900' : ''
      ]"
      draggable="true"
      @dragstart="onDragStart"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 7h18M3 12h18M3 17h18"
        />
      </svg>
      <span
        class="flex-grow truncate"
        :class="folder.unreadCount > 0 ? 'font-semibold' : 'font-normal'"
      >
        {{ folder.name }}
      </span>
      <span
        v-if="folder.unreadCount > 0"
        class="ml-auto bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ folder.unreadCount }}
      </span>
    </div>

    <ul v-if="folder.children && folder.children.length" class="mt-1">
      <FolderItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :level="level + 1"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
        @move-folder="$emit('move-folder', $event)"
        @move-message="$emit('move-message', $event)" 
      />
    </ul>
  </li>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  folder: Object,
  level: Number,
  selectedId: Number
})

const isSelected = computed(() => props.folder.id === props.selectedId)
const emit = defineEmits(['select', 'move-folder', 'move-message'])

const isDragOver = ref(false)

function onDragStart(e) {
  e.dataTransfer.setData('folderId', props.folder.id)
  e.dataTransfer.setData('type', 'folder')
}
function onDragOver(e) {
  isDragOver.value = true
  e.preventDefault()
}
function onDragLeave() {
  isDragOver.value = false
}
function onDrop(e) {
  isDragOver.value = false
  const type = e.dataTransfer.getData('type')
  if (type === 'folder') {
    const draggedId = e.dataTransfer.getData('folderId')
    if (draggedId && draggedId !== props.folder.id) {
      emit('move-folder', { draggedId, targetId: props.folder.id })
    }
  }
  if (type === 'message') {
    const messageIds = JSON.parse(e.dataTransfer.getData('messageIds') || '[]')
    emit('move-message', { messageIds, targetFolderId: props.folder.id })
  }
}
</script>