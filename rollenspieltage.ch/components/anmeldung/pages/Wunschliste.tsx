import { TextareaField } from "@common/components/newForm/Textarea";
import { obj, type Reactive } from "@common/utils/reactivity";
import { For, Show, type Accessor, type JSX } from "solid-js";
import type {
  Program,
  WishlistEntry,
} from "@rst/components/anmeldung/api/program";
import { UNAUTHORIZED } from "@common/utils/shared";
import type { Roles } from "@rst/components/anmeldung/api/meta";

export function Wunschliste(props: {
  wishlist$: Reactive<{ text: string }>;
  programData: Accessor<Program>;
  roles: Roles;
}): JSX.Element {
  function getGlobalWishlist(): WishlistEntry[] {
    const program = props.programData();
    if (program.wishlist === UNAUTHORIZED) {
      return [];
    }
    return program.wishlist;
  }

  return (
    <div class="content">
      <p>
        Hier kannst du uns direkte Wünsch mitteilen. Vermisst du ein bestimmtes
        Spiel in unserem Programm? Möchtest du eine Spielrunde anleiten, weisst
        aber nicht, wie zu beginnen? Hast du sonst eine tolle Idee?
      </p>
      <p>
        Gerne nehmen wir hier alle deine Wünsche entgegen. Vielleicht können wir
        sie für die kommenden Rollenspieltage umsetzten oder zumindest für
        zukünftige Durchführungen in Betracht ziehen.
      </p>
      <TextareaField
        label="Deine Wünsche"
        name="wishes"
        value$={props.wishlist$.pipe(obj.sub("text"))}
      />

      <Show
        when={
          props.programData().wishlist !== UNAUTHORIZED &&
          props.roles.includes("admin")
        }
      >
        <h3>Globale Wunschliste</h3>
        <For
          each={getGlobalWishlist()}
          fallback={<em>Bisher keine Einträge</em>}
        >
          {(entry) => (
            <div class="content">
              <blockquote>
                <p>
                  <code>{entry.text}</code>
                </p>
                <strong>Autor: </strong>
                <a
                  href={`/meine-anmeldung/#/zusammenfassung?secret=${entry.secret}`}
                  target="_blank"
                >
                  {entry.author}
                </a>
              </blockquote>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
