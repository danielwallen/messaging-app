<template>
  <li>
    <div
      :style="{ paddingLeft: (level * 16) + 'px' }"
      @click="$emit('select', folder.id)"
      class="cursor-pointer hover:bg-blue-100 p-1 rounded"
    >
      {{ folder.name }}
      <span v-if="folder.unreadCount > 0" class="text-sm text-gray-500">
        ({{ folder.unreadCount }})
      </span>
    </div>
    <ul v-if="folder.children && folder.children.length">
      <FolderItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :level="level + 1"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'FolderItem',
  props: {
    folder: { type: Object, required: true },
    level: { type: Number, required: true }
  },
  emits: ['select'],
  components: {
    FolderItem: () => import('./FolderItem.vue')
  }
}
</script>