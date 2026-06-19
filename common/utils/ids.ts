type Brand<B> = { __brand: B };
export type Branded<T, B> = T & Brand<B>;

function createBranded<T, B>(value: T): Branded<T, B> {
  return value as Branded<T, B>;
}

export function isBranded<T extends object, B>(
  value: T,
): value is Branded<T, B> {
  return "__brand" in value;
}

declare const brandRegistrationUuid: unique symbol;
export type RegistrationUuid = Branded<string, typeof brandRegistrationUuid>;

export function unsafeToRegistrationUuid(str: string): RegistrationUuid {
  return createBranded<string, typeof brandRegistrationUuid>(str);
}

declare const brandGameUuid: unique symbol;
export type GameUuid = Branded<string, typeof brandGameUuid>;

export function unsafeToGameUuid(str: string): GameUuid {
  return createBranded<string, typeof brandGameUuid>(str);
}

declare const brandTimeslotUuid: unique symbol;
export type TimeslotUuid = Branded<string, typeof brandTimeslotUuid>;

export function unsafeToTimeslotUuid(str: string): TimeslotUuid {
  return createBranded<string, typeof brandTimeslotUuid>(str);
}

declare const brandReservationUuid: unique symbol;
export type ReservationUuid = Branded<string, typeof brandReservationUuid>;

export function unsafeToReservationUuid(str: string): ReservationUuid {
  return createBranded<string, typeof brandReservationUuid>(str);
}
declare const brandGroupUuid: unique symbol;
export type GroupUuid = Branded<string, typeof brandGroupUuid>;

export function unsafeToGroupUuid(str: string): GroupUuid {
  return createBranded<string, typeof brandGroupUuid>(str);
}

declare const brandToastUuid: unique symbol;
export type ToastUuid = Branded<string, typeof brandToastUuid>;

export function unsafeToToastUuid(str: string): ToastUuid {
  return createBranded<string, typeof brandToastUuid>(str);
}
