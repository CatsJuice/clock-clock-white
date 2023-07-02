<script setup lang="ts">
import Clock from './Clock.vue'

withDefaults(defineProps<{
  value?: string[]
  size?: number
}>(), {
  value: () => ['00', '00', '00'],
  size: 100,
})
</script>

<template>
  <div flex="~" gap-4>
    <div
      v-for="(group, gi) in value"
      :key="gi" flex="~ nowrap"
      gap-2 class="number-group"
    >
      <div
        v-for="(num, ni) in group.split('')"
        :key="ni"
      >
        <div v-for="rn in 3" :key="rn" flex="~ nowrap">
          <Clock
            v-for="cn in 2" :key="cn"
            :size="size"
            :value="(parseInt(num) % 10) || 0"
            :rn="rn"
            :cn="cn"
          />
        </div>
      </div>
    </div>
  </div>
</template>
