<template>
  <UiCard>
    <CardTitle>
      {{ $t('backup-issues') }}
      <VtsCounter :value="backupIssues.length" accent="danger" size="medium" variant="primary" />
      <template #description>{{ $t('in-last-three-jobs') }}</template>
    </CardTitle>
    <LoadingHero :disabled="isReady" type="card">
      <NoDataHero v-if="!hasBackupIssues" type="card" />
      <div v-else class="backup-items">
        <BackupItem v-for="(coreBackupIssue, index) in coreBackupIssues" :key="index" :backup="coreBackupIssue" />
      </div>
    </LoadingHero>
  </UiCard>
</template>

<script lang="ts" setup>
import { useDashboardStore } from '@/stores/xo-rest-api/dashboard.store'
import { convertBackupIssueToCore } from '@/utils/convert-backup-issue-to-core.util'
import BackupItem from '@core/components/backup-item/BackupItem.vue'
import CardTitle from '@core/components/card/CardTitle.vue'
import VtsCounter from '@core/components/counter/VtsCounter.vue'
import LoadingHero from '@core/components/state-hero/LoadingHero.vue'
import NoDataHero from '@core/components/state-hero/NoDataHero.vue'
import UiCard from '@core/components/UiCard.vue'
import { computed } from 'vue'

const { backupIssues, isReady } = useDashboardStore().subscribe()

const hasBackupIssues = computed(() => backupIssues.value.length !== 0)

const coreBackupIssues = computed(() => backupIssues.value.map(convertBackupIssueToCore))
</script>

<style lang="postcss" scoped>
.backup-items {
  max-height: 30rem;
  overflow-y: auto;
  margin-inline: -2.4rem;
  margin-block-end: -2.4rem;
}
</style>
