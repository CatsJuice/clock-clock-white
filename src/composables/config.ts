import { Pane } from 'tweakpane'
import { CONFIG_STORAGE_KEY } from '~/constants/basic.constant'

const fps = useFps()
const { toggle } = useFullscreen()
export const config = useStorage(CONFIG_STORAGE_KEY, {
  fpsLimit: 60,
})
export const pane = new Pane({
  expanded: true,
  title: 'Configuration',
})

pane.addMonitor(fps, 'value', {
  view: 'graph',
  label: 'FPS',
})

pane.addInput(isDark, 'value', {
  label: 'Dark Mode',
})

pane.addInput(config.value, 'fpsLimit', {
  label: 'Shadow FPS Limit',
  min: 1,
  max: 144,
  step: 1,
}).on('change', e => config.value.fpsLimit = e.value)

pane.addButton({ title: 'Toggle Fullscreen' }).on('click', () => toggle())
pane.addButton({ title: 'Hide Pane' }).on('click', () => pane.hidden = true)
