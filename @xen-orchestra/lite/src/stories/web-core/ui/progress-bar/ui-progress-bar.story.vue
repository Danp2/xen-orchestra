<template>
  <ComponentStory
    v-slot="{ properties }"
    :params="[
      prop('legend').preset('Legend').required().widget(),
      prop('value').preset(25).required().widget(),
      prop('max').num().widget().help(`Max will be required when displayMode is set to 'value'.`),
      prop('displayMode').enum('value', 'percent').required().preset('percent').widget(),
      prop('showSteps').bool().help('Meant to display steps values under the progress bar. See Presets.').widget(),
    ]"
    :presets
  >
    <UiProgressBar v-bind="properties" />
  </ComponentStory>
</template>

<script lang="ts" setup>
import ComponentStory from '@/components/component-story/ComponentStory.vue'
import { prop } from '@/libs/story/story-param'
import UiProgressBar from '@core/components/ui/progress-bar/UiProgressBar.vue'

const presets = {
  'Warning >= 80%': {
    props: {
      legend: 'Ram usage',
      value: 80,
      displayMode: 'percent',
    },
  },
  'Danger >= 90%': {
    props: {
      legend: 'Ram usage',
      value: 95,
      displayMode: 'percent',
    },
  },
  'With steps': {
    props: {
      legend: 'Ram usage',
      value: 250,
      max: 200,
      displayMode: 'value',
    },
  },
}
</script>
