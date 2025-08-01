<template>
  <UiCard>
    <UiCardTitle>{{ t('pools-status') }}</UiCardTitle>
    <VtsLoadingHero v-if="!arePoolsStatusReady" type="card" />
    <template v-else>
      <VtsDonutChartWithLegend :icon="faCity" :segments />
      <UiCardNumbers :value="total" class="total" label="Total" size="small" />
    </template>
  </UiCard>
</template>

<script lang="ts" setup>
import type { XoDashboard } from '@/types/xo/dashboard.type.ts'
import VtsDonutChartWithLegend, {
  type DonutChartWithLegendProps,
} from '@core/components/donut-chart-with-legend/VtsDonutChartWithLegend.vue'
import VtsLoadingHero from '@core/components/state-hero/VtsLoadingHero.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import UiCardNumbers from '@core/components/ui/card-numbers/UiCardNumbers.vue'
import UiCardTitle from '@core/components/ui/card-title/UiCardTitle.vue'
import { faCity } from '@fortawesome/free-solid-svg-icons'
import { useSum } from '@vueuse/math'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { status } = defineProps<{
  status: XoDashboard['poolsStatus'] | undefined
}>()

const { t } = useI18n()

const arePoolsStatusReady = computed(() => status !== undefined)

const total = useSum(() => Object.values(status ?? {}))

const segments = computed<DonutChartWithLegendProps['segments']>(() => [
  {
    label: t('pools-status.connected'),
    value: status?.connected ?? 0,
    accent: 'success',
  },
  {
    label: t('pools-status.unreachable'),
    value: status?.unreachable ?? 0,
    accent: 'warning',
    tooltip: t('pools-status.unreachable.tooltip'),
  },
  {
    label: t('pools-status.unknown'),
    value: status?.unknown ?? 0,
    accent: 'muted',
    tooltip: t('pools-status.unknown.tooltip'),
  },
])
</script>

<style lang="postcss" scoped>
.total {
  margin-left: auto;
}
</style>
