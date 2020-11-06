<template>
  <div class="item">
    <text-input
      :id="`item_title_${item.id}`"
      label="Item title"
      v-model="name"
    />
    <text-area
      :id="`item_desc_${item.id}`"
      label="Description"
      v-model="description"
      class="textarea"
    />
    <div class="button-row">
      <secondary-button v-on:click="deleteItem">
        <delete-icon /><span>delete</span>
      </secondary-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore, EditActions } from '@/store';
import { EditItem } from '@/store/modules/edit/state';
import SecondaryButton from '@/components/general/SecondaryButton.vue';
import TextInput from '@/components/general/TextInput.vue';
import TextArea from '@/components/general/TextArea.vue';
import DeleteIcon from '@/assets/icons/DeleteIcon.vue';

export default defineComponent({
  name: 'ChecklistItem',
  components: {
    SecondaryButton,
    TextInput,
    TextArea,
    DeleteIcon
  },
  props: {
    item: {
      type: Object as () => EditItem,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const name = computed({
      get: () => props.item.name,
      set: text =>
        store.dispatch(EditActions.EDIT_TITLE, {
          item: props.item,
          title: text
        })
    });
    const description = computed({
      get: () => props.item.description,
      set: text =>
        store.dispatch(EditActions.EDIT_DESCRIPTION, {
          item: props.item,
          description: text
        })
    });

    function deleteItem() {
      store.dispatch(EditActions.REMOVE_ITEM, props.item);
    }

    return {
      name,
      description,
      deleteItem
    };
  }
});
</script>

<style lang="scss" scoped>
.item {
  &:not(:last-child) {
    margin-bottom: var(--spacing-2);
  }

  .textarea {
    margin-bottom: var(--spacing-1);
  }

  .button-row {
    margin-left: calc(-1 * var(--spacing-2));
  }
}
</style>
