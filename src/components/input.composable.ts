import type { MaybeRef } from "@/types/maybeRef";
import type { ErrorObject, ValidationRule } from "@vuelidate/core";
import useVuelidate from "@vuelidate/core";
import { required as requiredValidator } from "@vuelidate/validators";
import type { ComputedRef, Ref, UnwrapRef } from "vue";
import { computed, ref, unref, watchEffect } from "vue";

export function useInput<T = string | number>({
  valueRef = undefined,
  requiredRef = false,
  rulesRef = [],
}: {
  valueRef?: MaybeRef<T | undefined>;
  requiredRef?: MaybeRef<boolean>;
  rulesRef?: MaybeRef<ValidationRule<T>[]>;
}) {
  // region handle inputs
  const inputValue = ref<T | undefined>(unref(valueRef));
  const required = ref<boolean>(unref(requiredRef));
  const rules: Ref<ValidationRule<T>[]> = ref(unref(rulesRef));

  watchEffect(() => {
    inputValue.value = unref(valueRef) as UnwrapRef<T>;
    required.value = unref(requiredRef);
    rules.value = unref(rulesRef);
  });
  // endregion

  const inputRules: ComputedRef<{
    inputValue: { [key: number | string]: ValidationRule<T>[] };
  }> = computed(() => {
    const result: ValidationRule<T>[] = [...rules.value];

    if (required.value) {
      result.push(requiredValidator);
    }

    // transform array of ValidationRule into object compatible with vuelidate
    return {
      inputValue: [...result.values()].reduce(
        (a, v, i) => ({ ...a, [i]: v }),
        {}
      ),
    };
  });

  const inputForm = useVuelidate(
    inputRules,
    { inputValue },
    { $autoDirty: true }
  );

  // region computed
  const allErrors: ComputedRef<ErrorObject[]> = computed(() => {
    // inputForm.value.inputValue.$errors and not inputForm.value.$errors to get only parents errors and not children
    return [...inputForm.value.inputValue.$errors];
  });

  const errorMessages: ComputedRef<string[]> = computed(() =>
    allErrors.value
      .filter((error) => error.$message)
      .map((error) => error.$message as string)
  );
  // endregion

  // region methods
  function updateInputValue(value: T | undefined): void {
    inputValue.value = value as UnwrapRef<T>;
  }
  // endregion

  return {
    inputValue,
    errorMessages,
    updateInputValue,
  };
}
