<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref(new Date())
const timer = ref<number | null>(null)

const updateTime = () => {
  time.value = new Date()
}

onMounted(() => {
  timer.value = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
}

defineProps<{
  isDark?: boolean
}>()
</script>

<template>
  <div 
    data-tauri-drag-region 
    class="flex flex-col items-center justify-center p-6 rounded-3xl shadow-sm border cursor-default hover:shadow-md transition-all duration-300 w-full select-none"
    :class="[
      isDark 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-slate-100'
    ]"
  >
    <div 
      class="text-6xl font-light tracking-tight tabular-nums pointer-events-none transition-colors duration-300"
      :class="isDark ? 'text-slate-100' : 'text-slate-800'"
    >
      {{ formatTime(time) }}
    </div>
    <div 
      class="mt-3 flex gap-3 text-sm font-medium tracking-wide pointer-events-none transition-colors duration-300"
      :class="isDark ? 'text-slate-500' : 'text-slate-400'"
    >
      <span>{{ formatDate(time) }}</span>
    </div>
  </div>
</template>

