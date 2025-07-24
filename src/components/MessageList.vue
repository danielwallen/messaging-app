<template>
  <div class="flex-1 p-4 overflow-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <div v-if="loading" class="text-blue-600 dark:text-blue-400">
      Loading messages...
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
      class="flex items-start gap-4 bg-white dark:bg-gray-700 p-4 shadow rounded mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition"
    >
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
          <h3 :class="m.unread ? 'font-bold' : 'font-normal'">{{ m.subject }}</h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">
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
      error: null
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
    }
  }
}
</script>
