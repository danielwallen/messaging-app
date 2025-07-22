<template>
  <div class="flex-1 p-4 overflow-auto">
    <div v-if="loading" class="text-blue-600">Loading messages...</div>
    <div v-else-if="error" class="text-red-600">{{error}}</div>
    <div v-for="m in messages" :key="m.id"
         @click="$emit('select-message', m)"
         class="bg-white p-4 shadow rounded mb-2 cursor-pointer hover:bg-gray-50">
      <h3 class="font-bold">{{m.subject}}</h3>
      <p class="text-sm text-gray-500">{{m.preview}}</p>
    </div>
  </div>
</template>
<script>
import { BASE_URL, getAuthHeaders } from '../config'
export default {
  props:['folderId'],
  data(){return{messages:[],loading:false,error:null}},
  watch:{folderId:'load'},
  mounted(){this.load()},
  methods:{
    async load(){
      this.loading=true; this.error=null
      try{
        let url=`${BASE_URL}/messages`
        if(this.folderId) url+=`?folderId=${this.folderId}`
console.log('Fetching messages from:', url);
        const res=await fetch(url,{headers:getAuthHeaders()})
        if(!res.ok) throw new Error(res.status)
        this.messages=await res.json()
      }catch(e){this.error=e.message}finally{this.loading=false}
    }
  }
}
</script>
