import { CONFIG_STORAGE_KEY } from '~/constants/basic.constant'

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

for (const key in defaultConfig) {
  if ((config.value as any)[key] === undefined)
    (config.value as any)[key] = (defaultConfig as any)[key]
}
