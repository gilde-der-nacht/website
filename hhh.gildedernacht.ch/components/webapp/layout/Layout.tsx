import { Toast } from "@hhh/components/webapp/components/static/Toast";
import { Footer } from "@hhh/components/webapp/layout/Footer";
import { Header } from "@hhh/components/webapp/layout/Header";
import { Navbar } from "@hhh/components/webapp/layout/Navbar";
import type { AppState } from "@hhh/components/webapp/util/StateTypes";
import { hideToast, link, setToast } from "@hhh/components/webapp/util/utils";
import { type Accessor, type JSX, type Setter } from "solid-js";

type Props = {
  stateSignal: [Accessor<AppState>, Setter<AppState>];
  children: JSX.Element;
};

export const Layout = (props: Props): JSX.Element => {
  const [state, setState] = props.stateSignal;

  return (
    <div class="hhh-body">
      <Header link={link(setState)}></Header>
      <Navbar link={link(setState)}></Navbar>
      {props.children}
      <Footer></Footer>
      <Toast
        {...state().toast}
        setToast={setToast(setState)}
        hideToast={hideToast(setState)}
      />
    </div>
  );
};
