<template>
  <div class="checklist-header card" v-if="checklist">
    <div class="bar">
      <h2>{{ checklist.name }}</h2>
      <p class="contributors">
        {{ checklist.collaborators.length }} contributors
      </p>
    </div>
    <p class="typography--body desc" v-if="checklist.description">
      {{ checklist.description }}
    </p>
    <div class="bar">
      <primary-button class="button--like" variant="text">
        <like-icon /><span>{{ checklist.likes }}</span>
      </primary-button>
      <div class="bar">
        <primary-button class="button--bookmark">
          <bookmark-icon />
        </primary-button>
        <router-link :to="`/checklist/create?copy=${checklist.id}`">
          <primary-button>
            copy
          </primary-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Checklist } from '@/store/modules/content/state';
import PrimaryButton from '@/components/general/PrimaryButton.vue';
import LikeIcon from '@/assets/icons/LikeIcon.vue';
import BookmarkIcon from '@/assets/icons/BookmarkIcon.vue';

export default defineComponent({
  components: {
    PrimaryButton,
    LikeIcon,
    BookmarkIcon
  },
  props: {
    checklist: {
      type: Object as () => Checklist,
      required: true
    }
  },
  setup() {}
});
</script>

<style lang="scss" scoped>
.checklist-header {
  padding-bottom: var(--spacing-1);

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: var(--spacing-1-5);
    }

    .contributors {
      font-size: var(--font-size-small);
      opacity: 0.5;
    }
  }

  .desc {
    margin-bottom: var(--spacing-2);
  }

  .button--like {
    margin-left: calc(-1 * var(--spacing-2));
  }
  .button--bookmark {
    padding-left: var(--spacing-1);
    padding-right: var(--spacing-1);
    margin-right: var(--spacing-1);
  }
}
</style>
