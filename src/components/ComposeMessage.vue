<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
        aria-label="Sluiten"
      >&times;</button>
      <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Nieuw bericht</h2>
      <form @submit.prevent="send" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aan</label>
          <input
            v-model="to"
            type="text"
            class="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Ontvanger"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Onderwerp</label>
          <input
            v-model="subject"
            type="text"
            class="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Onderwerp"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bericht</label>
          <textarea
            v-model="body"
            rows="6"
            class="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 resize-none"
            placeholder="Typ je bericht..."
            required
          ></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            Annuleren
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Verstuur
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BASE_URL, getAuthHeaders } from '../config'

const emit = defineEmits(['close'])
const to = ref('')
const subject = ref('')
const body = ref('')

async function send() {
  const payload = { to: to.value, subject: subject.value, body: body.value }
  try {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    to.value = subject.value = body.value = ''
    emit('close')
    alert('Message sent!')
  } catch (err) {
    alert(`Failed to send: ${err.message}`)
  }
}
</script>