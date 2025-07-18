import { PotdDetails } from "../types/potd.models";
import { retrievePotdData, storePotdData } from "../helpers/dynamodb.client";
import { fetchPotdDetails } from "../helpers/leetcode.client";

export async function getPotd(): Promise<PotdDetails | undefined> {
  const today = new Date();

  const storedPotd = await retrievePotdData(dateStr(today));
  if (storedPotd) {
    return storedPotd;
  }

  return refreshLatestPotd(today);
}

export async function refreshLatestPotd(
  today: Date,
): Promise<PotdDetails | undefined> {
  const todayStr = dateStr(today);
  console.log(`Fetching latest POTD for ${todayStr} from LeetCode API...`);
  const potd = await fetchPotdDetails();
  if (potd?.date !== todayStr) {
    console.warn(
      `LeetCode didn't return today's POTD. LC response: ${JSON.stringify(potd)}`,
    );
    return undefined;
  }

  console.log(`Fetched POTD from LeetCode: ${JSON.stringify(potd)}`);
  console.log("Storing POTD into DB...");
  await storePotdData(potd);

  return potd;
}

export function dateStr(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}
