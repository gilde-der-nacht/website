import type { Reactive } from "@common/utils/reactivity";
import type { FormState } from "@registration/State";
import type { UpdateView } from "@registration/messages/in";
import { toFormState } from "@registration/state/form";

export function updateInitialState(
  formState$: Reactive<FormState | null>,
  data: UpdateView,
): void {
  formState$.set({
    myAccount: toFormState(data.data.data.myAccount),
    save: toFormState(data.data.data.save),
  });
}

export function trySync(): void {}

export function updateState() {}
