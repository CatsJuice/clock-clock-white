<script setup lang="ts">
import { clamp } from '@catsjuice/utils'

const props = withDefaults(defineProps<{ value: number; size: number }>(), {
  value: 0,
  size: 100,
})

const $el = ref<HTMLElement | null>(null)
const { x, y } = useMouse()
const rect = useElementBounding($el)
let prevTime = 0
let paused = false
const info = ref(getInfo())

onMounted(() => {
  if (config.value.enableShadowAnimation)
    startAnime()
})

const variableStyles = computed(() => {
  const outDis = clamp(info.value.distance / 10, 10, props.size / 3)
  const innDis = clamp((info.value.distance / props.size * 2), 0, 10)
  return {
    '--w': `${props.size}px`,
    '--h': `${props.size}px`,
    '--out-shadow-1': `20px ${outDis}px ${
      clamp(info.value.distance / props.size * 10, 30, 500)
    }px rgba(0,0,0,.4)`,
    '--out-shadow-2': `0px ${outDis - 10}px ${
      clamp(info.value.distance / props.size * 2, 5, 100)
    }px rgba(0,0,0, .15)`,
    '--out-shadow-3': `0px ${outDis + 20}px 6px rgba(0,0,0,.05)`,
    '--out-shadow-4': `0px ${outDis - 10}px 4px rgba(0,0,0,.1)`,
    '--out-shadow-5': `10px ${outDis - 5}px 10px rgba(0,0,0,.1)`,
    '--out-shadow-6': `-10px ${outDis - 5}px 10px rgba(0,0,0,.05)`,
    '--out-shadow-7': `-20px ${outDis + 20}px 5px rgba(0,0,0, .06)`,
    '--in-shadow-1': `inset 0px ${innDis}px 5px rgba(0,0,0,.25)`,
    '--in-shadow-2': ' inset 5px 5px 6px rgba(0,0,0,0.1)',
    '--in-shadow-3': 'inset -5px 5px 6px rgba(0,0,0,0.1)',
    '--in-shadow-4': `inset 0px ${-innDis}px 4px rgba(255,255,255, 0.7)`,
  }
})

const shadowStyle = computed(() => ({
  opacity: `${clamp(1 - info.value.distance / props.size / 20, 0.5, 1)}`,
  transform: `rotate(${info.value.angle}deg)`,
}))

watch(() => config.value.enableShadowAnimation, (v) => {
  if (!v)
    return stopAnime()
  startAnime()
})

function startAnime() {
  paused = false
  prevTime = Date.now()
  requestAnimationFrame(tick)
}
function stopAnime() {
  prevTime = 0
  paused = true
}

function tick() {
  if (paused)
    return
  const now = Date.now()
  const elapsed = now - prevTime

  // limit fps
  const fpsLimit = config.value.fpsLimit
  if (elapsed < 1000 / fpsLimit) {
    requestAnimationFrame(tick)
    return
  }
  info.value = getInfo()
  prevTime = now
  requestAnimationFrame(tick)
}

function getInfo() {
  const centerX = rect.width.value / 2 + rect.left.value
  const centerY = rect.height.value / 2 + rect.top.value
  const offsetX = x.value - centerX
  const offsetY = y.value - centerY
  return {
    distance: Math.sqrt(offsetX ** 2 + offsetY ** 2),
    angle: Math.atan2(offsetY, offsetX) * (180 / Math.PI) + 90,
  }
}
</script>

<template>
  <div ref="$el" class="clock" :style="variableStyles" relative rounded-full>
    <div
      class="clock__shadow" absolute inset-0 rounded-full z="-1"
      :style="shadowStyle"
    />
    <div class="clock__border" absolute inset-0 rounded-full />
    <div class="clock__inner" relative full rounded-full>
      <div
        class="clock__inner-shadow" full rounded-full
        :style="shadowStyle"
      />
      <div class="clock__tick-1" />
      <div class="clock__tick-2" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.clock
  // variables
  --w: 100px
  --h: 100px
  --bw: calc(var(--w) / 20)
  --light: #fff
  --bg: #fafafa
  --out-shadow-1: 20px 30px 40px rgba(0,0,0,.4)
  --out-shadow-2:  0px 30px 5px rgba(0,0,0,.15)
  --out-shadow-3:  0px 60px 6px rgba(0,0,0,.05)
  --out-shadow-4: 0px 10px 4px rgba(0,0,0,.1)
  --out-shadow-5: 10px 5px 10px rgba(0,0,0,.1)
  --out-shadow-6: -10px 5px 10px rgba(0,0,0,.05)
  --out-shadow-7: -20px 30px 5px rgba(0,0,0, .06)
  --in-shadow-1: inset 0px 10px 5px rgba(0,0,0,.25)
  --in-shadow-2:  inset 5px 5px 6px rgba(0,0,0,0.1)
  --in-shadow-3: inset -5px 5px 6px rgba(0,0,0,0.1)
  --in-shadow-4: inset 0px -10px 4px rgba(255,255,255, 0.7)

  width: var(--w)
  height: var(--h)
  padding: var(--bw)

  &__shadow
    box-shadow: var(--out-shadow-1), var(--out-shadow-2), var(--out-shadow-3), var(--out-shadow-4), var(--out-shadow-5), var(--out-shadow-6), var(--out-shadow-7)

  &__border
    background-color: var(--light)

  &__inner
    background-color: var(--bg)

    &-shadow
      box-shadow: var(--in-shadow-1), var(--in-shadow-2), var(--in-shadow-3), var(--in-shadow-4)

html.dark .clock
  --light: #333
  --bg: #222
</style>
