<template>
  <div class="bg-gray-50 border-t p-4 h-64 overflow-auto">
    <div v-if="loading" class="text-blue-600">Loading message...</div>
    <div v-else-if="error" class="text-red-600">{{error}}</div>
    <div v-else>
      <h2 class="font-bold text-xl">{{message.subject}}</h2>
      <p class="mt-2 text-gray-700">{{content.body}}</p>
    </div>
  </div>
</template>
<script>
import { BASE_URL, getAuthHeaders } from '../config'
export default {
  props:['message'],
  data(){return{content:{},loading:false,error:null}},
  mounted(){this.load()},
  watch:{message() { this.load() }},
  methods:{
    async load(){
      this.loading=true; this.error=null
      try{
        const res=await fetch(`${BASE_URL}/messages/${this.message.id}`,{headers:getAuthHeaders()})
        if(!res.ok) throw new Error(res.status)
        this.content=await res.json()
      }catch(e){this.error=e.message}finally{this.loading=false}
    }
  }
}
</script>
