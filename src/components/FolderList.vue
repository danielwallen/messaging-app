<template>
  <aside class="w-64 bg-white p-4 overflow-auto shadow">
    <h2 class="font-bold mb-2">Folders</h2>
    <div v-if="loading" class="text-blue-600">Loading folders...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-for="f in folders" :key="f.id"
         @click="$emit('select-folder', f.id)"
         class="cursor-pointer hover:bg-blue-100 p-2 rounded">{{f.name||'Folder '+f.id}}</div>
  </aside>
</template>
<script>
import { BASE_URL, getAuthHeaders } from '../config'
export default {
  data(){return{folders:[],loading:false,error:null}},
  async mounted(){ this.loading=true; try{ const res=await fetch(`${BASE_URL}/folders`,{headers:getAuthHeaders()}); if(!res.ok) throw new Error(res.status); this.folders=await res.json()}catch(e){this.error=e.message}finally{this.loading=false}},
}
</script>
