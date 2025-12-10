<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { currentMonitor } from '@tauri-apps/api/window';
import Clock from "./components/Clock.vue";
import Notepad from "./components/Notepad.vue";
import Calculator from "./components/Calculator.vue";

type WidgetType = 'notepad' | 'calculator' | null;

const activeWidget = ref<WidgetType>(null);
const isHovered = ref(false);
const isPinned = ref(false);
const isDarkMode = ref(false);
const isWidgetAnimating = ref(false);
let hoverTimeout: number | null = null;

const updateWindowSize = async () => {
  const scale = window.currentScale || 1.0;
  
  const width = BASE_WIDTH * scale;
  let height = BASE_HEIGHT * scale; // Default full size

  // If widget is closing (animating out), keep full height to prevent clipping
  if (isWidgetAnimating.value) {
     return; // Do not resize during animation
  }

  if (!activeWidget.value && !isHovered.value) {
    // Only Clock visible
    height = 180 * scale; // Approximate Clock height + padding
  } else if (!activeWidget.value && isHovered.value) {
    // Clock + Tools visible
    height = 280 * scale; 
  }

  await getCurrentWindow().setSize(new LogicalSize(width, height));
};

const handleMouseEnter = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  isHovered.value = true;
  updateWindowSize();
};

const handleMouseLeave = () => {
  hoverTimeout = window.setTimeout(() => {
    isHovered.value = false
    setTimeout(() => {
      updateWindowSize()
    }, 500)
  }, 300);
};

const toggleWidget = (type: WidgetType) => {
  if (activeWidget.value === type) {
    // Closing widget: set flag and clear active widget to trigger transition
    isWidgetAnimating.value = true;
    activeWidget.value = null;
    // Window resize will happen in onAfterLeave
  } else {
    // Opening widget: resize first, then show
    activeWidget.value = type;
    updateWindowSize();
  }
};

const onWidgetHidden = () => {
  isWidgetAnimating.value = false;
  updateWindowSize();
};

const togglePin = async () => {
  isPinned.value = !isPinned.value;
  await getCurrentWindow().setAlwaysOnTop(isPinned.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const BASE_WIDTH = 400;
const BASE_HEIGHT = 650;

onMounted(async () => {
  try {
    const monitor = await currentMonitor();
    
    // Default to 1.0 scale
    let safeScale = 1.0;

    if (monitor) {
      const screenHeight = monitor.size.height / monitor.scaleFactor;
      
      // Only scale down if the screen is too small for the app
      if (screenHeight < BASE_HEIGHT + 100) {
         const targetHeight = screenHeight - 100;
         safeScale = Math.min(targetHeight / BASE_HEIGHT, 1.0);
      }
    }
      
    const newWidth = BASE_WIDTH * safeScale;
    const newHeight = BASE_HEIGHT * safeScale;

    // Store scale globally for resize logic
    window.currentScale = safeScale;

    await getCurrentWindow().setSize(new LogicalSize(newWidth, newHeight));
    
    if (safeScale !== 1.0) {
       (document.body.style as any).zoom = safeScale;
    }
    
    // Initial resize based on state
    updateWindowSize();

  } catch (e) {
    console.error('Failed to resize window:', e);
    // Fallback on error
    window.currentScale = 1.0;
    updateWindowSize();
  }
});
</script>

<template>
  <main 
    class="h-screen w-screen overflow-hidden flex flex-col items-center p-3 gap-3 select-none transition-colors duration-300"
    :class="isDarkMode ? 'dark' : ''"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    data-tauri-drag-region
  >
    <!-- Clock Section -->
    <div class="w-full shrink-0 relative z-20 pointer-events-none group/clock">
      <div 
        class="pointer-events-auto relative" 
        data-tauri-drag-region
        @mouseenter="handleMouseEnter"
      >
        <Clock :is-dark="isDarkMode" />
        
        <!-- Hover Controls (Pin & Dark Mode) -->
        <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover/clock:opacity-100 transition-opacity duration-300">
           <button 
             @click.stop="togglePin"
             class="p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm border"
             :class="[
               isPinned 
                 ? 'bg-teal-500/90 text-white border-teal-500/50' 
                 : isDarkMode 
                   ? 'bg-slate-800/50 text-slate-400 hover:text-white border-slate-700/50 hover:bg-slate-700/80' 
                   : 'bg-white/50 text-slate-400 hover:text-slate-600 border-white/40 hover:bg-white/80'
             ]"
             title="固定在最前"
           >
             <div class="i-lucide-pin text-xs" :class="{ 'rotate-45': isPinned }" />
           </button>
           
           <button 
             @click.stop="toggleDarkMode"
             class="p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm border"
             :class="[
               isDarkMode 
                 ? 'bg-amber-500/20 text-amber-400 border-amber-500/20 hover:bg-amber-500/30' 
                 : 'bg-slate-800/10 text-slate-500 border-slate-800/10 hover:bg-slate-800/20 hover:text-slate-700'
             ]"
             title="切换模式"
           >
             <div class="text-xs" :class="isDarkMode ? 'i-lucide-sun' : 'i-lucide-moon'" />
           </button>
        </div>
      </div>
    </div>

    <!-- Tools Menu -->
    <div 
      class="shrink-0 z-10 flex items-center gap-3 px-2 py-2 backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-500 ease-out pointer-events-auto"
      :class="[
        (isHovered || activeWidget) 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-4 pointer-events-none',
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-white/20'
      ]"
      @mouseenter="handleMouseEnter"
    >
      <button 
        class="p-3 rounded-xl transition-all duration-300 relative group cursor-pointer"
        :class="[
          activeWidget === 'notepad' 
            ? (isDarkMode ? 'bg-teal-500/20 text-teal-400 shadow-inner' : 'bg-teal-100 text-teal-600 shadow-inner')
            : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-teal-400' : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600')
        ]"
        @click.stop="toggleWidget('notepad')"
      >
        <div class="i-lucide-notebook-text text-xl" />
        <div 
          class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50"
          :class="isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-white'"
        >
          记事本
        </div>
      </button>
      
      <div class="w-px h-6" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-200'" />
      
      <button 
        class="p-3 rounded-xl transition-all duration-300 relative group cursor-pointer"
        :class="[
          activeWidget === 'calculator' 
            ? (isDarkMode ? 'bg-orange-500/20 text-orange-400 shadow-inner' : 'bg-orange-100 text-orange-600 shadow-inner')
            : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-orange-400' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600')
        ]"
        @click.stop="toggleWidget('calculator')"
      >
        <div class="i-lucide-calculator text-xl" />
        <div 
          class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50"
          :class="isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-white'"
        >
          计算器
        </div>
      </button>
    </div>

    <!-- Active Widget Container -->
    <div 
      class="w-full flex-1 min-h-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col"
      :class="(activeWidget || isWidgetAnimating) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'"
    >
      <div class="h-full w-full relative">
        <Transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
          mode="out-in"
          @after-leave="onWidgetHidden"
        >
          <div v-if="activeWidget === 'notepad'" class="h-full w-full">
             <Notepad :is-dark="isDarkMode" />
          </div>
          <div v-else-if="activeWidget === 'calculator'" class="h-full w-full">
             <Calculator :is-dark="isDarkMode" />
          </div>
        </Transition>
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
}

/* Ensure mouse events pass through empty space */
main {
  /* Default: don't capture mouse events on the background */
  pointer-events: none; 
}

/* Enable pointer events for actual content */
main > * {
  pointer-events: auto;
}

/* Specifically fix the drag region data attribute behavior if needed, 
   but usually data-tauri-drag-region handles itself. 
   However, since we set main to pointer-events: none, we need to re-enable it 
   for the drag behavior if we want drag on empty space?
   
   Actually, the user requested: "In transparent parts (when widgets closed), clicks should pass through".
   So pointer-events: none on main is correct.
   
   But user also wants to DRAG the window.
   If pointer-events is none, drag won't work on empty space.
   
   Solution:
   We make the Clock section the main handle for dragging (it's always visible).
   The empty space below should indeed pass through.
*/

[data-tauri-drag-region] {
  /* We allow clicking on the drag region ONLY if it has a background or we want it to capture.
     But user wants pass-through on empty space.
     So we can't have a full-screen drag region that blocks clicks.
     
     We will rely on the user dragging the Clock or the small gaps between widgets.
     BUT, if they want to drag the "empty space", that contradicts "pass through".
     You can't have both "click through to desktop" AND "click to drag app" on the exact same pixel.
     
     I will assume "pass through" is more important for the empty space when widgets are closed.
     Dragging can still be done via the Clock area or the gaps between active elements if we carefully style them.
  */
  cursor: default; 
}
</style>

