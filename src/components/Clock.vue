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
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
}
</script>

<template>
  <div data-tauri-drag-region class="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 cursor-default hover:shadow-md transition-all duration-300 w-full select-none">
    <div class="text-7xl font-light text-slate-800 tracking-tight tabular-nums pointer-events-none">
      {{ formatTime(time) }}
    </div>
    <div class="mt-3 flex gap-3 text-slate-400 text-sm font-medium tracking-wide pointer-events-none">
      <span>{{ formatDate(time) }}</span>
    </div>
  </div>
</template>

