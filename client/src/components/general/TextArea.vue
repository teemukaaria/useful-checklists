<template>
  <form-field :id="id" :label="label">
    <textarea :id="id" :value="modelValue" @input="handleChange" />
  </form-field>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormField from './FormField.vue';

export default defineComponent({
  components: {
    FormField
  },
  props: {
    modelValue: {
      type: String
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: undefined
    }
  },
  setup(props, { emit }) {
    const handleChange = (e: InputEvent) => {
      emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
    };

    return {
      handleChange
    };
  }
});
</script>

<style lang="scss" scoped>
textarea {
  background: var(--color-background-grey);
  color: var(--color-text);
  width: 100%;
  resize: none;
  min-height: 6em;
  border: none;
  border-radius: var(--spacing-0-5);
  padding: var(--spacing-1);
  font-size: var(--font-size-small);
  font-family: inherit;
}
</style>
