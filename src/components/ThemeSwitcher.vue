<template>
  <button
    @click="toggleTheme"
    class="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600"
  >
    {{ isDark ? '🌙 Dark' : '☀️ Light' }}
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
  isDark.value = localStorage.theme === 'dark' || (
    !('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  updateHtmlClass();
});

function toggleTheme() {
  isDark.value = !isDark.value;
  localStorage.theme = isDark.value ? 'dark' : 'light';
  updateHtmlClass();
}

function updateHtmlClass() {
  const html = document.documentElement;
  html.classList.toggle('dark', isDark.value);
}
</script>


<style>
html { transition: background-color .3s, color .3s }
</style>
