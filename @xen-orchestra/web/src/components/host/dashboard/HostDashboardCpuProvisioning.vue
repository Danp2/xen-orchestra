<template>
  <UiCard class="host-dashboard-cpu-provisioning">
    <UiCardTitle>{{ t('cpu-provisioning') }}</UiCardTitle>
    <VtsLoadingHero v-if="!isReady" type="card" />
    <template v-else>
      <UiProgressBar display-mode="percent" :value="vCpusCount" :max="cpusCount" :legend="t('vcpus')" />
      <div class="total">
        <UiCardNumbers :label="t('vcpus-assigned')" :value="vCpusCount" size="medium" />
        <UiCardNumbers :label="t('total-cpus')" :value="cpusCount" size="medium" />
      </div>
    </template>
  </UiCard>
</template>

<script lang="ts" setup>
import { useHostStore } from '@/stores/xo-rest-api/host.store'
import { useVmStore } from '@/stores/xo-rest-api/vm.store'
import type { XoHost } from '@/types/xo/host.type'
import { VM_POWER_STATE } from '@/types/xo/vm.type.ts'
import VtsLoadingHero from '@core/components/state-hero/VtsLoadingHero.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import UiCardNumbers from '@core/components/ui/card-numbers/UiCardNumbers.vue'
import UiCardTitle from '@core/components/ui/card-title/UiCardTitle.vue'
import UiProgressBar from '@core/components/ui/progress-bar/UiProgressBar.vue'
import { logicAnd } from '@vueuse/math'
import { useArrayReduce } from '@vueuse/shared'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { host } = defineProps<{
  host: XoHost
}>()

const { t } = useI18n()

const { isReady: isHostReady } = useHostStore().subscribe()
const { vmsByHost, isReady: isVmReady } = useVmStore().subscribe()

const isReady = logicAnd(isHostReady, isVmReady)

const hostVms = computed(() => vmsByHost.value.get(host.id) ?? [])

const cpusCount = computed(() => host.cpus.cores)

const vCpusCount = useArrayReduce(
  hostVms,
  (total, vm) => {
    if (vm.power_state !== VM_POWER_STATE.RUNNING && vm.power_state !== VM_POWER_STATE.PAUSED) {
      return total
    }

    return total + vm.CPUs.number
  },
  0
)
</script>

<style lang="postcss" scoped>
.host-dashboard-cpu-provisioning {
  .total {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-block-start: auto;
  }
}
</style>
