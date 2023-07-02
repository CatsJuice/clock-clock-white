<script lang="ts" setup>
import { randomString } from '@catsjuice/utils'

interface Props {
  size: number
}
const props = withDefaults(defineProps<Props>(), {})

const id = randomString(8, 8, '')
const hourMaskId = `hourTickMask-${id}`
const minuteMaskId = `minuteTickMask-${id}`

const svgAttrs = computed(() => ({
  xmls: 'http://www.w3.org/2000/svg',
  width: props.size,
  height: props.size,
  viewBox: `0 0 ${props.size} ${props.size}`,
}))

const tickTypes = computed(() => [
  {
    id: hourMaskId,
    len: config.value.hourTickLength,
    strokeColor: 'var(--hour-tick-color)',
    strokeWidth: config.value.hourTickWidth,
    tickNum: 12,
  },
  {
    id: minuteMaskId,
    len: config.value.minuteTickLength,
    strokeColor: 'var(--minute-tick-color)',
    strokeWidth: config.value.minuteTickWidth,
    tickNum: 60,
    skip: (i: number) => i % 5 === 0,
  },
].map(t => ({
  ...t,
  tickArray: Array.from({ length: t.tickNum / 2 }, (_, i) => i).filter(el => t.skip ? !t.skip(el) : true),
})))
</script>

<template>
  <svg v-bind="svgAttrs">
    <g
      v-for="({ id: iid, strokeColor, strokeWidth, tickNum, tickArray }) in tickTypes"
      :key="iid"
      :mask="`url(#${iid})`"
    >
      <line
        v-for="n in tickArray"
        :key="n"
        :transform="`rotate(${n * (360 / (tickNum / 2) / 2)}, ${size / 2} ${size / 2})`"
        x1="50%" y1="0"
        x2="50%" y2="100%"
        width="100%" height="2"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
      />
    </g>

    <mask
      v-for="({ id: iid, len }) in tickTypes"
      :id="iid" :key="iid"
    >
      <rect
        x="0"
        y="0"
        :width="size" :height="size"
        fill="white"
      />
      <circle
        :cx="size / 2 " :cy="size / 2"
        :r="size / 2 - len"
        fill="black"
      />
    </mask>
  </svg>
</template>
