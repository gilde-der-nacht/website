import type { Reactive } from "@common/utils/reactivity";
import type { FormState } from "@registration/State";
import type { UpdateView } from "@registration/messages/in";
import { initFormState } from "@registration/state/form";

export function updateInitialState(
  formState$: Reactive<FormState | null>,
  data: UpdateView,
): void {
  formState$.set({
    myAccount: initFormState(data.data.data.myAccount),
    save: initFormState(data.data.data.save),
  });
}

export function trySave(): void {}

export function updateState() {}
