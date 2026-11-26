import type { Reactive } from "@common/utils/reactivity";
import type { FormState } from "@registration/State";
import type { UpdateView } from "@registration/messages/in";

export function updateInitialState(
  formState$: Reactive<FormState | null>,
  data: UpdateView,
): void {
  formState$.set({
    myAccount: data.data.data.myAccount,
    save: data.data.data.save,
  });
}

export function trySave(): void {}

export function updateState() {}
