<template>
  <div class="flex-1 p-4 overflow-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <div class="mb-4 flex items-center gap-2">
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
        @click="$emit('new-message')"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        New message
      </button>
      <button
        @click="deleteSelected"
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
        :style="{ visibility: selectedMessages.length ? 'visible' : 'hidden' }"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Verwijder geselecteerde
      </button>
      <button
        @click="noSelected"
        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
        :style="{ visibility: selectedMessages.length ? 'visible' : 'hidden' }"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Selectie opheffen
      </button>
      <button
        @click="allSelected"
        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
        :style="{ visibility: selectedMessages.length ? 'visible' : 'hidden' }"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Alles selecteren
      </button>
      <span v-if="selectedMessages.length" class="text-sm text-gray-500">{{ selectedMessages.length }} geselecteerd</span>
    </div>
    <div v-if="loading" class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
      <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      Loading...
    </div>
    <div v-else-if="error" class="text-red-600 dark:text-red-400">
      {{ error }}
    </div>
    <div v-if="!loading && messages.length === 0" class="text-gray-500 dark:text-gray-400 italic">
      No messages
    </div>
    <div
      v-for="m in messages"
      :key="m.id"
      @click="$emit('select-message', m)"
      draggable="true"
      @dragstart="onMessageDragStart(m, $event)"
      class="flex items-start gap-4 bg-white dark:bg-gray-700 p-4 shadow rounded mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition"
    >
      <input
        type="checkbox"
        class="mt-2 h-5 w-5 accent-blue-500 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
        :checked="selectedMessages.includes(m.id)"
        @click.stop="toggleSelect(m.id)"
      />
      <div class="flex-none bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
        <img
          :src="m.avatarUrl
            || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.sender || 'U')}`"
          alt="avatar"
          class="h-10 w-10 rounded-full object-cover"
          v-if="m.sender"
        />
        <div v-else class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
          U
        </div>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ m.sender }}</div>
            <h3 :class="m.isRead ? 'font-normal' : 'font-bold text-blue-600 dark:text-blue-300'">
              {{ m.subject }}
            </h3>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400" :class="m.isRead ? 'font-normal' : 'font-bold'">
            {{
              m.date
                ? (new Date(m.date).toLocaleString())
                : 'No date'
            }}
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ m.preview }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_URL, getAuthHeaders } from '../config'

export default {
  props: ['folderId'],
  data() {
    return {
      messages: [],
      loading: false,
      error: null,
      selectedMessages: []
    }
  },
  watch: {
    folderId: 'load'
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = null
      this.messages = []
      this.selectedMessages = []
      try {
        let url = `${BASE_URL}/messages`
        if (this.folderId) url += `?folderId=${this.folderId}`
        const res = await fetch(url, { headers: getAuthHeaders() })
        if (!res.ok) throw new Error(res.status)
        this.messages = await res.json()
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    toggleSelect(id) {
      if (this.selectedMessages.includes(id)) {
        this.selectedMessages = this.selectedMessages.filter(mid => mid !== id)
      } else {
        this.selectedMessages.push(id)
      }
    },
    deleteSelected() {
      // Voor productie: stuur een DELETE request naar je backend voor alle geselecteerde ids
      this.messages = this.messages.filter(m => !this.selectedMessages.includes(m.id))
      this.selectedMessages = []
    },
    noSelected() {
      // Voor productie: stuur een DELETE request naar je backend voor alle geselecteerde ids
     
      this.selectedMessages = []
    },
    allSelected() {
      // Voor productie: stuur een DELETE request naar je backend voor alle geselecteerde ids
     
      this.selectedMessages = this.messages.map(m => m.id)
    },
onMessageDragStart(m, event) {
  let ids = this.selectedMessages.length > 0 && this.selectedMessages.includes(m.id)
    ? this.selectedMessages
    : [m.id]
  event.dataTransfer.setData('messageIds', JSON.stringify(ids))
  event.dataTransfer.setData('type', 'message')

  // Custom drag image voor meerdere berichten
  if (ids.length > 1) {
    const dragIcon = document.createElement('div')
    dragIcon.style.position = 'absolute'
    dragIcon.style.top = '-9999px'
    dragIcon.style.left = '-9999px'
    dragIcon.style.padding = '8px 16px'
    dragIcon.style.background = '#2563eb'
    dragIcon.style.color = 'white'
    dragIcon.style.borderRadius = '8px'
    dragIcon.style.fontSize = '16px'
    dragIcon.style.fontWeight = 'bold'
    dragIcon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
    dragIcon.style.display = 'flex'
    dragIcon.style.alignItems = 'center'
    dragIcon.style.gap = '8px'

    // SVG DOM node
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("width", "20")
    svg.setAttribute("height", "20")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("fill", "none")
    svg.setAttribute("stroke", "white")
    svg.setAttribute("stroke-width", "2")
    svg.setAttribute("class", "mr-2")
    const path = document.createElementNS(svgNS, "path")
    path.setAttribute("stroke-linecap", "round")
    path.setAttribute("stroke-linejoin", "round")
    path.setAttribute("d", "M3 7h18M3 12h18M3 17h18")
    svg.appendChild(path)
    dragIcon.appendChild(svg)

    // Tekst
    const text = document.createElement('span')
    text.textContent = `${ids.length} berichten`
    dragIcon.appendChild(text)

    document.body.appendChild(dragIcon)
    event.dataTransfer.setDragImage(dragIcon, dragIcon.offsetWidth / 2, dragIcon.offsetHeight / 2)
    setTimeout(() => document.body.removeChild(dragIcon), 0)
  }
}
  }
}
</script>