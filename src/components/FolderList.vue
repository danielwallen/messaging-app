<template>
  <aside class="w-64 bg-white p-4 overflow-auto shadow">
    <FolderItem />
    <h2 class="font-bold mb-2">Folders</h2>
    <div v-if="loading" class="text-blue-600">Loading folders...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <ul v-else>
      <FolderItem
        v-for="f in tree"
        :key="f.id"
        :folder="f"
        :level="0"
        @select="$emit('select-folder', $event)"
      />
    </ul>
  </aside>
</template>

<script>
import FolderItem from './FolderItem.vue'
import { BASE_URL, getAuthHeaders } from '../config'

 

export default {
  components: { FolderItem },
  data() {
    return {
      folders: [],
      tree: [],
      loading: false,
      error: null
    }
  },
  async mounted() {
    this.loading = true
    try {
      console.log('Folders API response object')
      const res = await fetch(`${BASE_URL}/folders`, { headers: getAuthHeaders() })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const folderArray = Object.values(json)
      this.tree = buildTree(folderArray)
    } catch (err) {
      console.error('Error building tree:', err)
      this.error = err.message
    } finally {
      this.loading = false
    }
  }
}

// Helper for building a nested folder tree
function buildTree(folders) {
  const map = {}
  folders.forEach(f => { map[f.id] = { ...f, children: [] } })

  const roots = []
  folders.forEach(f => {
    if (f.parent === null) {
      roots.push(map[f.id])
    } else if (map[f.parent]) {
      map[f.parent].children.push(map[f.id])
    }
  })

  return roots
}
</script>