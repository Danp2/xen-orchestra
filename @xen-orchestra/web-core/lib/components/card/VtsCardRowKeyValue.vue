<template>
  <div class="vts-card-row-key-value typo-body-regular-small">
    <div class="key">
      <slot name="key" />
    </div>
    <div v-tooltip class="value text-ellipsis">
      <slot name="value" />
    </div>
    <div v-if="slots.addons" class="addons">
      <slot name="addons" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { vTooltip } from '@core/directives/tooltip.directive'

const slots = defineSlots<{
  key(): any
  value(): any
  addons?(): any
}>()
</script>

<style lang="postcss" scoped>
.vts-card-row-key-value {
  display: flex;
  align-items: center;
  gap: 1.2rem;

  .key {
    width: 12rem;
    min-width: 12rem;
    overflow-wrap: break-word;
    color: var(--color-neutral-txt-secondary);
  }

  .value {
    width: 20rem;
    color: var(--color-neutral-txt-primary);
  }

  .value:empty::before {
    content: '-';
  }

  .addons {
    display: flex;
    gap: 0.8rem;
    margin-left: auto;
    font-size: 1.6rem;
  }
}
</style>
