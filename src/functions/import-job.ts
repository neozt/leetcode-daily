import { Handler } from "aws-lambda";
import { refreshLatestPotd } from "../services/potd.service";

/**
 * Scheduled job to pre-fetch each day's POTD
 */
export const handler: Handler = async () => {
  console.log("[import-job] Job running...");

  const potd = await refreshLatestPotd(new Date());

  console.log(`[import-job] Refreshed latest POTD: ${JSON.stringify(potd)}`);
  console.log("[import-job] Job complete");

  return "Success";
};
