import { assert } from "@common/components/utils";
import { unsafeToGroupId, type GroupId } from "@common/utils/ids";
import { toPlainDateTime, type Timestamp } from "@common/utils/shared";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";

export type GroupedReservation = {
  groupId: GroupId;
  names: string[] | null;
  seats: number;
  lastTimestamp: Timestamp;
  waitinglist: boolean;
};

export function orderReservations(
  programEntry: ProgramPublicEntry,
): GroupedReservation[] {
  let maxSeats = programEntry.participation.seats.max - 1; // Reduce by one

  const byGroupId = Object.groupBy(
    programEntry.participation.reserved,
    (reservation) => reservation.groupId,
  );

  const grouped = Object.entries(byGroupId).map(
    ([groupId, reservations]): GroupedReservation => {
      assert(reservations !== undefined, "");

      const names = reservations.some((r) => r.name === null)
        ? null
        : reservations.map((r) => r.name).filter((r) => r !== null);

      const lastEntry = reservations.toSorted((a, b) =>
        Temporal.PlainDateTime.compare(
          toPlainDateTime(a.timestamp),
          toPlainDateTime(b.timestamp),
        ),
      )[0];

      assert(lastEntry !== undefined, "");

      return {
        groupId: unsafeToGroupId(groupId),
        names,
        seats: reservations.length,
        lastTimestamp: lastEntry.timestamp,
        waitinglist: true, // temp
      };
    },
  );

  const sortedAndGrouped = grouped.toSorted((a, b) =>
    Temporal.PlainDateTime.compare(
      toPlainDateTime(a.lastTimestamp),
      toPlainDateTime(b.lastTimestamp),
    ),
  );

  return sortedAndGrouped.map((e) => {
    const seats = e.seats;
    maxSeats -= seats;

    if (maxSeats >= 0) {
      return {
        ...e,
        waitinglist: false,
      };
    }
    return e;
  });
}
