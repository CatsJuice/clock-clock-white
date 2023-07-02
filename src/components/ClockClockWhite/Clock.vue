<script setup lang="ts">
import { clamp } from '@catsjuice/utils'
import { angleMap } from './coord-angle'

const props = withDefaults(defineProps<{
  value: number
  size: number
  rn: number
  cn: number
}>(), {
  value: 0,
  size: 100,
})

const $el = ref<HTMLElement | null>(null)
const mousePosition = inject<{ x: number; y: number }>('mousePosition')!
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
    '--pointer-width': `${config.value.pointerWidth}px`,
    '--pointer-speed': `${1000 - config.value.pointerAnimeDuration}ms`,
    '--w': `${props.size}px`,
    '--h': `${props.size}px`,
    '--out-shadow-1': `20px ${outDis}px ${
      clamp(info.value.distance / props.size * 10, 30, 500)
    }px var(--out-shadow-color-1)`,
    '--out-shadow-2': `0px ${outDis - 10}px ${
      clamp(info.value.distance / props.size * 2, 5, 100)
    }px var(--out-shadow-color-2)`,
    '--out-shadow-3': `0px ${outDis + 20}px 6px var(--out-shadow-color-3)`,
    '--out-shadow-4': `0px ${outDis - 10}px 4px var(--out-shadow-color-4)`,
    '--out-shadow-5': `10px ${outDis - 5}px 10px var(--out-shadow-color-5)`,
    '--out-shadow-6': `-10px ${outDis - 5}px 10px var(--out-shadow-color-6)`,
    '--out-shadow-7': `-20px ${outDis + 20}px 5px var(--out-shadow-color-7)`,
    '--in-shadow-1': `inset 0px ${innDis}px 5px var(--in-shadow-color-1)`,
    '--in-shadow-2': ' inset 5px 5px 6px var(--in-shadow-color-2)',
    '--in-shadow-3': 'inset -5px 5px 6px var(--in-shadow-color-3)',
    '--in-shadow-4': `inset 0px ${-innDis}px 4px var(--in-shadow-color-4)`,
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
  const offsetX = mousePosition.x - centerX
  const offsetY = mousePosition.y - centerY
  return {
    distance: Math.sqrt(offsetX ** 2 + offsetY ** 2),
    angle: Math.atan2(offsetY, offsetX) * (180 / Math.PI) + 90,
  }
}

function getAngle(index: number) {
  const cursor: any = (angleMap as any)[props.rn]?.[props.cn]?.[props.value]
  return index === 2
    ? config.value.thirdPointer
      ? cursor?.[index] ?? cursor?.[1] ?? 0
      : cursor?.[1] ?? 0
    : (cursor?.[index] || 0)
}
</script>

<template>
  <div
    ref="$el"
    class="clock" :style="variableStyles" relative rounded-full
  >
    <div
      class="clock__shadow" absolute inset-0 rounded-full z="-1"
      :style="shadowStyle"
    />
    <div class="clock__border" absolute inset-0 rounded-full />
    <div class="clock__inner" relative full overflow-hidden rounded-full>
      <Ticks class="mask-layer" :size="size" />
      <div
        class="clock__inner-shadow" full rounded-full
        :style="shadowStyle"
      />
      <Pointer
        v-for="n in 3"
        :key="n"
        :angle="getAngle(n - 1)"
        absolute class="clock__pointer"
      />
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
  --pointer-color: #000
  --pointer-width: 10px
  --pointer-speed: 400ms
  --hour-tick-color: #444
  --minute-tick-color: #333
  --out-shadow-color-1: rgba(0,0,0,.4)
  --out-shadow-color-2: rgba(0,0,0, .15)
  --out-shadow-color-3: rgba(0,0,0,.05)
  --out-shadow-color-4: rgba(0,0,0,.1)
  --out-shadow-color-5: rgba(0,0,0,.1)
  --out-shadow-color-6: rgba(0,0,0,.05)
  --out-shadow-color-7: rgba(0,0,0, .06)
  --out-shadow-color-8: rgba(255,255,255, 0.75)
  --in-shadow-color-1: rgba(0,0,0,.25)
  --in-shadow-color-2: rgba(0,0,0,0.1)
  --in-shadow-color-3: rgba(0,0,0,0.1)
  --in-shadow-color-4: rgba(255,255,255, 0.7)
  --out-shadow-1: 20px 30px 40px var(--out-shadow-color-1)
  --out-shadow-2:  0px 30px 5px var(--out-shadow-color-2)
  --out-shadow-3:  0px 60px 6px var(--out-shadow-color-3)
  --out-shadow-4: 0px 10px 4px var(--out-shadow-color-4)
  --out-shadow-5: 10px 5px 10px var(--out-shadow-color-5)
  --out-shadow-6: -10px 5px 10px var(--out-shadow-color-6)
  --out-shadow-7: -20px 30px 5px var(--out-shadow-color-7)
  --out-shadow-8: 0px -12px 12px var(--out-shadow-color-8)
  --in-shadow-1: inset 0px 10px 5px var(--in-shadow-color-1)
  --in-shadow-2:  inset 5px 5px 6px var(--in-shadow-color-2)
  --in-shadow-3: inset -5px 5px 6px var(--in-shadow-color-3)
  --in-shadow-4: inset 0px -10px 4px var(--in-shadow-color-4)

  width: var(--w)
  height: var(--h)
  padding: var(--bw)

  &__shadow
    box-shadow: var(--out-shadow-1), var(--out-shadow-2), var(--out-shadow-3), var(--out-shadow-4), var(--out-shadow-5), var(--out-shadow-6), var(--out-shadow-7), var(--out-shadow-8)

  &__border
    background-color: var(--light)

  &__inner
    background-color: var(--bg)

    &-shadow
      box-shadow: var(--in-shadow-1), var(--in-shadow-2), var(--in-shadow-3), var(--in-shadow-4)

    .mask-layer
      position: absolute
      left: calc(-1 * var(--bw))
      top: calc(-1 * var(--bw))
      bottom: calc(-1 * var(--bw))
      right: calc(-1 * var(--bw))

  &__pointer
    --rotate: 0
    --easing: ease
    width: var(--pointer-width)
    height: 100%
    left: 50%
    top: 0
    transform: translateX(-50%) rotate(var(--rotate))
    transition: transform var(--pointer-speed) var(--easing), opacity 0.1s ease
    &::after
      content: ""
      position: absolute
      width:100%
      height: calc(50% + var(--pointer-width) / 5 * 2)
      background: var(--pointer-color)
      border-bottom-left-radius: var(--w)
      border-bottom-right-radius: var(--w)
      box-shadow: 1px 4px 5px rgba(0,0,0,.2)

html.dark .clock
  --hour-tick-color: #ccc
  --minute-tick-color: #ccc
  --light: #333
  --bg: #222
  --pointer-color: #fff
  --out-shadow-color-1: rgba(0,0,0, 0.7)
  --out-shadow-color-2: rgba(0,0,0, .5)
  --out-shadow-color-3: rgba(0,0,0,.15)
  --out-shadow-color-4: rgba(0,0,0,.05)
  --out-shadow-color-5: rgba(0,0,0,0.05)
  --out-shadow-color-6: rgba(0,0,0,.05)
  --out-shadow-color-7: rgba(0,0,0, .15)
  --out-shadow-color-8: rgba(0,0,0, 0.2)
  --in-shadow-color-1: rgba(0,0,0,.25)
  --in-shadow-color-2: rgba(0,0,0,0.1)
  --in-shadow-color-3: rgba(0,0,0,0.1)
  --in-shadow-color-4: rgba(255,255,255, 0.05)

  &__pointer::after
    box-shadow: none
html.dark.high-contrast-theme .clock
  --light: #111
  --bg: #0A0A0A
  --pointer-color: #fff
  --hour-tick-color: #333
  --minute-tick-color: #333
html.transparent-theme .clock
  --bg: transparent
  --light: transparent
  --hour-tick-color: transparent
  --minute-tick-color: transparent
  .clock__shadow
    box-shadow: none
  .clock__inner-shadow
    box-shadow: none
</style>
