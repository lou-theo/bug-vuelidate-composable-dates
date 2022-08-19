<template>
  <div>
    <InputComponent v-model:value="dateThreshold" type="date" />
    <div>threshold : {{ dateThreshold }}</div>
    <InputComponent :rules="dateRules" type="date" />
  </div>
  <div>
    <InputComponent v-model:value="numberThreshold" type="number" />
    <div>threshold : {{ numberThreshold }}</div>
    <InputComponent :rules="numberRules" type="number" />
  </div>
</template>

<script setup lang="ts">
import InputComponent from "@/components/InputComponent.vue";
import type { MaybeRef } from "@/types/maybeRef";
import type { ValidationRule } from "@vuelidate/core";
import { helpers, minValue } from "@vuelidate/validators";
import type { Ref } from "vue";
import { computed, ref, unref } from "vue";

const dateThreshold: Ref<string | null> = ref(null);
const numberThreshold: Ref<number | null> = ref(null);

const minDateWithoutMessage =
  (param: MaybeRef<string>) => (value: string | undefined) =>
    !helpers.req(value) ||
    (!!value && new Date(value) >= new Date(unref(param)));

const minDate = (param: MaybeRef<string>) =>
  helpers.withMessage(
    `the date must be later than ${unref(param)}`,
    minDateWithoutMessage(param)
  );

const minValueMessage = (param: MaybeRef<number>) =>
  helpers.withMessage(
    `custom message greater than ${unref(param)}`,
    minValue(param)
  );

const dateRules = computed(() => {
  const rules: ValidationRule[] = [];
  if (dateThreshold.value) {
    rules.push(minDate(dateThreshold.value));
  }
  return rules;
});

const numberRules = computed(() => {
  const rules: ValidationRule[] = [];
  if (numberThreshold.value) {
    rules.push(minValueMessage(numberThreshold.value));
  }
  return rules;
});
</script>

<style scoped></style>
