<script setup lang="ts">
import { ref } from 'vue'

const display = ref('0')
const previousValue = ref<string | null>(null)
const operator = ref<string | null>(null)
const newNumber = ref(true)

const appendNumber = (num: string) => {
  if (display.value === '0' || newNumber.value) {
    display.value = num
    newNumber.value = false
  } else {
    display.value += num
  }
}

const appendDot = () => {
  if (newNumber.value) {
    display.value = '0.'
    newNumber.value = false
  } else if (!display.value.includes('.')) {
    display.value += '.'
  }
}

const clear = () => {
  display.value = '0'
  previousValue.value = null
  operator.value = null
  newNumber.value = true
}

const backspace = () => {
  if (newNumber.value) return; // 如果刚计算完，不让删除
  if (display.value.length === 1) {
    display.value = '0';
  } else {
    display.value = display.value.slice(0, -1);
  }
}

const setOperator = (op: string) => {
  if (operator.value && !newNumber.value && previousValue.value) {
    calculate()
  }
  operator.value = op
  previousValue.value = display.value
  newNumber.value = true
}

const calculate = () => {
  if (!operator.value || !previousValue.value) return

  const prev = parseFloat(previousValue.value)
  const current = parseFloat(display.value)
  let result = 0

  switch (operator.value) {
    case '+':
      result = prev + current
      break
    case '-':
      result = prev - current
      break
    case '*':
      result = prev * current
      break
    case '/':
      result = prev / current
      break
  }

  display.value = result.toString()
  previousValue.value = null
  operator.value = null
  newNumber.value = true
}

defineProps<{
  isDark?: boolean
}>()
</script>

<template>
  <div 
    class="flex flex-col w-full h-full rounded-2xl shadow-sm border overflow-hidden p-3 select-none transition-colors duration-300"
    :class="isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'"
  >
    <!-- Display -->
    <div 
      class="flex flex-col items-end justify-end h-20 shrink-0 mb-3 px-4 rounded-xl border transition-colors duration-300"
      :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'"
    >
      <!-- History/Operator Display -->
      <div 
        class="h-6 text-sm font-medium transition-colors duration-300 flex items-center"
        :class="isDark ? 'text-slate-500' : 'text-slate-400'"
      >
        <span v-if="previousValue && operator">
          {{ previousValue }} {{ operator }}
        </span>
      </div>
      
      <!-- Main Display -->
      <span 
        class="text-3xl font-light tabular-nums tracking-tight truncate w-full text-right transition-colors duration-300"
        :class="isDark ? 'text-slate-200' : 'text-slate-800'"
      >
        {{ display }}
      </span>
    </div>

    <!-- Keypad -->
    <div class="grid grid-cols-4 gap-2 flex-1 min-h-0">
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 border"
        :class="isDark 
          ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
          : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'"
        @click="clear"
      >
        AC
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 border"
        :class="isDark 
          ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
          : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'"
        @click="backspace"
      >
        <div class="i-lucide-delete" />
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 border"
        :class="[
          isDark 
            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100',
          operator === '/' ? (isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800') : ''
        ]"
        @click="() => setOperator('/')"
      >
        <div class="i-lucide-divide" />
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 border"
        :class="[
          isDark 
            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100',
          operator === '*' ? (isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800') : ''
        ]"
        @click="() => setOperator('*')"
      >
        <div class="i-lucide-x" />
      </button>
      <button v-for="n in ['7', '8', '9']" :key="n"
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 border shadow-sm"
        :class="isDark 
          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
          : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-100'"
        @click="() => appendNumber(n)"
      >
        {{ n }}
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 border"
        :class="[
          isDark 
            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100',
          operator === '-' ? (isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800') : ''
        ]"
        @click="() => setOperator('-')"
      >
        <div class="i-lucide-minus" />
      </button>

      <button v-for="n in ['4', '5', '6']" :key="n"
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 border shadow-sm"
        :class="isDark 
          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
          : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-100'"
        @click="() => appendNumber(n)"
      >
        {{ n }}
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 border"
        :class="[
          isDark 
            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100',
          operator === '+' ? (isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800') : ''
        ]"
        @click="() => setOperator('+')"
      >
        <div class="i-lucide-plus" />
      </button>

      <button v-for="n in ['1', '2', '3']" :key="n"
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 border shadow-sm"
        :class="isDark 
          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
          : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-100'"
        @click="() => appendNumber(n)"
      >
        {{ n }}
      </button>
      
      <!-- Equal button spanning 2 rows height -->
      <button
        class="row-span-2 btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 shadow-md"
        :class="isDark 
          ? 'bg-orange-500 text-white shadow-orange-900/50 hover:bg-orange-600' 
          : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'"
        @click="calculate"
      >
        <div class="i-lucide-equal" />
      </button>

      <button
        class="col-span-2 btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 border shadow-sm"
        :class="isDark 
          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
          : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-100'"
        @click="() => appendNumber('0')"
      >
        0
      </button>
      <button
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 border shadow-sm"
        :class="isDark 
          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
          : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-100'"
        @click="appendDot"
      >
        .
      </button>
    </div>
  </div>
</template>

