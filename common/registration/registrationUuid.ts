import {
  unsafeToRegistrationUuid,
  type RegistrationUuid,
} from "@common/utils/ids";

export function getRegistrationUuid(): RegistrationUuid {
  const url = URL.parse(location.toString().replace("#/", "")); // bit hacky to work with Solid Router
  const secretParam = url?.searchParams.get("secret") ?? "no-secret-found";
  if (secretParam.length !== 36) {
    console.error(`Secret is not valid`);
  }
  return unsafeToRegistrationUuid(secretParam);
}
