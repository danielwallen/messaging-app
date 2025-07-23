<template>
  <div class="mb-4">
    <button
      @click="show = !show"
      class="mb-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
    >
      {{ show ? 'Close' : '✉️ New Message' }}
    </button>

    <div
      v-if="show"
      class="p-4 rounded shadow border border-gray-300 dark:border-gray-600"
      :class="['bg-white text-black', 'dark:bg-gray-800 dark:text-white']"
    >
      <h2 class="text-lg font-bold mb-2">Compose New Message</h2>
      <form @submit.prevent="send">
        <input
          v-model="to"
          type="text"
          placeholder="To"
          class="w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <input
          v-model="subject"
          type="text"
          placeholder="Subject"
          class="w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          v-model="body"
          placeholder="Message..."
          class="w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        ></textarea>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { BASE_URL, getAuthHeaders } from '../config';

const to = ref('');
const subject = ref('');
const body = ref('');
const show = ref(false);

async function send() {
  const payload = { to: to.value, subject: subject.value, body: body.value };
  try {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    to.value = subject.value = body.value = '';
    show.value = false;
    alert('Message sent!');
  } catch (err) {
    alert(`Failed to send: ${err.message}`);
  }
}
</script>
