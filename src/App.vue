<template>
  <InputComponent v-model:value="threshold" type="date" />
  <div>threshold : {{ threshold }}</div>
  <InputComponent :rules="rules" type="date" />
</template>

<script setup lang="ts">
import InputComponent from "@/components/InputComponent.vue";
import type { MaybeRef } from "@/types/maybeRef";
import type { ValidationRule } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import type { Ref } from "vue";
import { computed, ref, unref } from "vue";

const threshold: Ref<string | null> = ref(null);

const minDateWithoutMessage =
  (param: MaybeRef<string>) => (value: string | undefined) =>
    !helpers.req(value) ||
    (!!value && new Date(value) >= new Date(unref(param)));

const minDate = (param: MaybeRef<string>) =>
  helpers.withMessage(
    `the date must be later than ${unref(param)}`,
    minDateWithoutMessage(param)
  );

const rules = computed(() => {
  const rules: ValidationRule[] = [];
  if (threshold.value) {
    rules.push(minDate(threshold.value));
  }
  return rules;
});
</script>

<style scoped></style>
