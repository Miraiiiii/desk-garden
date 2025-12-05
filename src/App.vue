<script setup lang="ts">
import { ref } from "vue";
import Clock from "./components/Clock.vue";
import Notepad from "./components/Notepad.vue";
import Calculator from "./components/Calculator.vue";

type WidgetType = 'notepad' | 'calculator' | null;

const activeWidget = ref<WidgetType>(null);
const isHovered = ref(false);

const toggleWidget = (type: WidgetType) => {
  if (activeWidget.value === type) {
    activeWidget.value = null;
  } else {
    activeWidget.value = type;
  }
};
</script>

<template>
  <main 
    class="flex flex-col items-center justify-center min-h-screen bg-transparent select-none"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="relative flex flex-col items-center gap-4 w-[360px]">
      
      <!-- Clock Section -->
      <div class="w-full relative z-20">
        <Clock />
      </div>

      <!-- Tools Menu -->
      <div 
        class="absolute top-[130px] z-10 flex items-center gap-3 px-2 py-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg transition-all duration-500 ease-out transform origin-top"
        :class="[
          (isHovered || activeWidget) 
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
            : '-translate-y-8 opacity-0 scale-95 pointer-events-none'
        ]"
      >
        <button 
          class="p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 relative group"
          :class="activeWidget === 'notepad' ? 'bg-blue-100 text-blue-600 shadow-inner' : 'text-slate-500'"
          @click="toggleWidget('notepad')"
        >
          <div class="i-lucide-notebook-text text-xl" />
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            记事本
          </div>
        </button>
        
        <div class="w-px h-6 bg-slate-200" />
        
        <button 
          class="p-3 rounded-xl transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 relative group"
          :class="activeWidget === 'calculator' ? 'bg-orange-100 text-orange-600 shadow-inner' : 'text-slate-500'"
          @click="toggleWidget('calculator')"
        >
          <div class="i-lucide-calculator text-xl" />
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            计算器
          </div>
        </button>
      </div>

      <!-- Active Widget Container -->
      <div 
        class="w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        :class="activeWidget ? 'h-[420px] mt-16 opacity-100 translate-y-0' : 'h-0 mt-0 opacity-0 -translate-y-4'"
      >
        <div class="h-full w-full p-1">
          <Transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            mode="out-in"
          >
            <Notepad v-if="activeWidget === 'notepad'" />
            <Calculator v-else-if="activeWidget === 'calculator'" />
          </Transition>
        </div>
      </div>

    </div>
  </main>
</template>

<style>
:root {
  font-family: 'Inter', sans-serif;
  background-color: transparent;
}

body {
  margin: 0;
  padding: 0;
  background-color: transparent;
  overflow: hidden; 
}

html {
  background: transparent; 
  height: 100vh;
}
</style>
