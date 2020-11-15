<template>
  <div class="page" :style="{ '--color': color }">
    <checklist-settings :copy="!!copy" :original="original" />
    <div class="items" v-if="items.length">
      <checklist-item v-for="item in items" v-bind:key="item.id" :item="item" />
    </div>
    <primary-button
      :style="{
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': 'var(--spacing-2-5)'
      }"
      v-on:click="add"
      >+ add an item</primary-button
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore, EditActions, ContentActions } from '@/store';
import ChecklistSettings from '@/components/creation/ChecklistSettings.vue';
import ChecklistItem from '@/components/creation/ChecklistItem.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue';
import { EditItem } from '@/store/modules/edit/state';

export default defineComponent({
  name: 'CreateChecklist',
  components: {
    ChecklistSettings,
    ChecklistItem,
    PrimaryButton
  },
  props: {
    copy: String
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const category = computed(() => route.query.category as string);
    const copy = computed(() => props.copy);
    const original = computed(() =>
      copy.value ? store.state.content.checklists.byId[copy.value] : undefined
    );
    const originalItems = computed(() =>
      copy.value
        ? store.state.content.itemsByChecklist.byId[copy.value]
        : undefined
    );

    watch(
      [copy],
      () => {
        if (copy.value)
          store.dispatch(ContentActions.FETCH_CHECKLIST, {
            checklistId: copy.value
          });
      },
      { immediate: true }
    );

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
      const count = Object.values(store.state.edit.editItemsById).length;

      const item: EditItem = {
        id: Date.now().toString(),
        name: '',
        description: '',
        order: count
      };

      store.dispatch(EditActions.ADD_ITEM, item);
    }

    const checklists = computed(() => store.state.content.checklists);
    const categories = computed(() => store.state.content.categories);
    watch(
      [copy, original, originalItems, categories],
      () => {
        if (
          copy.value &&
          original.value &&
          categories.value &&
          originalItems.value
        ) {
          const checklist = store.state.content.checklists.byId[copy.value];
          const checklistItems =
            store.state.content.itemsByChecklist.byId[copy.value];

          const editItems: EditItem[] = [];

          if (checklistItems) {
            for (const item of Object.values(checklistItems)) {
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
          store.dispatch(EditActions.SET_ORIGINAL, copy.value);
        } else if (!copy.value) {
          if (
            category.value &&
            store.state.content.categories.byId[category.value]
          ) {
            store.dispatch(EditActions.SET_CATEGORY, category.value);
          } else {
            store.dispatch(
              EditActions.SET_CATEGORY,
              Object.values(store.state.content.categories.byId)[0].id
            );
          }

          store.dispatch(EditActions.SET_TITLE, '');
          store.dispatch(EditActions.SET_DESCRIPTION, '');
          store.dispatch(EditActions.SET_PRIVATE, false);
          store.dispatch(EditActions.SET_ITEMS, []);
        }
      },
      { immediate: true }
    );

    return {
      color,
      items,
      add,
      original
    };
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
