<template>
  <header>
    <h1 :class="{ centered: !user }">
      <router-link to="/">
        Useful checklists
      </router-link>
    </h1>
    <div class="actions-wrapper" v-if="user">
      <router-link to="/checklist/create">
        <add-checklist-icon class="icon" aria-label="add checklist" />
      </router-link>
      <router-link to="/profile">
        <profile-icon :image="user.image" />
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import ProfileIcon from '@/components/app/ProfileIcon.vue';
import AddChecklistIcon from '@/assets/icons/AddChecklistIcon.vue';
import { useStore } from '@/store';

export default defineComponent({
  components: {
    AddChecklistIcon,
    ProfileIcon
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.app.user);

    return {
      user
    };
  }
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  padding: var(--spacing-2) 0 var(--spacing-4) 0;
  width: 100%;
  background: var(--color-background);

  h1 {
    flex: 1;
    opacity: 0.21;

    a {
      color: var(--color-text);
    }

    &.centered {
      text-align: center;
    }
  }

  .actions-wrapper {
    display: flex;
    align-items: center;

    a {
      & > *:not(svg) {
        height: var(--size-icon);
        width: var(--size-icon);
      }

      &:not(:last-child) {
        margin-right: var(--spacing-1-5);
      }
    }
  }
}
</style>
