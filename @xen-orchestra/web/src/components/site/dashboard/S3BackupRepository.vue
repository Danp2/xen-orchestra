<template>
  <div class="s3-backup-repository">
    <UiCardTitle>
      {{ t('s3-backup-repository') }}
      <template #description>{{ t('for-backup') }}</template>
    </UiCardTitle>
    <!--    TODO change and add loading when we have isReady available -->
    <VtsNoDataHero v-if="!areS3BackupRepositoriesReady" type="card" />
    <UiCardNumbers v-else :value="usedSize?.value" :unit="usedSize?.prefix" :label="t('used')" size="medium" />
  </div>
</template>

<script setup lang="ts">
import type { XoDashboard } from '@/types/xo/dashboard.type.ts'
import VtsNoDataHero from '@core/components/state-hero/VtsNoDataHero.vue'
import UiCardNumbers from '@core/components/ui/card-numbers/UiCardNumbers.vue'
import UiCardTitle from '@core/components/ui/card-title/UiCardTitle.vue'
import { formatSizeRaw } from '@core/utils/size.util'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { size } = defineProps<{
  size: NonNullable<XoDashboard['backupRepositories']>['s3']['size'] | undefined
}>()

const { t } = useI18n()

const areS3BackupRepositoriesReady = computed(() => size !== undefined)

const usedSize = computed(() => formatSizeRaw(size?.backups, 1))
</script>

<style scoped lang="postcss">
.s3-backup-repository {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  flex: 1;
}
</style>
