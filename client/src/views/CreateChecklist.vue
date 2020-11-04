<template>
  <div class="page">
    <checklist-settings/>
    <div class="items" v-if="items.length">
      <checklist-item v-for="item in items" v-bind:key="item.id" :item="item" :color="color"/>
    </div>
    <primary-button :style="{ '--color': color, 'margin-left': 'auto', 'margin-right': 'auto', 'margin-top': 'var(--spacing-2-5)' }" v-on:click="add">+ add an item</primary-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore, EditActions } from '@/store';
import ChecklistSettings from '@/components/creation/ChecklistSettings.vue';
import ChecklistItem from '@/components/creation/ChecklistItem.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue'
import { EditItem } from '@/store/modules/edit/state';

export default defineComponent({
  name: 'CreateChecklist',
  components: {
    ChecklistSettings,
    ChecklistItem,
    PrimaryButton
  },
  setup() {

    const { query } = useRoute();
    const category = query.category as string;
    const copy = query.copy as string;

    const store = useStore();
    const items = computed(() => Object.values(store.state.edit.editItemsById));
    const color = computed(() => {
      const c = store.state.content.categories.byId[store.state.edit.category];

      if (c) {
        return c.color;
      } else {
        return undefined;
      }
    });

    function add() {
      const count = Object.values(store.state.edit.editItemsById).length

      const item: EditItem = {
        id: Date.now().toString(),
        order: count
      }

      store.dispatch(EditActions.ADD_ITEM, item);
    }

    const checklists = computed(() => store.state.content.checklists);
    const categories = computed(() => store.state.content.categories);
    watch(
      [checklists, categories],
      () => {
        if (categories.value.status === 'done' && checklists.value.status === 'done' && copy && store.state.content.checklists.byId[copy]) {
          const checklist = store.state.content.checklists.byId[copy];

          const editItems: EditItem[] = [];

          if (checklist.items) {
            for (let item of checklist.items) {
              editItems.push({
                id: item.id,
                name: item.name,
                description: item.description,
                order: item.order
              });
            }
          }

          store.dispatch(EditActions.SET_CATEGORY, checklist.category);
          store.dispatch(EditActions.SET_TITLE, checklist.name);
          store.dispatch(EditActions.SET_DESCRIPTION, checklist.description);
          store.dispatch(EditActions.SET_PRIVATE, true);
          store.dispatch(EditActions.SET_ITEMS, editItems);
          store.dispatch(EditActions.SET_ORIGINAL, copy);

        } else if (categories.value.status === 'done') {
          
          if (category && store.state.content.categories.byId[category]) {
            store.dispatch(EditActions.SET_CATEGORY, category);
          } else {
            store.dispatch(EditActions.SET_CATEGORY, Object.values(store.state.content.categories.byId)[0].id);
          }

          store.dispatch(EditActions.SET_TITLE, "");
          store.dispatch(EditActions.SET_DESCRIPTION, "");
          store.dispatch(EditActions.SET_PRIVATE, false);
          store.dispatch(EditActions.SET_ITEMS, []);
        }
      },
      { immediate: true }
    );

    return {
      color,
      items,
      add
    }
  }
});
</script>

<style lang="scss" scoped>
.category-view {
  .section {
    &:not(:last-child) {
      margin-bottom: var(--spacing-2);
    }
  }
}
</style>