<template>
  <UiCard :horizontal="!uiStore.isMobile">
    <BackupRepository :repositories="backupRepositories" />
    <VtsDivider type="stretch" />
    <StorageRepository :repositories="storageRepositories" />
    <VtsDivider type="stretch" />
    <S3BackupRepository :size="s3Size" />
  </UiCard>
</template>

<script lang="ts" setup>
import BackupRepository from '@/components/site/dashboard/BackupRepository.vue'
import S3BackupRepository from '@/components/site/dashboard/S3BackupRepository.vue'
import StorageRepository from '@/components/site/dashboard/StorageRepository.vue'
import type { BackupRepositories, StorageRepositories } from '@/requests/use-site-dashboard.request.ts'
import type { XoDashboard } from '@/types/xo/dashboard.type.ts'
import VtsDivider from '@core/components/divider/VtsDivider.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import { useUiStore } from '@core/stores/ui.store'

const { backupRepositories, storageRepositories } = defineProps<{
  s3Size: NonNullable<XoDashboard['backupRepositories']>['s3']['size'] | undefined
  backupRepositories: BackupRepositories | undefined
  storageRepositories: StorageRepositories | undefined
}>()

const uiStore = useUiStore()
</script>
