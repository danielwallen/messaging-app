<template>
  <aside class="w-64 bg-white p-4 overflow-auto shadow">
    <h2 class="font-bold mb-2">Folders</h2>

    <div v-if="loading" class="text-blue-600">Loading folders...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <ul v-else>
      <folder-item
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
import { BASE_URL, getAuthHeaders } from '../config'

export default {
  name: 'FolderList',
  data() {
    return { folders: [], tree: [], loading: false, error: null }
  },
  async mounted() {
    this.loading = true
    try {
      const res = await fetch(`${BASE_URL}/folders`, { headers: getAuthHeaders() })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json = await res.json()
      const folderArray = Object.values(json)

      this.folders = folderArray
      console.log('Generated folders:', this.folders)
      this.tree = buildTree(folderArray)
      console.log('Generated tree:', this.tree)

    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }

    function buildTree(folders) {
      const map = {}
      folders.forEach(f => { map[f.id] = { ...f, children: [] } })
      const roots = []
      folders.forEach(f => {
        if (f.parent == null) {
          roots.push(map[f.id])
        } else if (map[f.parent]) {
          map[f.parent].children.push(map[f.id])
        }
      })
      return roots
    }
  },
  components: {
    FolderItem: {
      props: ['folder', 'level'],
      template: `
        <li>
          <div
            :style="{ paddingLeft: (level * 16) + 'px' }"
            @click="$emit('select', folder.id)"
            class="cursor-pointer hover:bg-blue-100 p-1 rounded"
          >
            {{ folder.name || 'Folder ' + folder.id }}
          </div>
          <ul v-if="folder.children.length > 0">
            <folder-item
              v-for="c in folder.children"
              :key="c.id"
              :folder="c"
              :level="level + 1"
              @select="$emit('select', $event)"
            />
          </ul>
        </li>`
    }
  }
}
</script>
