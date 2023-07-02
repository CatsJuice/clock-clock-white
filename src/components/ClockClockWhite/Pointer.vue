<script lang="ts" setup>
interface Props {
  angle: number
}
withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div
    :style="{
      'opacity': config.hideUnnecessaryPointer ? (
        angle % 90 === 0 ? `1` : '0'
      ) : `1`,
      '--rotate': `${angle}deg`,
      '--easing': config.pointerAnimeEasing,
    }"
  />
</template>
