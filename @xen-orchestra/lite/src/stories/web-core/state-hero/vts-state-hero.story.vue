<template>
  <ComponentStory
    v-slot="{ properties, settings }"
    :params="[
      prop('type').required().enum('page', 'card', 'panel', 'table').preset('card').widget(),
      prop('busy').bool().widget(),
      prop('image').enum('no-result', 'under-construction', 'no-selection', 'error', 'no-data').widget(),
      prop('noBackground').bool().widget(),
      slot(),
      setting('defaultSlot').preset('Some text').widget(),
    ]"
  >
    <VtsStateHero v-bind="properties">
      {{ settings.defaultSlot }}
    </VtsStateHero>
  </ComponentStory>
</template>

<script lang="ts" setup>
import ComponentStory from '@/components/component-story/ComponentStory.vue'
import { prop, setting, slot } from '@/libs/story/story-param'
import VtsStateHero from '@core/components/state-hero/VtsStateHero.vue'
</script>
