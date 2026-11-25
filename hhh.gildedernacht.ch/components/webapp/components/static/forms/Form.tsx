import type { JSX } from "@solidjs/web";

export const Form = (props: { children: JSX.Element }): JSX.Element => {
  return <form action="">{props.children}</form>;
};
