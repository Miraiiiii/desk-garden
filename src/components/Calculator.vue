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
</script>

<template>
  <div class="flex flex-col w-full h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-4 select-none">
    <!-- Display -->
    <div class="flex items-end justify-end h-24 mb-4 px-4 bg-slate-50 rounded-xl border border-slate-100">
      <span class="text-4xl font-light text-slate-800 tabular-nums tracking-tight truncate">{{ display }}</span>
    </div>

    <!-- Keypad -->
    <div class="grid grid-cols-4 gap-3 flex-1">
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-500 bg-slate-50 border border-slate-100"
        @click="clear"
      >
        AC
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-500 bg-slate-50 border border-slate-100"
        @click="() => setOperator('/')"
      >
        <div class="i-lucide-divide" />
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-500 bg-slate-50 border border-slate-100"
        @click="() => setOperator('*')"
      >
        <div class="i-lucide-x" />
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-500 bg-slate-50 border border-slate-100"
        @click="() => setOperator('-')"
      >
        <div class="i-lucide-minus" />
      </button>

      <button v-for="n in ['7', '8', '9']" :key="n"
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-700 bg-white border border-slate-100 shadow-sm"
        @click="() => appendNumber(n)"
      >
        {{ n }}
      </button>
      <button
        class="btn flex-center text-lg font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-500 bg-slate-50 border border-slate-100"
        @click="() => setOperator('+')"
      >
        <div class="i-lucide-plus" />
      </button>

      <button v-for="n in ['4', '5', '6']" :key="n"
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-700 bg-white border border-slate-100 shadow-sm"
        @click="() => appendNumber(n)"
      >
        {{ n }}
      </button>
      
      <!-- Equal button spanning 2 rows -->
      <button
        class="row-span-2 btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-800 text-white bg-slate-900 shadow-md shadow-slate-200"
        @click="calculate"
      >
        <div class="i-lucide-equal" />
      </button>

      <button v-for="n in ['1', '2', '3']" :key="n"
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-700 bg-white border border-slate-100 shadow-sm"
        @click="() => appendNumber(n)"
      >
        {{ n }}
      </button>

      <button
        class="col-span-2 btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-700 bg-white border border-slate-100 shadow-sm"
        @click="() => appendNumber('0')"
      >
        0
      </button>
      <button
        class="btn flex-center text-xl font-medium rounded-xl transition-all active:scale-95 hover:bg-slate-100 text-slate-700 bg-white border border-slate-100 shadow-sm"
        @click="appendDot"
      >
        .
      </button>
    </div>
  </div>
</template>

