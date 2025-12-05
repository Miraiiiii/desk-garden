<script setup lang="ts">
import { ref, watch } from 'vue'

const content = ref(localStorage.getItem('desk-garden-notepad') || '')

watch(content, (newVal) => {
  localStorage.setItem('desk-garden-notepad', newVal)
})
</script>

<template>
  <div class="flex flex-col w-full h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
      <div class="flex items-center gap-2 text-slate-500">
        <div class="i-lucide-notebook-text text-lg" />
        <span class="text-sm font-medium">记事本</span>
      </div>
    </div>
    <textarea
      v-model="content"
      class="flex-1 w-full resize-none p-4 border-none outline-none bg-transparent text-slate-700 placeholder:text-slate-300 text-sm leading-relaxed scrollbar-thin"
      placeholder="写点什么..."
    />
  </div>
</template>

