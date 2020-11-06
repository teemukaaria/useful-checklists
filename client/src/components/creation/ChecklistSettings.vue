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
    <form-field id="" label="Status">
      <span class="row">
        <input
          type="radio"
          id="private"
          name="status"
          value="private"
          v-model="status"
        />
        <div class="radiobox" />
        <label for="private" class="radio-label">Private</label>
        <span class="space" />
        <input
          type="radio"
          id="public"
          name="status"
          value="public"
          v-model="status"
        />
        <div class="radiobox" />
        <label for="public" class="radio-label">Public</label>
      </span>
    </form-field>
    <span class="button-row">
      <secondary-button v-on:click="cancel">cancel</secondary-button>
      <div class="panel">
        <span class="items-label">{{ itemCount }} items</span>
        <primary-button v-on:click="create">create</primary-button>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore, EditActions } from '@/store';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/general/PrimaryButton.vue';
import TextInput from '@/components/general/TextInput.vue';
import TextArea from '@/components/general/TextArea.vue';
import FormField from '@/components/general/FormField.vue';
import SecondaryButton from '@/components/general/SecondaryButton.vue';
import firebase from 'firebase';

export default defineComponent({
  name: 'ChecklistSettings',
  components: {
    PrimaryButton,
    SecondaryButton,
    TextInput,
    TextArea,
    FormField
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

    async function create() {
      const items = Object.values(store.state.edit.editItemsById);

      const res = await firebase
        .firestore()
        .collection('checklists')
        .add({
          name: store.state.edit.title,
          category: store.state.edit.category,
          description: store.state.edit.description,
          item_count: items.length,
          owner: store.state.app.user ? store.state.app.user.id : '',
          collaborators: [],
          likes: 0,
          private: store.state.edit.private,
          original: store.state.edit.original ? store.state.edit.original : ''
        })
        .then(document => {
          const db = firebase.firestore();
          const batch = db.batch();

          items.forEach(item => {
            const docRef = document.collection('items').add({});
            batch.set(docRef, {
              name: item.name ? item.name : '',
              description: item.description ? item.description : '',
              order: item.order
            });
          });

          batch.commit().then(
            value => {
              router.replace('/checklist/' + document.id);
            },
            reason => {
              alert('Failed to create checklist items, reason: ' + reason);
            }
          );
        });
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
      cancel
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
  display: flex;
  align-items: center;

  .radio-label {
    color: var(--color-text);
    font-size: var(--font-size-small);
    width: 100px;
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
