<template>
  <div class="card checklist-settings">
    <span class="bar">
      <h4>Create a checklist</h4>
    </span>
    <text-input id="title" label="Title" v-model="title" />
    <form-field id="category" label="Category">
      <span class="select" style="width: 65%">
        <div class="pimple" />
        <select
          name="category"
          id="category"
          class="select"
          style="width: 100%"
          v-model="category"
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            >{{ category.name }}</option
          >
        </select>
      </span>
    </form-field>
    <text-area id="description" label="Description" v-model="description" />
    <form-field id="" :label="copy ? 'Use' : 'Status'">
      <span class="row">
        <span class="radio-field">
          <input
            type="radio"
            id="private"
            name="status"
            value="private"
            v-model="use"
          />
          <div class="radiobox" />
          <label for="private" class="radio-label">
            {{ copy ? 'Create a private copy' : 'Private' }}
          </label>
        </span>
        <span class="radio-field">
          <input
            type="radio"
            id="public"
            name="status"
            value="public"
            v-model="use"
          />
          <div class="radiobox" />
          <label for="public" class="radio-label">
            {{ copy ? 'Publish a copy' : 'Public' }}
          </label>
        </span>
        <span class="radio-field" v-if="copy">
          <input
            type="radio"
            id="suggestion"
            name="status"
            value="suggestion"
            v-model="use"
          />
          <div class="radiobox" />
          <label for="suggestion" class="radio-label">Suggest an edit</label>
        </span>
      </span>
    </form-field>
    <span class="button-row">
      <secondary-button v-on:click="cancel">cancel</secondary-button>
      <div class="panel">
        <span class="items-label">{{ itemCount }} items</span>
        <primary-button v-on:click="create">{{
          use === 'private'
            ? 'create'
            : use === 'public'
            ? 'publish'
            : use === 'suggestion'
            ? 'suggest'
            : 'copy'
        }}</primary-button>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore, EditActions } from '@/store';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/general/PrimaryButton.vue';
import TextInput from '@/components/general/TextInput.vue';
import TextArea from '@/components/general/TextArea.vue';
import FormField from '@/components/general/FormField.vue';
import SecondaryButton from '@/components/general/SecondaryButton.vue';

export default defineComponent({
  name: 'ChecklistSettings',
  components: {
    PrimaryButton,
    SecondaryButton,
    TextInput,
    TextArea,
    FormField
  },
  props: {
    copy: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const title = computed({
      get: () => store.state.edit.title,
      set: text => store.dispatch(EditActions.SET_TITLE, text)
    });
    const color = computed(() => {
      const c = store.state.content.categories.byId[store.state.edit.category];

      if (c) {
        return c.color;
      } else {
        return undefined;
      }
    });
    const category = computed({
      get: () => store.state.edit.category,
      set: text => store.dispatch(EditActions.SET_CATEGORY, text)
    });
    const description = computed({
      get: () => store.state.edit.description,
      set: text => store.dispatch(EditActions.SET_DESCRIPTION, text)
    });
    const categories = computed(() =>
      Object.values(store.state.content.categories.byId)
    );
    const itemCount = computed(
      () => Object.values(store.state.edit.editItemsById).length
    );
    const status = computed({
      get: () => (store.state.edit.private ? 'private' : 'public'),
      set: text => store.dispatch(EditActions.SET_PRIVATE, text === 'private')
    });
    const useRef = ref<'private' | 'public' | 'suggestion'>('private');
    const use = computed({
      get: () => useRef.value,
      set: text => {
        useRef.value = text;
        store.dispatch(EditActions.SET_PRIVATE, text === 'private');
      }
    });

    async function create() {
      if (use.value !== 'suggestion') {
        const listId = await store.dispatch(EditActions.PUBLISH, undefined);
        router.replace('/checklist/' + listId);
      } else {
        // TODO: create a suggestion
      }
    }

    function cancel() {
      router.back();
    }

    return {
      title,
      color,
      category,
      description,
      categories,
      itemCount,
      status,
      create,
      cancel,
      use
    };
  }
});
</script>

<style lang="scss" scoped>
.checklist-settings {
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-1);
}

.bar {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-1-5);

  h4 {
    flex: 1;
  }
}

.select {
  background: var(--color-background-grey);
  color: var(--color-text);
  border: none;
  border-radius: 100px;
  padding: var(--spacing-0-5);
  display: flex;
  align-items: center;

  .pimple {
    --width: var(--font-size-xsmall);
    --height: var(--font-size-xsmall);
    margin-left: var(--spacing-1);
  }

  select {
    font-size: var(--font-size-small);
    margin-right: var(--spacing-1);
  }
}

.row {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;

  .radio-field {
    display: flex;
    align-items: center;
  }

  .radio-label {
    color: var(--color-text);
    font-size: var(--font-size-small);
    line-height: 1;
  }

  .radiobox {
    width: var(--spacing-1-5);
    height: var(--spacing-1-5);
    border: 2px solid var(--color-text);
    border-radius: 100%;
    position: relative;
    margin-right: var(--spacing-1);
  }
  input[type='radio'] {
    width: 1px;
    height: 1px;
    opacity: 0;

    &:focus {
      outline: none;
      & + .radiobox {
        outline: 1px solid white;
        outline: -webkit-focus-ring-color auto 1px;
      }
    }
    &:checked + .radiobox {
      &::after {
        content: '';
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        position: absolute;
        background-color: var(--color-text);
        border-radius: 100%;
      }
    }
  }
}

.button-row {
  margin-top: var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: calc(-1 * var(--spacing-2));

  .panel {
    display: flex;
    align-items: center;
  }
}

.space {
  width: var(--spacing-1-5);
}

.items-label {
  margin-left: var(--spacing-1);
  margin-right: var(--spacing-1);
  color: var(--color);
  font-size: var(--font-size-small);
}
</style>
