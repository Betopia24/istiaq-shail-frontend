"use client";

import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPackQuery } from "@/redux/api/packs/packsApi";

/**
 * One pack, re-fetched every 2 seconds while it is `generating` (the API writes the copy in the background), so
 * the job's final state shows. Pass `undefined` to skip.
 */
export function usePack(id: string | undefined) {
  const query = useGetPackQuery(id ?? skipToken);
  const generating = query.data?.status === "generating" || query.data?.job?.status === "queued" || query.data?.job?.status === "running";
  const { refetch } = query;

  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => void refetch(), 2000);
    return () => clearInterval(timer);
  }, [generating, refetch]);

  return { ...query, generating };
}
