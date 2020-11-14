<template>
  <div class="card suggestion-header">
    <div class="title-row">
      <h4>{{ checklist.name }}</h4>
      <span v-if="modified" class="modification">
        Modified
      </span>
    </div>
    <p class="typography--body">{{ checklist.description }}</p>
    <div class="button-row">
      <secondary-button @click="handleRejectClick">
        reject
      </secondary-button>
      <primary-button @click="handleApproveClick">
        approve
      </primary-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SecondaryButton from '@/components/general/SecondaryButton.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue';

export default defineComponent({
  components: {
    SecondaryButton,
    PrimaryButton
  },
  props: {
    checklist: {
      type: Object as () => { name: string; description: string },
      required: true
    },
    modified: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const handleRejectClick = () => {
      emit('reject');
    };

    const handleApproveClick = () => {
      emit('approve');
    };

    return {
      handleRejectClick,
      handleApproveClick
    };
  }
});
</script>

<style lang="scss" scoped>
.suggestion-header {
  .title-row {
    display: flex;
    align-items: baseline;
    margin-bottom: var(--spacing-1-5);

    .modification {
      margin-left: var(--spacing-1);
      color: var(--color);
      font-size: var(--font-size-text);
    }
  }

  p {
    margin-bottom: var(--spacing-2);
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
    margin-bottom: calc(-1 * var(--spacing-1));
  }
}
</style>
