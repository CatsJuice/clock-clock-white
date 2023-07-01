<script setup lang="ts">
import './composables/config'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Clock Clock White',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

onMounted(() => {
  let timer: any
  document.addEventListener('mousemove', () => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      document.body.classList.add('freeze')
    }, 1000)

    document.body.classList.remove('freeze')
  })
})
</script>

<template>
  <RouterView />
</template>
