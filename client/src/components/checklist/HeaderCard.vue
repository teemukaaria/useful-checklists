<template>
  <div class="checklist-header card" v-if="checklist">
    <div class="bar">
      <h2>{{ checklist.name }}</h2>
      <p v-if="!checklist.private" class="contributors">
        {{ checklist.collaborators.length }} contributors
      </p>
      <p v-else class="contributors">
        Private
      </p>
    </div>
    <p class="typography--body desc" v-if="checklist.description">
      {{ checklist.description }}
    </p>
    <div class="bar">
      <primary-button
        @click="handleLikeClick"
        class="button--like"
        variant="text"
      >
        <like-icon v-if="!liked" /><like-full-icon v-else /><span>{{
          checklist.likes
        }}</span>
      </primary-button>
      <div class="bar">
        <!-- <primary-button class="button--bookmark">
          <bookmark-icon />
        </primary-button> -->
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
import { defineComponent, computed } from 'vue';

import { Checklist } from '@/store/modules/content/state';
import PrimaryButton from '@/components/general/PrimaryButton.vue';
import LikeIcon from '@/assets/icons/LikeIcon.vue';
import LikeFullIcon from '@/assets/icons/LikeFullIcon.vue';
import BookmarkIcon from '@/assets/icons/BookmarkIcon.vue';
import { useStore, SuggestionActions } from '@/store';

export default defineComponent({
  components: {
    PrimaryButton,
    LikeIcon,
    LikeFullIcon
    // BookmarkIcon
  },
  props: {
    checklist: {
      type: Object as () => Checklist,
      required: true
    }
  },
  setup(props) {
    const store = useStore();

    const user = computed(() => store.state.app.user);
    const liked = computed(() =>
      (user.value?.liked || []).includes(props.checklist.id)
    );

    const handleLikeClick = () => {
      store.dispatch(SuggestionActions.LIKE_CHECKLIST, {
        checklistId: props.checklist.id,
        like: !liked.value
      });
    };

    return {
      liked,
      handleLikeClick
    };
  }
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
      white-space: nowrap;
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
