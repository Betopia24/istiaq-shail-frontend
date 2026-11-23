"use client";

import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPackQuery } from "@/redux/api/packs/packsApi";

/**
 * One pack, re-fetched every 2 seconds while it is `generating` (the API writes the copy in the background), and
 * for a few seconds after, so the job's final state shows. Pass `undefined` to skip.
 */
export function usePack(id: string | undefined) {
  const [interval, setIntervalMs] = useState(0);
  const query = useGetPackQuery(id ?? skipToken, { pollingInterval: interval });
  const generating = query.data?.status === "generating" || query.data?.job?.status === "queued" || query.data?.job?.status === "running";
  useEffect(() => setIntervalMs(generating ? 2000 : 0), [generating]);
  return { ...query, generating };
}
