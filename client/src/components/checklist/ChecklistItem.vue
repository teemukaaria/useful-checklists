<template>
  <div
    :class="{ 'checklist-item-wrapper': true, done, [modification]: true }"
    role="checkbox"
    :aria-checked="done"
    tabindex="0"
    @click="handleToggle"
    @keyup.space="handleToggle"
    :ref="e => (rootRef = e)"
  >
    <checkbox class="checkbox" :modelValue="done" static />
    <div class="text-wrapper">
      <div class="title-row">
        <h6>{{ item.name }}</h6>
        <span class="modification" />
      </div>
      <p class="typography--body" v-if="item.description">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

import { ChecklistItem } from '@/store/modules/content/state';
import Checkbox from '@/components/general/Checkbox.vue';
import { useBlurOnClick } from '@/utils/ui.utils';

export default defineComponent({
  components: {
    Checkbox
  },
  props: {
    item: {
      type: Object as () => ChecklistItem,
      required: true
    },
    modification: {
      type: String,
      default: undefined
    }
  },
  setup(props, { emit }) {
    const done = computed(() => props.item.done);
    const rootRef = ref<HTMLDivElement | null>(null);

    useBlurOnClick(rootRef);

    const handleToggle = () => {
      emit('check', props.item.id, !done.value);
    };

    return {
      done,
      handleToggle,
      rootRef
    };
  }
});
</script>

<style lang="scss" scoped>
.checklist-item-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;

  .checkbox {
    flex-shrink: 0;
    align-self: flex-start;
    margin: var(--spacing-1) var(--spacing-1-5) var(--spacing-1) 0;
  }

  .title-row {
    display: flex;
    align-items: baseline;
  }

  p {
    margin-top: var(--spacing-1);
  }

  &.done,
  &.delete {
    h6,
    p {
      transition: opacity 0.2s;
      opacity: 0.5;
      text-decoration: line-through;
    }
  }

  .modification::after {
    color: var(--color);
    margin-left: var(--spacing-1);
    font-size: var(--font-size-small);
  }
  &.delete .modification::after {
    content: 'Removed';
  }
  &.update .modification::after {
    content: 'Modified';
  }
  &.create .modification::after {
    content: 'New';
  }
}
</style>
