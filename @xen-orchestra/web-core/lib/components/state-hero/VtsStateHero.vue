<template>
  <div :class="[type, { error }]" class="vts-state-hero">
    <UiLoader v-if="busy" class="loader" />
    <img v-else-if="imageSrc" :src="imageSrc" alt="" class="image" />
    <div v-if="slots.default" :class="typoClass" class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiLoader from '@core/components/ui/loader/UiLoader.vue'
import { computed } from 'vue'

export type StateHeroType = 'page' | 'card' | 'panel' | 'table'

const { type, busy, image, noBackground } = defineProps<{
  type: StateHeroType
  busy?: boolean
  image?:
    | 'no-result'
    | 'under-construction'
    | 'no-data'
    | 'no-selection'
    | 'error'
    | 'not-found'
    | 'offline'
    | 'all-good'
    | 'all-done'
  noBackground?: boolean
}>()

const slots = defineSlots<{
  default?(): any
}>()

const typoClass = computed(() => (type === 'page' ? 'typo-h2' : 'typo-h4'))
const error = computed(() => !noBackground && !busy && image === 'error')

const imageSrc = computed(() => {
  if (!image) {
    return undefined
  }

  return new URL(`../../assets/${image}.svg`, import.meta.url).href
})
</script>

<style lang="postcss" scoped>
.vts-state-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &.error {
    background-color: var(--color-danger-background-selected);

    .content {
      color: var(--color-danger-txt-base);
    }
  }

  .loader,
  .content {
    color: var(--color-brand-txt-base);
  }

  .image {
    order: 2;
  }

  .content {
    order: 3;
  }

  &.page {
    gap: 2.4rem;

    .content {
      order: 3;
    }

    .loader {
      order: 1;
      font-size: 10rem;
    }

    .image {
      order: 2;
      width: 90%;
      max-height: none;
    }
  }

  &.card {
    gap: 2rem;

    .content {
      order: 3;
    }

    .loader {
      font-size: 6rem;
      order: 1;
    }

    .image {
      order: 2;
      width: 70%;
      max-height: 20rem;
    }
  }

  &.panel {
    gap: 4rem;
    justify-content: unset;
    padding-top: 8rem;

    .content {
      order: 1;
    }

    .loader {
      order: 3;
      font-size: 6.4rem;
    }

    .image {
      order: 2;
      width: 80%;
    }
  }

  &.table {
    padding: 4rem;
    gap: 2.4rem;

    .content {
      order: 3;
    }

    .image {
      order: 2;
      max-height: 20rem;
    }

    .loader {
      order: 1;
      font-size: 10rem;
    }
  }
}
</style>
