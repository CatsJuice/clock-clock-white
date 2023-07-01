import { Pane } from 'tweakpane'
import { CONFIG_STORAGE_KEY } from '~/constants/basic.constant'

const fps = useFps()
const { toggle } = useFullscreen()
const defaultConfig = {
  enableShadowAnimation: true,
  fpsLimit: 60,
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

pane.addInput(config.value, 'enableShadowAnimation', {
  label: 'Shadow Anime',
}).on('change', (e) => {
  config.value.enableShadowAnimation = e.value
})

pane.addInput(config.value, 'fpsLimit', {
  label: 'Shadow FPS Limit',
  min: 1,
  max: 144,
  step: 1,
}).on('change', e => config.value.fpsLimit = e.value)

pane.addButton({ title: 'Toggle Fullscreen' }).on('click', () => toggle())
pane.addButton({ title: 'Hide Pane' }).on('click', () => pane.hidden = true)
