<!-- v1 -->
<template>
  <li class="ui-alarm-item" :class="className">
    <div class="content">
      <div class="label-percent typo-body-regular text-ellipsis">
        <UiButtonIcon
          v-if="description"
          :icon="isDescriptionVisible ? faAngleDown : faAngleRight"
          size="small"
          accent="brand"
          :target-scale="2"
          @click="toggleDescription()"
        />
        <span v-tooltip class="label text-ellipsis">
          {{ label }}
        </span>
        <span class="percent">{{ percent ? t('n-percent', percent) : '' }}</span>
      </div>
      <div class="info typo-body-regular-small text-ellipsis">
        <div v-if="slots.link" class="link-container">
          {{ t('on-object') }}
          <span v-tooltip class="object-link text-ellipsis">
            <slot name="link" />
          </span>
          <span class="interpunct" />
        </div>
        <span>{{ timeAgo }}</span>
      </div>
    </div>
    <div v-if="isDescriptionVisible" class="description">
      {{ description }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import UiButtonIcon from '@core/components/ui/button-icon/UiButtonIcon.vue'
import { useTimeAgo } from '@core/composables/locale-time-ago.composable.ts'
import { vTooltip } from '@core/directives/tooltip.directive'
import { toVariants } from '@core/utils/to-variants.util'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useToggle } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { date, size } = defineProps<{
  date: Date | number | string
  label: string
  size: 'small' | 'large'
  percent: number
  description?: string
}>()

const slots = defineSlots<{
  link?(): any
}>()

const timeAgo = useTimeAgo(() => date)

const { t } = useI18n()

const className = computed(() => toVariants({ size }))

const [isDescriptionVisible, toggleDescription] = useToggle(false)
</script>

<style scoped lang="postcss">
.ui-alarm-item {
  display: flex;
  flex-direction: column;
  padding: 0.8rem 1.2rem;
  border-bottom: 0.1rem solid var(--color-neutral-border);
  color: var(--color-neutral-txt-primary);

  &:last-child {
    border-bottom: none;
  }

  .content {
    display: flex;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .label-percent {
    gap: 1.6rem;
  }

  .info,
  .link-container,
  .label-percent {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .percent {
    color: var(--color-danger-txt-base);
  }

  .info,
  .link-container {
    gap: 0.8rem;
    white-space: nowrap;
    min-width: 10rem;
  }

  .interpunct::before {
    content: '•';
  }

  .info > :not(.object-link),
  .description {
    color: var(--color-neutral-txt-secondary);
  }

  &.size--large {
    gap: 0.8rem;

    .content {
      flex-direction: row;
    }
  }

  &.size--small {
    gap: 0.4rem;

    .content {
      flex-direction: column;
    }
  }
}
</style>
