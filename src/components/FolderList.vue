<template>
  <aside class="w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 overflow-auto shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold text-lg">Folders</h2>
      <ThemeSwitcher />
    </div>
    <div v-if="loading" class="text-blue-600 dark:text-blue-400">
      Loading folders...
    </div>
    <div v-else-if="error" class="text-red-600 dark:text-red-400">
      {{ error }}
    </div>
    <ul v-else class="space-y-1">
      <FolderItem
        v-for="f in tree"
        :key="f.id"
        :folder="f"
        :level="0"
        :selected-id="selectedFolder"
        @select="selectFolder"
      />
    </ul>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FolderItem from './FolderItem.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import { BASE_URL, getAuthHeaders } from '../config'

const emit = defineEmits(['select-folder'])
const selectedFolder = ref(null)
const loading = ref(false)
const error = ref(null)
const tree = ref([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch(`${BASE_URL}/folders`, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const arr = Object.values(data)
    tree.value = buildTree(arr)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

function selectFolder(id) {
  selectedFolder.value = id
  emit('select-folder', id)
}

function buildTree(folders) {
  const map = {}
  folders.forEach(f => { map[f.id] = { ...f, children: [] } })
  const roots = []
  folders.forEach(f => {
    if (f.parent === null) roots.push(map[f.id])
    else if (map[f.parent]) map[f.parent].children.push(map[f.id])
  })
  return roots
}
</script>
