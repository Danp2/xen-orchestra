<template>
  <UiCard class="pool-dashboard-cpu-provisioning">
    <UiCardTitle>{{ t('cpu-provisioning') }}</UiCardTitle>
    <VtsLoadingHero v-if="!isCpuProvisioningReady" type="card" />
    <template v-else>
      <UiProgressBar
        display-mode="percent"
        :max="poolDashboard?.cpuProvisioning?.total"
        :legend="t('vcpus')"
        :value="poolDashboard?.cpuProvisioning?.assigned ?? 0"
      />
      <div class="total">
        <UiCardNumbers :label="t('vcpus-used')" :value="poolDashboard?.cpuProvisioning?.assigned" size="medium" />
        <UiCardNumbers :label="t('total-cpus')" :value="poolDashboard?.cpuProvisioning?.total" size="medium" />
      </div>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import type { XoPoolDashboard } from '@/types/xo/pool-dashboard.type.ts'
import VtsLoadingHero from '@core/components/state-hero/VtsLoadingHero.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import UiCardNumbers from '@core/components/ui/card-numbers/UiCardNumbers.vue'
import UiCardTitle from '@core/components/ui/card-title/UiCardTitle.vue'
import UiProgressBar from '@core/components/ui/progress-bar/UiProgressBar.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { poolDashboard } = defineProps<{
  poolDashboard: XoPoolDashboard | undefined
}>()

const isCpuProvisioningReady = computed(() => poolDashboard?.cpuProvisioning !== undefined)

const { t } = useI18n()
</script>

<style lang="postcss" scoped>
.pool-dashboard-cpu-provisioning {
  .total {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-block-start: auto;
  }
}
</style>
