import { assert } from "@common/components/utils";
import { unsafeToGroupId, type GroupId } from "@common/utils/ids";
import { toPlainDateTime, type Timestamp } from "@common/utils/shared";
import { Temporal } from "@js-temporal/polyfill";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";

export type GroupedReservation = {
  groupId: GroupId;
  names: string[] | null;
  seats: number;
  lastTimestamp: Timestamp;
  waitinglist: boolean;
};

export function orderReservations(programEntry: ProgramPublicEntry): {
  reserved: GroupedReservation[];
  waiting: GroupedReservation[];
} {
  const reservedByGroupId = Object.groupBy(
    programEntry.participation.reserved,
    (reservation) => reservation.groupId,
  );

  const waitingByGroupId = Object.groupBy(
    programEntry.participation.waiting,
    (reservation) => reservation.groupId,
  );

  const reservedGrouped = Object.entries(reservedByGroupId).map(
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
        waitinglist: false,
      };
    },
  );

  const waitingGrouped = Object.entries(waitingByGroupId).map(
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
        waitinglist: false,
      };
    },
  );

  const reservedSortedAndGrouped = reservedGrouped.toSorted((a, b) =>
    Temporal.PlainDateTime.compare(
      toPlainDateTime(a.lastTimestamp),
      toPlainDateTime(b.lastTimestamp),
    ),
  );

  const waitingSortedAndGrouped = waitingGrouped.toSorted((a, b) =>
    Temporal.PlainDateTime.compare(
      toPlainDateTime(a.lastTimestamp),
      toPlainDateTime(b.lastTimestamp),
    ),
  );

  return {
    reserved: reservedSortedAndGrouped,
    waiting: waitingSortedAndGrouped,
  };
}
