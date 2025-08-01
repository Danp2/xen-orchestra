<template>
  <VtsLoadingHero v-if="!isReady" type="page" />
  <UiCard v-else class="hosts">
    <div class="pagination-container">
      <!-- TODO: update with item selection button when available -->
      <p class="typo-body-regular-small count">{{ t('n-hosts', { n: hosts.length }) }}</p>
      <UiTablePagination v-if="isReady" v-bind="paginationBindings" />
    </div>
    <VtsTable vertical-border>
      <thead>
        <tr>
          <ColumnTitle id="host" :icon="faServer">{{ t('host') }}</ColumnTitle>
          <ColumnTitle id="description" :icon="faAlignLeft">{{ t('host-description') }}</ColumnTitle>
        </tr>
      </thead>
      <tbody>
        <tr v-for="host in hostsRecords" :key="host.id">
          <VtsCellObject :id="host.data.id">
            <UiObjectLink :route="`/host/${host.data.id}`">
              <template #icon>
                <UiObjectIcon
                  size="medium"
                  type="host"
                  :state="host.data.power_state.toLocaleLowerCase() as HostState"
                />
              </template>
              {{ host.data.name_label }}
            </UiObjectLink>
          </VtsCellObject>
          <VtsCellText>{{ host.data.name_description }}</VtsCellText>
        </tr>
      </tbody>
    </VtsTable>
    <div class="pagination-container">
      <!-- TODO: update with item selection button when available -->
      <p class="typo-body-regular-small count">{{ t('n-hosts', { n: hosts.length }) }}</p>
      <UiTablePagination v-if="isReady" v-bind="paginationBindings" />
    </div>
  </UiCard>
</template>

<script lang="ts" setup>
import { useHostStore } from '@/stores/xo-rest-api/host.store'
import type { XoPool } from '@/types/xo/pool.type'
import type { HostState } from '@core/types/object-icon.type'
import VtsCellObject from '@core/components/cell-object/VtsCellObject.vue'
import VtsCellText from '@core/components/cell-text/VtsCellText.vue'
import VtsLoadingHero from '@core/components/state-hero/VtsLoadingHero.vue'
import ColumnTitle from '@core/components/table/ColumnTitle.vue'
import VtsTable from '@core/components/table/VtsTable.vue'
import UiCard from '@core/components/ui/card/UiCard.vue'
import UiObjectIcon from '@core/components/ui/object-icon/UiObjectIcon.vue'
import UiObjectLink from '@core/components/ui/object-link/UiObjectLink.vue'
import UiTablePagination from '@core/components/ui/table-pagination/UiTablePagination.vue'
import { usePagination } from '@core/composables/pagination.composable'
import { defineTree } from '@core/composables/tree/define-tree'
import { useTree } from '@core/composables/tree.composable'
import { faAlignLeft, faServer } from '@fortawesome/free-solid-svg-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  pool: XoPool
}>()

const { t } = useI18n()

const { isReady, hostsByPool } = useHostStore().subscribe()

const definitions = computed(() =>
  defineTree(hostsByPool.value.get(props.pool.id) ?? [], {
    getLabel: 'name_label',
  })
)

const { nodes: hosts } = useTree(definitions)
const { pageRecords: hostsRecords, paginationBindings } = usePagination('hosts', hosts)
</script>

<style lang="postcss" scoped>
.hosts {
  margin: 1rem;
  gap: 0.8rem;
}

.count {
  color: var(--color-neutral-txt-secondary);
  text-transform: lowercase;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .count {
    color: var(--color-neutral-txt-secondary);
  }
}
</style>
