<template>
  <UiCard>
    <UiCardTitle>
      {{ t('cpu-usage') }}
      <template #description>{{ t('last-week') }}</template>
    </UiCardTitle>
    <VtsLoadingHero v-if="loading" type="card" />
    <VtsErrorNoDataHero v-else-if="error" type="card" />
    <VtsNoDataHero v-else-if="cpuUsage.length === 0" type="card" />
    <VtsLinearChart v-else :data="cpuUsage" :max-value :value-formatter />
  </UiCard>
</template>

<script lang="ts" setup>
import { RRD_STEP_FROM_STRING } from '@/libs/xapi-stats.ts'
import type { LinearChartData, ValueFormatter } from '@core/types/chart.ts'
import VtsErrorNoDataHero from '@core/components/state-hero/VtsErrorNoDataHero.vue'
import VtsLoadingHero from '@core/components/state-hero/VtsLoadingHero.vue'
import VtsNoDataHero from '@core/components/state-hero/VtsNoDataHero.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import UiCardTitle from '@core/components/ui/card-title/UiCardTitle.vue'
import type { XapiVmStatsRaw } from '@vates/types/common'
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const { data } = defineProps<{
  data: {
    stats: XapiVmStatsRaw | undefined
    timestampStart: number
  }
  loading: boolean
  error?: string
}>()

const VtsLinearChart = defineAsyncComponent(() => import('@core/components/linear-chart/VtsLinearChart.vue'))

const { t, n } = useI18n()

const cpuUsage = computed<LinearChartData>(() => {
  const { stats, timestampStart } = data

  if (stats === undefined) {
    return []
  }

  const cpus = Object.values(stats.cpus ?? {})

  const result = cpus[0].map((_, hourIndex) => {
    const timestamp = (timestampStart + hourIndex * RRD_STEP_FROM_STRING.hours) * 1000

    const value = Math.round(cpus.reduce((total, cpu) => total + (cpu[hourIndex] ?? NaN), 0) / cpus.length)

    return { timestamp, value }
  })

  return [
    {
      label: t('stacked-cpu-usage'),
      data: result,
    },
  ]
})

const maxValue = computed(() => {
  const values = cpuUsage.value[0]?.data.map(item => item.value || 0) ?? []

  if (values.length === 0) {
    return 100
  }

  const maxCpuUsage = Math.max(...values)

  return Math.ceil(maxCpuUsage / 100) * 100
})

const valueFormatter: ValueFormatter = value => {
  if (value === null) {
    return ''
  }

  return n(value / 100, 'percent')
}
</script>
