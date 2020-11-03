<template>
  <div class="item">
    <div class="form-group">
      <label class="group-label">Item title</label>
      <input type="text" class="text-field" v-model="name" style="width: 75%">
    </div>
    <div class="form-group">
      <label class="group-label">Description</label>
      <textarea class="text-area" v-model="description"/>
    </div>
    <secondary-button :style="{ '--color': color, 'margin-top': 'var(--spacing-1)' }" v-on:click="deleteItem">delete</secondary-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, reactive } from 'vue';
import { useStore, EditActions } from '@/store';
import { EditItem } from '@/store/modules/edit/state';
import SecondaryButton from '@/components/general/SecondaryButton.vue'

export default defineComponent({
  name: 'ChecklistItem',
  components: {
    SecondaryButton
  },
  props: {
    item: {
      type: Object as () => EditItem,
      required: true
    },
    color: String
  },
  setup(props) {
    
    const store = useStore();
    const name = computed({
      get: () => props.item.name,
      set: (text) => store.dispatch(EditActions.EDIT_TITLE, {item: props.item, title: text})
    });
    const description = computed({
      get: () => props.item.description,
      set: (text) => store.dispatch(EditActions.EDIT_DESCRIPTION, {item: props.item, description: text})
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
    margin: var(--spacing-0-5);
    padding: var(--spacing-2);
    color: var(--color-text);

    .form-group {
      display: grid;
      margin-top: var(--spacing-0-5);
      margin-bottom: var(--spacing-0-5);

    .group-label {
      color: var(--color-text);
      font-size: var(--font-size-xsmall);
      opacity: 0.5;
      margin-bottom: var(--spacing-0-5);
      }
    }
  }

</style>