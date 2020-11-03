<template>
  <div class="card">
    <span class="bar">
      <h4>Create a checklist</h4>
    </span>
    <div class="form-group">
      <label for="title" class="group-label">Title</label>
      <input type="text" id="title" name="title" class="text-field" style="width: 75%" v-model="title">
    </div>
    <div class="form-group">
      <label for="category" class="group-label">Category</label>
      <span class="select" style="width: 65%">
        <div v-if="color" class="pimple" :style="{ '--color': color, '--width': 'var(--font-size-xsmall)', '--height': 'var(--font-size-xsmall)', 'margin-left': 'var(--spacing-1)'}"/>
        <select name="category" id="category" class="select" style="width: 100%" v-model="category">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </span>
    </div>
    <div class="form-group">
      <label for="description" class="group-label">Description</label>
      <textarea name="description" id="description" class="text-area" v-model="description"/>
    </div>
    <div class="form-group">
      <label class="group-label">Status</label>
      <span class="row">
        <input type="radio" id="private" name="status" value="private" v-model="status">
        <label for="private" class="radio-label">Private</label>
        <span class="space"/>
        <input type="radio" id="public" name="status" value="public" v-model="status">
        <label for="public" class="radio-label">Public</label>
      </span>
    </div>
    <span class="button-row">
      <secondary-button :style="{ '--color': color, 'flex': 'auto' }" v-on:click="cancel">cancel</secondary-button>
      <span class="items-label" :style="{ '--color': color }">{{ itemCount }} items</span>
      <primary-button :style="{ '--color': color }" v-on:click="create">create</primary-button>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore, EditActions } from '@/store';
import { Category } from '@/store/modules/content/state';
import { EditItem } from '@/store/modules/edit/state';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/general/PrimaryButton.vue'
import SecondaryButton from '@/components/general/SecondaryButton.vue'
import firebase from 'firebase';

export default defineComponent({
  name: 'ChecklistSettings',
  components: {
    PrimaryButton,
    SecondaryButton
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const title = computed({
      get: () => store.state.edit.title,
      set: (text) => store.dispatch(EditActions.SET_TITLE, text)
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
      set: (text) => store.dispatch(EditActions.SET_CATEGORY, text)
    });
    const description = computed({
      get: () => store.state.edit.description,
      set: (text) => store.dispatch(EditActions.SET_DESCRIPTION, text)
    });
    const categories = computed(() => Object.values(store.state.content.categories.byId));
    const itemCount = computed(() => Object.values(store.state.edit.editItemsById).length);
    const status = computed({
      get: () => store.state.edit.private ? 'private' : 'public',
      set: (text) => store.dispatch(EditActions.SET_PRIVATE, text === 'private')
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
                            owner: store.state.app.user ? store.state.app.user.id : "",
                            collaborators: [],
                            likes: 0,
                            private: store.state.edit.private,
                            original: ""
                          }).then(document => {
                            
                            const db = firebase.firestore();
                            const batch = db.batch();

                            items.forEach((item) => {
                              const docRef = document.collection('items').doc();
                              batch.set(docRef, {
                                name: item.name ? item.name : "",
                                description: item.description ? item.description : "",
                                order: item.order
                              });
                            });

                            batch.commit().then((value) => {
                              router.replace('/checklist/' + document.id)
                            }, (reason) => {
                              alert('Failed to create checklist items, reason: ' + reason);
                            });
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
  .bar {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-1-5);

    h4 {
      flex: 1;
    }
  }

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

    .select {
      background: var(--color-background-grey);
      color: var(--color-text);
      border: none;
      border-radius: 100px;
      padding: var(--spacing-0-5);
      display: flex;
      align-items: center;
    }

    .row > * {
      &:not(:last-child) {
          margin-right: var(--spacing-0-5);
      }
      &:not(:first-child) {
          margin-left: var(--spacing-0-5);
      }

      vertical-align: middle;
    }
  }

  .button-row {
      margin-top: var(--spacing-2);
      display: flex;
      align-items: baseline;
    }

  .radio-label {
    color: var(--color-text);
    font-size: var(--font-size-xsmall);
  }

  .space {
      width: var(--spacing-1-5);
  }

  .items-label {
    margin-left: var(--spacing-1);
    margin-right: var(--spacing-1);
    color: var(--color);
    font-size: var(--font-size-xsmall);
  }

</style>
