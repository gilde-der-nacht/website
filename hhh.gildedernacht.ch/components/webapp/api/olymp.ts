import type { Refetcher } from "@hhh/components/webapp/api/api";
import type {
  EntryCreatePost,
  EntryUpdatePost,
  OlympResponse,
  OrderCreatePost,
  OrderUpdatePost,
  RawServerData,
  RestaurantCreatePost,
  RestaurantUpdatePost,
} from "@hhh/components/webapp/api/ApiTypes";
import { safeParse } from "@hhh/components/webapp/api/parsing";

const RESOURCE_UID =
  "ed28796bac34122c0d508c578915f9fc1ce53ef46789cdcf41a3dc8da76730f3";

const ENDPOINT = `https://api.gildedernacht.ch/resources/${RESOURCE_UID}/entries`;

export const HHH_VERSION = 5;

type OlympCreatePayload =
  | RestaurantCreatePost
  | OrderCreatePost
  | EntryCreatePost;
type OlympUpdatePayload =
  | RestaurantUpdatePost
  | OrderUpdatePost
  | EntryUpdatePost;

type OlympPostPayload = {
  identification: string;
  publicBody: string;
  privateBody: string;
};

const CREATE =
  (refetch: Refetcher) =>
  async (payload: OlympCreatePayload): Promise<Response> => {
    const body: OlympPostPayload = {
      identification: payload.id,
      publicBody: JSON.stringify({ ...payload, version: HHH_VERSION }),
      privateBody: JSON.stringify({}),
    };

    const response = await fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      refetch();
      return response;
    }
    throw new Error(response.statusText);
  };

const UPDATE =
  (refetch: Refetcher) =>
  async (payload: OlympUpdatePayload): Promise<Response> => {
    const body: OlympPostPayload = {
      identification: payload.id,
      publicBody: JSON.stringify({ ...payload, version: HHH_VERSION }),
      privateBody: JSON.stringify({}),
    };

    const response = await fetch(ENDPOINT, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      refetch();
      return response;
    }
    throw new Error(response.statusText);
  };

const filterNewest = (data: OlympResponse[]): OlympResponse[] => {
  const map: { [_: string]: OlympResponse } = {};
  data.forEach((d) => {
    map[d.id] = d;
  });
  return Object.values(map);
};

const GET = async (): Promise<OlympResponse[]> => {
  const response = await fetch(ENDPOINT, { method: "GET", mode: "cors" });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data: RawServerData[] = await response.json();
  const parsed = data
    .map(safeParse)
    .filter((d): d is OlympResponse => d !== null);
  return filterNewest(parsed);
};

export default { CREATE, UPDATE, GET };
