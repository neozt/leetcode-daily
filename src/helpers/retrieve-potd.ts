import { Potd } from "../types/potd.models";
import { retrievePotdData } from "./dynamodb-client";
import NodeCache from "node-cache";

const POTD_CACHE_KEY = "POTD_CACHE_KEY";
const POTD_CACHE_TTL_SECONDS = 60;

const cache = new NodeCache();

export async function retrievePotd() {
  const cached = cache.get(POTD_CACHE_KEY);
  if (cached) {
    return cached as Potd;
  }

  const data = await retrievePotdData();
  if (data) {
    cache.set(POTD_CACHE_KEY, data, POTD_CACHE_TTL_SECONDS);
  }

  return data;
}
