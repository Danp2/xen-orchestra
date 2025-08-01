<template>
  <UiCard>
    <UiCardTitle>{{ t('patches') }}</UiCardTitle>
    <VtsLoadingHero v-if="!arePatchesReady" type="card" />
    <template v-else>
      <VtsDonutChartWithLegend :segments="poolsSegments" :title="poolsTitle" />
      <VtsDivider type="stretch" />
      <VtsDonutChartWithLegend :segments="hostsSegments" :title="hostsTitle" />
    </template>
  </UiCard>
</template>

<script lang="ts" setup>
import type { XoDashboard } from '@/types/xo/dashboard.type.ts'
import VtsDivider from '@core/components/divider/VtsDivider.vue'
import VtsDonutChartWithLegend, {
  type DonutChartWithLegendProps,
} from '@core/components/donut-chart-with-legend/VtsDonutChartWithLegend.vue'
import VtsLoadingHero from '@core/components/state-hero/VtsLoadingHero.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import UiCardTitle from '@core/components/ui/card-title/UiCardTitle.vue'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

const {
  missingPatches,
  nPools = 0,
  nHosts = 0,
  nHostsEol = 0,
} = defineProps<{
  missingPatches: XoDashboard['missingPatches'] | undefined
  nPools: XoDashboard['nPools'] | undefined
  nHosts: XoDashboard['nHosts'] | undefined
  nHostsEol: XoDashboard['nHostsEol'] | undefined
}>()

const { t } = useI18n()

const arePatchesReady = computed(() => missingPatches !== undefined)

const poolsTitle: ComputedRef<DonutChartWithLegendProps['title']> = computed(() => ({
  label: t('pools'),
}))

const poolsSegments: ComputedRef<DonutChartWithLegendProps['segments']> = computed(() => {
  // @TODO: See with Clémence if `hasAuthorization === false`
  const nPoolsWithMissingPatches = missingPatches?.hasAuthorization ? missingPatches.nPoolsWithMissingPatches : 0

  const nUpToDatePools = nPools - nPoolsWithMissingPatches

  return [
    { value: nUpToDatePools, accent: 'success', label: t('up-to-date') },
    { value: nPoolsWithMissingPatches, accent: 'warning', label: t('missing-patches') },
  ]
})

const hostsTitle: ComputedRef<DonutChartWithLegendProps['title']> = computed(() => ({
  label: t('hosts'),
}))

const hostsSegments = computed(() => {
  // @TODO: See with Clémence if `hasAuthorization === false`
  const nHostsWithMissingPatches = missingPatches?.hasAuthorization ? missingPatches.nHostsWithMissingPatches : 0
  const nUpToDateHosts = nHosts - (nHostsWithMissingPatches + nHostsEol)

  const segments: DonutChartWithLegendProps['segments'] = [
    { value: nUpToDateHosts, accent: 'success', label: t('up-to-date') },
    { value: nHostsWithMissingPatches, accent: 'warning', label: t('missing-patches') },
  ]

  if (nHostsEol !== undefined) {
    segments.push({ value: nHostsEol, accent: 'danger', label: t('eol'), tooltip: t('end-of-life') })
  }

  return segments
})
</script>
