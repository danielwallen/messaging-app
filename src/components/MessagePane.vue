<template>
  <div class="p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-l border-gray-200 dark:border-gray-700 flex flex-col">
    <header class="border-b border-gray-300 dark:border-gray-600 pb-4 mb-4">
      <h2 class="text-xl font-bold">{{ message.subject }}</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        From: <strong>{{ message.sender }}</strong> •
        <span>
          {{
            message.timestamp
              ? (new Date(message.timestamp).toLocaleString())
              : 'No date'
          }}
        </span>
      </p>
    </header>
    <section class="flex-1 overflow-auto prose dark:prose-invert max-w-none">
      <div v-html="message.body"></div>
    </section>
  </div>
</template>
<script setup>
const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>