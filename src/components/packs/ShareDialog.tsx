"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Calendar,
  AlertCircle,
  ExternalLink,
  Link2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useCreateShareLinkMutation,
  useGetPackQuery,
  useGetShareLinkQuery,
  useUpdateShareLinkMutation,
} from "@/redux/api/packs/packsApi";
import { ApiImage } from "@/components/ui/ApiImage";
import { ErrorState, apiErrorInfo } from "@/components/ui/ErrorState";
import { errorText } from "@/lib/auth/client";
import { formatDate } from "@/lib/format";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packId: string;
}

type ExpiryOption = "never" | "7d" | "30d" | "custom";

const expiryIn = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const toDateInput = (iso: string) => iso.slice(0, 10);

const ShareDialogInner: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  packId,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [expiryOption, setExpiryOption] = useState<ExpiryOption | null>(null);
  const [customExpiry, setCustomExpiry] = useState<string>("");

  const pack = useGetPackQuery(isOpen ? packId : skipToken);
  const linkQuery = useGetShareLinkQuery(isOpen ? packId : skipToken);
  const [createLink, createState] = useCreateShareLinkMutation();
  const [updateLink, updateState] = useUpdateShareLinkMutation();

  const notShared = apiErrorInfo(linkQuery.error).code === "not_shared";
  const link = linkQuery.data;
  const packTitle = pack.data?.title || pack.data?.address || "";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEnabled = link?.enabled ?? false;
  const shownExpiry: ExpiryOption =
    expiryOption ?? (link?.expiresAt ? "custom" : "never");
  const shownCustom =
    customExpiry || (link?.expiresAt ? toDateInput(link.expiresAt) : "");

  const handleCreate = async () => {
    try {
      await createLink(packId).unwrap();
      toast.success("Share link created.");
    } catch (err) {
      toast.error(errorText(err));
    }
  };

  const patch = async (body: {
    enabled?: boolean;
    expiresAt?: string | null;
  }) => {
    if (!link?.id) return;
    try {
      await updateLink({ packId, shareId: link.id, ...body }).unwrap();
    } catch (err) {
      toast.error(errorText(err));
      setExpiryOption(null);
      setCustomExpiry("");
    }
  };

  const chooseExpiry = (option: ExpiryOption) => {
    setExpiryOption(option);
    if (option === "never") void patch({ expiresAt: null });
    else if (option === "7d" || option === "30d") {
      const days = option === "7d" ? 7 : 30;
      void patch({
        expiresAt: expiryIn(days),
      });
    }
  };

  const changeCustom = (value: string) => {
    setCustomExpiry(value);
    if (value)
      void patch({ expiresAt: new Date(`${value}T23:59:59`).toISOString() });
  };

  const handleCopy = async () => {
    if (!link?.url) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      toast.success("Public link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link. Select it and copy manually.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06143E]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#092167]/5 text-[#092167] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="share-dialog-title"
                className="font-heading font-semibold text-lg sm:text-xl text-slate-900"
              >
                Share Property Pack
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[260px] sm:max-w-xs">
                {packTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {linkQuery.isLoading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading share link...</span>
          </div>
        ) : notShared ? (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
            <Link2 className="w-6 h-6 text-[#092167] mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                This pack has not been shared yet
              </p>
              <p className="text-xs text-slate-500">
                Create a public link and QR code buyers can use to view the
                brochure and book viewings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createState.isLoading}
              className="h-10 px-5 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-60"
            >
              {createState.isLoading && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Create link</span>
            </button>
          </div>
        ) : linkQuery.isError || !link ? (
          <ErrorState
            error={linkQuery.error}
            onRetry={() => linkQuery.refetch()}
          />
        ) : (
          <>
            {/* Enable / Disable Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Public Web Brochure
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isEnabled
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isEnabled
                      ? link.active
                        ? "ACTIVE"
                        : "EXPIRED"
                      : "DISABLED"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {isEnabled
                    ? "Anyone with the link can view this brochure and book viewings."
                    : "The link is inactive. Visitors will see the unavailable notice."}
                </p>
              </div>

              {/* Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                onClick={() => void patch({ enabled: !isEnabled })}
                disabled={updateState.isLoading}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  isEnabled ? "bg-[#092167]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    isEnabled ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* If Disabled: Preview Notice */}
            {!isEnabled && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">
                    Disabled Preview Mode
                  </strong>
                  <span>
                    Prospective buyers navigating to this URL will now see the
                    friendly{" "}
                    <em>&ldquo;Property Brochure No Longer Available&rdquo;</em>{" "}
                    page with your agency contact info.
                  </span>
                </div>
              </div>
            )}

            {/* Link Sharing Row */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Digital Brochure Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={link.url ?? ""}
                  className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-11 px-4 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expiry Date Settings */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Link Expiration</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "never", label: "Never" },
                  { id: "7d", label: "7 Days" },
                  { id: "30d", label: "30 Days" },
                  { id: "custom", label: "Custom" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => chooseExpiry(opt.id as ExpiryOption)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                      shownExpiry === opt.id
                        ? "bg-[#092167] text-white border-[#092167]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {shownExpiry === "custom" && (
                <div className="pt-2">
                  <input
                    type="date"
                    value={shownCustom}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => changeCustom(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>
              )}
              {link.expiresAt && (
                <p className="text-[11px] text-slate-500">
                  Expires {formatDate(link.expiresAt, "long")}.
                </p>
              )}
            </div>

            {/* QR Code Section */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-5 justify-between">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0">
                <ApiImage
                  src={link.qrCodeUrl}
                  alt="QR code for the public brochure link"
                  className="w-32 h-32"
                />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">
                  Printable Signboard QR Code
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Attach this QR code to window displays, For Sale signboards,
                  or physical marketing letters so passers-by can scan to view
                  the brochure.
                </p>
                <a
                  href={link.qrCodeUrl}
                  download="property-pack-qr.svg"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download QR for Print</span>
                </a>
              </div>
            </div>
          </>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {link?.url ? (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[#092167] hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open public link preview</span>
            </a>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

/** The dialog keeps its own choices; keyed by pack so opening another pack starts clean. */
export const ShareDialog: React.FC<ShareDialogProps> = (props) =>
  props.isOpen ? <ShareDialogInner key={props.packId} {...props} /> : null;

export default ShareDialog;
