<template>
  <div class="list-wrapper">
    <template v-if="items">
      <checklist-item
        v-for="item in orderedItems"
        :key="item.id"
        :item="item"
        @check="handleItemChecked"
      />
    </template>
    <template v-else>
      <skeleton-checklist-item />
      <skeleton-checklist-item />
      <skeleton-checklist-item />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed } from 'vue';

import ChecklistItem from './ChecklistItem.vue';
import SkeletonChecklistItem from '@/components/common/SkeletonChecklistItem.vue';
import {
  ChecklistItem as IChecklistItem,
  ByIdMap
} from '@/store/modules/content/state';
import { useStore, ContentActions } from '@/store';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    ChecklistItem,
    SkeletonChecklistItem
  },
  props: {
    items: {
      type: Object as () => ByIdMap<IChecklistItem>,
      default: undefined
    },
    checklistId: {
      type: String,
      required: true
    },
    inProgressId: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const localItems = ref(props.items);

    watchEffect(() => (localItems.value = props.items));

    const handleItemChecked = async (id: string, done: boolean) => {
      localItems.value = {
        ...localItems.value,
        [id]: { ...localItems.value[id], done }
      };
      store
        .dispatch(ContentActions.MARK_ITEM, {
          checklistId: props.checklistId,
          inProgressId: props.inProgressId,
          itemId: id,
          done
        })
        .then(newId => {
          if (!props.inProgressId && newId)
            router.replace(`/checklist/${props.checklistId}/${newId}`);
        });
    };

    const orderedItems = computed(() =>
      Object.values(localItems.value).sort((a, b) => a.order - b.order)
    );

    return {
      orderedItems,
      handleItemChecked
    };
  }
});
</script>

<style lang="scss" scoped>
.list-wrapper {
  & > *:not(:last-child) {
    margin-bottom: var(--spacing-2-5);
  }
}
</style>
