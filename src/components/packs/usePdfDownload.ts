"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import packsApi, { useRequestPdfMutation } from "@/redux/api/packs/packsApi";
import { useAppDispatch } from "@/redux/hook";
import { errorText } from "@/lib/auth/client";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Renders a pack's PDF (POST /packs/:id/pdf), polls GET /packs/:id/pdf until it is done, then opens the signed link.
 * `busyId` is the pack currently rendering, so a button can show a spinner.
 */
export function usePdfDownload() {
  const dispatch = useAppDispatch();
  const [requestPdf] = useRequestPdfMutation();
  const [busyId, setBusyId] = useState<string | null>(null);

  const download = useCallback(
    async (packId: string) => {
      if (busyId) return;
      setBusyId(packId);
      // Opened straight away (inside the click) so the browser does not block it as a popup.
      const tab = window.open("", "_blank");
      const loading = toast.loading("Generating PDF report...");
      try {
        await requestPdf(packId).unwrap();
        for (let attempt = 0; attempt < 45; attempt++) {
          await sleep(attempt === 0 ? 800 : 2000);
          const request = dispatch(packsApi.endpoints.getPdfStatus.initiate(packId, { forceRefetch: true }));
          const status = await request.unwrap().finally(() => request.unsubscribe());
          if (status.status === "failed") throw new Error(status.error || "The PDF could not be generated.");
          if (status.status === "done" && status.url) {
            toast.success("PDF report ready.", { id: loading });
            if (tab) tab.location.href = status.url;
            else window.location.assign(status.url);
            return;
          }
        }
        throw new Error("The PDF is taking longer than expected. Please try again in a moment.");
      } catch (err) {
        tab?.close();
        toast.error(err instanceof Error && !("data" in err) ? err.message : errorText(err), { id: loading });
      } finally {
        setBusyId(null);
      }
    },
    [busyId, dispatch, requestPdf],
  );

  return { download, busyId };
}
