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

const mousePosition = reactive({ x: 0, y: 0 })
const timer = ref(null as any)
provide('mousePosition', mousePosition)

onMounted(() => {
  useEventListener(document.querySelector('#app'), 'mousemove', (e: MouseEvent) => {
    mousePosition.x = e.clientX
    mousePosition.y = e.clientY
  })

  document.querySelector('#app')!.addEventListener('mousemove', () => {
    if (timer)
      clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      document.body.classList.add('freeze')
    }, 1000)

    document.body.classList.remove('freeze')
  })
})
</script>

<template>
  <ClockClockWhite :value="value" :size="config.size" />
  <ClientOnly>
    <Config :timer="timer" />
  </ClientOnly>
</template>
