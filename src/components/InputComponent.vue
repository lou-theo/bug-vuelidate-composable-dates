<template>
  <div>
    <input
      :value="inputValue"
      :type="type"
      :disabled="disabled"
      @input="updateValue($event.target.value)"
    />
    <p v-for="(errorMessage, errorIndex) in errorMessages" :key="errorIndex">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useInput } from "@/components/input.composable";
import type { ValidationRule } from "@vuelidate/core";
import type { PropType } from "vue";
import { toRef } from "vue";

// region event handlers
const emit = defineEmits<{
  (e: "update:value", value: string | number): void;
}>();

function updateValue(value: string | number): void {
  updateInputValue(value);
  emit("update:value", value);
}
// endregion

const props = defineProps({
  // The value of the text field
  value: { type: [String, Number], default: "" },
  // Type of the text field
  type: { type: [String], default: "text" },
  // Boolean to disable the text field
  disabled: { type: Boolean, default: false },
  // If the field is required
  required: { type: Boolean, default: false },
  // Validation rules to apply to the text field
  rules: {
    type: Array as PropType<ValidationRule<string | number>[]>,
    default: () => [],
  },
});

const { inputValue, errorMessages, updateInputValue } = useInput({
  valueRef: toRef(props, "value"),
  requiredRef: toRef(props, "required"),
  rulesRef: toRef(props, "rules"),
});
</script>

<style scoped></style>
