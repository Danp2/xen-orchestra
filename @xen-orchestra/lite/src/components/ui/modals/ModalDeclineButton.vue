<template>
  <UiButton size="medium" color="normal" level="secondary" :busy="modal.isBusy" @click="modal.decline()">
    <slot>{{ $t('cancel') }}</slot>
  </UiButton>
</template>

<script lang="ts" setup>
import { IK_MODAL } from '@/types/injection-keys'
import UiButton from '@core/components/button/UiButton.vue'
import { inject } from 'vue'

const modal = inject(IK_MODAL)!
</script>
