import { mergeProps, onMount, type JSX } from "solid-js";

type Props = {
  submitLabel?: string;
  language?: "de" | "en";
  isValid: (formData: FormData) => boolean;
  onSuccess: () => void;
  onError: (e: unknown) => void;
  children?: JSX.Element;
}

const actionUrl = "https://elysium.gildedernacht.ch/forms";

export function Form(props: Props): JSX.Element {
  const propsWithDefaults = mergeProps({ language: "de", submitLabel: props.language === "en" ? "Submit" : "Absenden" }, props);

  // If JS is available we validate and handle the form via JS.
  // Without JS the form behaves like any normal form element.
  let formElement!: HTMLFormElement;
  onMount(() => {
    formElement.setAttribute("novalidate", "");
    const redirects = formElement.querySelectorAll('input[name^="redirect"][type="hidden"]');
    [...redirects].forEach(redirect => redirect.remove());
  });
  async function onSubmit(e: SubmitEvent): Promise<void> {
    const { target } = e;
    if (target !== null && target instanceof HTMLFormElement) {
      e.preventDefault();
      const formData = new FormData(target);
      if (!propsWithDefaults.isValid(formData)) {
        return;
      }
      try {
        const response = await fetch(actionUrl, {
          method: "post",
          body: formData
        });
        if (response.ok) {
          propsWithDefaults.onSuccess();
        } else {
          propsWithDefaults.onError(await response.text());
        }
      } catch (err: unknown) {
        propsWithDefaults.onError(err);
      }
    }
  }


  return (
    <form action={actionUrl} method="post" onSubmit={onSubmit} ref={formElement}>
      {propsWithDefaults.children}
      <button type="submit" class="button-accent">{propsWithDefaults.submitLabel}</button>
    </form>
  )
}
