<template>
  <div>Env:
    <select v-model="env" @change="reload" class="text-xs ml-1 border rounded px-1">
      <option value="development">Dev</option>
      <option value="testing">Test</option>
      <option value="acceptance">Acc</option>
      <option value="production">Prod</option>
    </select>
  </div>
</template>
<script>
export default {
  data(){return{env:import.meta.env.MODE}},
  methods:{reload(){location.reload()}}
}
</script>
