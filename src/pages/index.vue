<script setup lang="ts">
const now = useNow()
const value = computed(() => [
  fillZero(
    config.value.format === '12H'
      ? now.value.getHours() % 12
      : now.value.getHours()),
  fillZero(now.value.getMinutes()),
  fillZero(now.value.getSeconds()),
])
</script>

<template>
  <ClockClockWhite :value="value" :size="config.size" />
</template>
