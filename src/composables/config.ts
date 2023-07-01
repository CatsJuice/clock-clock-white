import { Pane } from 'tweakpane'
import { CONFIG_STORAGE_KEY } from '~/constants/basic.constant'

const fps = useFps()
const { toggle } = useFullscreen()
const defaultConfig = {
  size: 100,
  enableShadowAnimation: true,
  fpsLimit: 60,
  hourTickLength: 13,
  minuteTickLength: 10,
  hourTickWidth: 1,
  minuteTickWidth: 1,
  pointerWidth: 10,
  pointerAnimeDuration: 500,
  pointerAnimeEasing: 'ease' as 'ease' | 'linear',
  format: '24H' as '24H' | '12H',
}
export const config = useStorage(CONFIG_STORAGE_KEY, {
  ...defaultConfig,
})
export const pane = new Pane({
  expanded: true,
  title: 'Configuration',
})

for (const key in defaultConfig) {
  if ((config.value as any)[key] === undefined)
    (config.value as any)[key] = (defaultConfig as any)[key]
}

pane.addMonitor(fps, 'value', {
  view: 'graph',
  label: 'FPS',
})

pane.addInput(isDark, 'value', {
  label: 'Dark',
})

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

pane.addButton({ title: 'Toggle Fullscreen' }).on('click', () => toggle())
pane.addButton({ title: 'Hide Pane' }).on('click', () => pane.hidden = true)

function createOnChange(key: keyof typeof config.value) {
  return (e: any) => {
    (config.value as any)[key] = e.value
  }
}
