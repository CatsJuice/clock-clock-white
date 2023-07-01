<script setup lang="ts">
const now = useNow()
const value = computed(() => [
  fillZero(now.value.getHours()),
  fillZero(now.value.getMinutes()),
  fillZero(now.value.getSeconds()),
])
</script>

<template>
  <ClockClockWhite :value="value" />
</template>
