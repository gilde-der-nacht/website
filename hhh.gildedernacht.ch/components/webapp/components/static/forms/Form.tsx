import type { JSX } from "solid-js";

export const Form = (props: { children: JSX.Element }): JSX.Element => {
  return <form action="">{props.children}</form>;
};
