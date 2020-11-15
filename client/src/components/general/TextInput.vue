<template>
  <form-field :id="id" :label="label">
    <input
      :type="type"
      :id="id"
      :value="modelValue"
      @input="handleChange"
      v-bind="$attrs"
    />
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
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: undefined
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  setup(props, { emit }) {
    const handleChange = (e: InputEvent) => {
      emit('update:modelValue', (e.target as HTMLInputElement).value);
    };

    return {
      handleChange
    };
  }
});
</script>

<style lang="scss" scoped>
input {
  background: none;
  color: var(--color-text);
  border-style: none;
  border-bottom: 1px solid var(--color-background-grey);
  font-size: var(--font-size-text);
  transition: border-color 0.2s;
  max-width: 240px;

  &:focus {
    outline: none;
    border-bottom-color: var(--color-text);
  }
}
</style>
