import { RestaurantDropdown } from "@hhh/components/webapp/components/restaurant/RestaurantDropdown";
import { Button } from "@hhh/components/webapp/components/static/Button";
import { Form } from "@hhh/components/webapp/components/static/forms/Form";
import { Input } from "@hhh/components/webapp/components/static/forms/Input";
import { NumberInput } from "@hhh/components/webapp/components/static/forms/NumberInput";
import { IconLeft } from "@hhh/components/webapp/components/static/icons/Icon";
import type { PageProps } from "@hhh/components/webapp/pages/util/Router";
import { isEmpty, link } from "@hhh/components/webapp/util/utils";
import { createSignal, type JSX, onMount } from "solid-js";

export const NewOrderPage = (props: PageProps): JSX.Element => {
  const [restaurantId, setRestaurantId] = createSignal("");
  const [orderer, setOrderer] = createSignal("");
  const [comment, setComment] = createSignal("");
  const [timeWindow, setTimeWindow] = createSignal(30);
  const [activeValidation, setActiveValidation] = createSignal(false);

  const activeRestaurants = () => props.data.restaurants.active;
  const [_, setState] = props.stateSignal;

  const formSubmit = (e: Event) => {
    e.preventDefault();
    setActiveValidation(true);
    if (
      !isEmpty(restaurantId()) &&
      !isEmpty(orderer()) &&
      isValidTimeWindow(timeWindow())
    ) {
      const promise = props.API.order.create({
        restaurantId: restaurantId(),
        orderer: orderer(),
        comment: comment(),
        timeWindow: timeWindow(),
      });
      promise.then(() => {
        setActiveValidation(false);
        setOrderer("");
        setComment("");
        setTimeWindow(30);
      });
    }
  };

  const isValidTimeWindow = (time: number) =>
    !isNaN(time) && time >= 0 && time < 720;

  onMount(() => setRestaurantId(activeRestaurants()[0]?.id ?? ""));

  return (
    <div class="hhh-spacer">
      <h3 class="title is-3 has-text-centered">
        <IconLeft icon="receipt">
          <span class="pl-2">Neue Bestellungen</span>
        </IconLeft>
      </h3>
      <Form>
        <RestaurantDropdown
          activeRestaurants={activeRestaurants()}
          restaurantId={restaurantId()}
          error={{
            status: activeValidation() && isEmpty(restaurantId()),
            text: "Pflichtfeld",
          }}
          setter={setRestaurantId}
        >
          <Button
            color="danger"
            isOutlined={true}
            onClick={() => link(setState)("newRestaurant")}
          >
            <IconLeft icon="fork-knife">Neues Restaurant</IconLeft>
          </Button>
        </RestaurantDropdown>
        <Input
          label="Bestellerin | Besteller"
          placeholder="Dein Name"
          helpText="Damit alle wissen, wer diese Bestellung organisiert."
          error={{
            status: activeValidation() && isEmpty(orderer()),
            text: "Pflichtfeld",
          }}
          value={orderer()}
          setter={setOrderer}
        />
        <NumberInput
          label="Zeitfenster (in Minuten)"
          helptext="Wie lange haben die anderen Personen Zeit ihre Bestellung einzugeben."
          error={{
            status: activeValidation() && !isValidTimeWindow(timeWindow()),
            text: "Zeit darf nicht negativ sein oder länger als 12 Stunden (720 Minuten).",
          }}
          value={timeWindow()}
          setter={setTimeWindow}
        />
        <Input
          label="Kommentar"
          placeholder="kann leer gelassen werden"
          value={comment()}
          setter={setComment}
        />
        <div
          class="pt-5 is-flex is-flex-wrap-wrap is-justify-content-space-evenly"
          style="gap: 1rem;"
        >
          <Button
            color="success"
            isLarge={true}
            onClick={formSubmit}
            isSubmit={true}
          >
            <IconLeft icon="check">Bestellung starten</IconLeft>
          </Button>
        </div>
      </Form>
    </div>
  );
};
