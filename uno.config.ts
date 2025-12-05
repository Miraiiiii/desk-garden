import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetAttributify(),
  ],
  shortcuts: [
    // Layout shortcuts
    ['flex-center', 'flex justify-center items-center'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    
    // Button shortcuts
    ['btn', 'px-4 py-2 rounded-md transition-all duration-200 active:scale-95 cursor-pointer'],
    ['btn-primary', 'bg-slate-900 text-white hover:bg-slate-800'],
    ['btn-ghost', 'bg-transparent hover:bg-slate-100 text-slate-700'],
    
    // Card shortcuts
    ['card', 'bg-white rounded-xl border border-slate-200 shadow-sm'],
    
    // Text shortcuts
    ['text-muted', 'text-slate-500'],
  ],
  rules: [
    ['scrollbar-thin', { 'scrollbar-width': 'thin' }],
  ],
  theme: {
    colors: {
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(215 20.2% 65.1%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 47.4% 11.2%)',
      primary: {
        DEFAULT: 'hsl(222.2 47.4% 11.2%)',
        foreground: 'hsl(210 40% 98%)',
      },
      secondary: {
        DEFAULT: 'hsl(210 40% 96.1%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
      },
      destructive: {
        DEFAULT: 'hsl(0 100% 50%)',
        foreground: 'hsl(210 40% 98%)',
      },
      muted: {
        DEFAULT: 'hsl(210 40% 96.1%)',
        foreground: 'hsl(215.4 16.3% 46.9%)',
      },
      accent: {
        DEFAULT: 'hsl(210 40% 96.1%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
      },
      popover: {
        DEFAULT: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
      },
      card: {
        DEFAULT: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
      },
    },
    borderRadius: {
      lg: '0.5rem',
      md: 'calc(0.5rem - 2px)',
      sm: 'calc(0.5rem - 4px)',
    },
  }
})

