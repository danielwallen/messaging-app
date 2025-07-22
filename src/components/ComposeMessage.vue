<template>
  <div class="p-4 bg-white shadow rounded mb-4">
    <h2 class="font-bold text-lg mb-2">Compose</h2>
    <form @submit.prevent="send">
      <input v-model="to" placeholder="To" class="w-full mb-2 p-2 border rounded" required />
      <input v-model="subject" placeholder="Subject" class="w-full mb-2 p-2 border rounded" required />
      <textarea v-model="body" placeholder="Body" class="w-full mb-2 p-2 border rounded" rows="4" required></textarea>
      <div class="flex justify-end items-center">
        <span v-if="loading" class="mr-2 text-blue-600">Sending...</span>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                :disabled="loading">
          Send
        </button>
      </div>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-600 mt-2">Message sent!</p>
    </form>
  </div>
</template>

<script>
import { BASE_URL, getAuthHeaders } from '../config'

export default {
  name: 'ComposeMessage',
  data() {
    return {
      to: '',
      subject: '',
      body: '',
      loading: false,
      error: null,
      success: false
    }
  },
  methods: {
    async send() {
      this.loading = true
      this.error = null
      this.success = false
      try {
        const res = await fetch(`${BASE_URL}/messages`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            to: this.to,
            subject: this.subject,
            body: this.body
          })
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }
        this.success = true
        this.to = this.subject = this.body = ''
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>