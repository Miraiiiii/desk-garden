<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Note {
  id: string
  content: string
  createdAt: number
}

const notes = ref<Note[]>([])
const showAddModal = ref(false)
const newNoteContent = ref('')

// Load notes
onMounted(() => {
  const saved = localStorage.getItem('desk-garden-notes')
  if (saved) {
    try {
      notes.value = JSON.parse(saved)
    } catch (e) {
      notes.value = []
    }
  }
})

// Save notes
watch(notes, (newVal) => {
  localStorage.setItem('desk-garden-notes', JSON.stringify(newVal))
}, { deep: true })

const addNote = () => {
  if (!newNoteContent.value.trim()) return
  
  notes.value.unshift({
    id: Date.now().toString(),
    content: newNoteContent.value,
    createdAt: Date.now()
  })
  
  newNoteContent.value = ''
  showAddModal.value = false
}

const deleteNote = (id: string) => {
  notes.value = notes.value.filter(n => n.id !== id)
}

defineProps<{
  isDark?: boolean
}>()
</script>

<template>
  <div 
    class="flex flex-col w-full h-full rounded-2xl shadow-sm border overflow-hidden relative transition-colors duration-300"
    :class="isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'"
  >
    <!-- Header -->
    <div 
      class="flex items-center justify-between px-6 py-4 border-b transition-colors duration-300"
      :class="isDark ? 'border-slate-800' : 'border-slate-50'"
    >
      <div class="flex items-center gap-2">
        <div class="w-1 h-4 bg-teal-500 rounded-full" />
        <span 
          class="text-base font-medium transition-colors duration-300"
          :class="isDark ? 'text-slate-200' : 'text-slate-700'"
        >我的便签</span>
      </div>
      <span 
        class="px-2 py-0.5 text-xs font-medium rounded-full transition-colors duration-300"
        :class="isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600'"
      >
        {{ notes.length }} 条
      </span>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
      <!-- Empty State -->
      <div v-if="notes.length === 0" class="h-full flex flex-col items-center justify-center gap-4 pb-10">
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300"
          :class="isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'"
        >
          <div class="i-lucide-plus text-3xl" />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span 
            class="text-sm transition-colors duration-300"
            :class="isDark ? 'text-slate-500' : 'text-slate-400'"
          >还没有便签哦</span>
          <span 
            class="text-xs transition-colors duration-300"
            :class="isDark ? 'text-slate-600' : 'text-slate-300'"
          >点击右下角按钮新建</span>
        </div>
      </div>

      <!-- Notes Grid -->
      <div v-else class="grid gap-3">
        <div 
          v-for="note in notes" 
          :key="note.id"
          class="group relative p-3 rounded-xl transition-colors text-sm break-words leading-relaxed"
          :class="isDark 
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
            : 'bg-slate-50 hover:bg-slate-100 text-slate-600'"
        >
          {{ note.content }}
          <button 
            @click="deleteNote(note.id)"
            class="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all rounded"
            :class="isDark 
              ? 'bg-slate-700/80 text-slate-500' 
              : 'bg-slate-100/80 text-slate-400'"
          >
            <div class="i-lucide-trash-2 text-xs" />
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button 
      @click="showAddModal = true"
      class="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:bg-teal-600 hover:scale-105 active:scale-95 transition-all duration-300 z-10"
    >
      <div class="i-lucide-plus text-2xl" />
    </button>

    <!-- Add Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showAddModal" class="absolute inset-2 backdrop-blur-sm rounded-xl z-20 flex items-center justify-center p-4" :class="isDark ? 'bg-slate-900/80' : 'bg-white/80'">
        <div 
          class="w-full rounded-2xl shadow-xl border p-4 flex flex-col gap-3 transition-colors duration-300"
          :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-teal-100'"
        >
          <div class="flex items-center justify-between" :class="isDark ? 'text-slate-400' : 'text-slate-600'">
            <span class="text-sm font-medium">新建便签</span>
            <button @click="showAddModal = false" class="hover:text-slate-800 dark:hover:text-slate-200">
              <div class="i-lucide-x text-sm" />
            </button>
          </div>
          
          <div class="relative">
            <textarea
              v-model="newNoteContent"
              class="w-full h-32 p-3 rounded-xl border outline-none resize-none text-sm transition-all"
              :class="isDark 
                ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50' 
                : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20'"
              placeholder="记录此处的想法... (Ctrl+Enter 保存 / Esc 取消)"
              @keydown.ctrl.enter="addNote"
              @keydown.esc="showAddModal = false"
              autoFocus
            />
          </div>

          <div class="flex justify-end">
            <button 
              @click="addNote"
              class="px-4 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
              :class="isDark 
                ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30' 
                : 'bg-teal-100/50 text-teal-600 hover:bg-teal-100'"
            >
              <div class="i-lucide-send text-xs" />
              保存
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
