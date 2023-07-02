<script setup lang="ts">
import { Pane } from 'tweakpane'
import { themes } from '../constants/theme.constant'

const props = defineProps<{ timer: any }>()

onMounted(() => {
  const tw = document.querySelector('.tp-dfwv')
  if (tw) {
    tw.addEventListener('mouseenter', () => {
      clearTimeout(props.timer)
    })
  }
  onThemeChange({ value: config.value.theme })
})

const pane = new Pane({
  expanded: true,
  title: 'Configuration',
})

const fps = useFps()
const { toggle } = useFullscreen()

pane.addMonitor(fps, 'value', {
  view: 'graph',
  label: 'FPS',
})

// pane.addInput(isDark, 'value', {
//   label: 'Dark',
// })
pane.addInput(config.value, 'theme', {
  options: Object.entries(themes).map(([key, value]) => {
    return { text: value.name, value: key }
  }),
}).on('change', onThemeChange)

pane.addInput(config.value, 'size', {
  label: 'Size',
  min: 50,
  max: 200,
  step: 10,
}).on('change', createOnChange('size'))

pane.addInput(config.value, 'format', {
  label: 'Format',
  options: { '24H': '24H', '12H': '12H' },
}).on('change', createOnChange('format'))

const shadowFolder = pane.addFolder({ title: 'Clock Shadow', expanded: false })

shadowFolder.addInput(config.value, 'enableShadowAnimation', {
  label: 'Animation',
}).on('change', createOnChange('enableShadowAnimation'))
shadowFolder.addInput(config.value, 'fpsLimit', {
  label: 'FPS Limit',
  min: 1,
  max: 144,
  step: 1,
}).on('change', createOnChange('fpsLimit'))

const tickFolder = pane.addFolder({ title: 'Tick', expanded: false })
tickFolder.addInput(config.value, 'hourTickLength', {
  label: 'Hour Tick Length',
  min: 0,
  max: 20,
  step: 1,
}).on('change', createOnChange('hourTickLength'))
tickFolder.addInput(config.value, 'minuteTickLength', {
  label: 'Minute Tick Length',
  min: 0,
  max: 20,
  step: 1,
}).on('change', createOnChange('minuteTickLength'))
tickFolder.addInput(config.value, 'hourTickWidth', {
  label: 'Hour Tick Width',
  min: 0,
  max: 5,
  step: 0.5,
}).on('change', createOnChange('hourTickWidth'))
tickFolder.addInput(config.value, 'minuteTickWidth', {
  label: 'Minute Tick Width',
  min: 0,
  max: 5,
  step: 0.5,
}).on('change', createOnChange('minuteTickWidth'))

// pointer
const pointerFolder = pane.addFolder({ title: 'Pointer', expanded: false })
pointerFolder.addInput(config.value, 'pointerWidth', {
  label: 'Width',
  min: 1,
  max: 20,
  step: 1,
}).on('change', createOnChange('pointerWidth'))
pointerFolder.addInput(config.value, 'pointerAnimeDuration', {
  label: 'Animation Speed',
  min: 0,
  max: 1000,
  step: 10,
}).on('change', createOnChange('pointerAnimeDuration'))
pointerFolder.addInput(config.value, 'pointerAnimeEasing', {
  label: 'Animation Easing',
  options: {
    ease: 'ease',
    linear: 'linear',
  },
}).on('change', createOnChange('pointerAnimeEasing'))
pointerFolder.addInput(config.value, 'thirdPointer', {
  label: 'Third Pointer',
}).on('change', createOnChange('thirdPointer'))

pane.addButton({ title: 'Toggle Fullscreen' }).on('click', () => toggle())
pane.addButton({ title: 'Hide Pane' }).on('click', () => pane.hidden = true)

function createOnChange(key: keyof typeof config.value) {
  return (e: any) => {
    (config.value as any)[key] = e.value
  }
}

function onThemeChange(e: { value: string }) {
  const themeName = e.value || 'default'
  createOnChange('theme')({ value: themeName })
  const theme = (themes as any)[themeName]!
  toggleDark(theme.dark)
  const htmlTag: HTMLElement = document.querySelector('html')!
  Object.entries(themes).forEach(([_, v]) => {
    htmlTag.classList.remove(v.class)
  })
  htmlTag.classList.add(theme.class)
}
</script>

<template>
  <div />
</template>
