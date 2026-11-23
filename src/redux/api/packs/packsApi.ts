import baseApi from "../baseApi";
import type {
  DashboardSummary,
  JobStarted,
  Pack,
  PackList,
  PackListQuery,
  PdfStatus,
  PortalExport,
  PropertyInput,
  Section,
  SectionKey,
  SectionVersion,
  ShareLink,
  Photo,
} from "@/types/models";

type PhotoKind = "photo" | "floor_plan" | "epc";

/** Packs, photos, generation, sections, PDF, portal export, sharing (openapi: Packs, Outputs, Sharing). */
const packsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/dashboard/summary",
      providesTags: ["Pack", "Subscription"],
    }),

    listPacks: builder.query<PackList, PackListQuery | void>({
      query: (params) => ({ url: "/packs", params: params ?? undefined }),
      providesTags: (result) => [
        "Pack",
        ...(result?.items ?? []).map((p) => ({ type: "Pack" as const, id: p.id })),
      ],
    }),

    /** Poll this while `status` is `generating` (see usePackPolling). */
    getPack: builder.query<Pack, string>({
      query: (id) => `/packs/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Pack", id }],
    }),

    createPack: builder.mutation<Pack, Partial<PropertyInput> & { referenceTitle: string }>({
      query: (body) => ({ url: "/packs", method: "POST", body }),
      invalidatesTags: ["Pack"],
    }),

    updatePack: builder.mutation<Pack, { id: string; body: Partial<PropertyInput> }>({
      query: ({ id, body }) => ({ url: `/packs/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Pack", id }, "Pack"],
    }),

    deletePack: builder.mutation<void, string>({
      query: (id) => ({ url: `/packs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Pack"],
    }),

    /** multipart: one or more image files of one kind. Returns the pack's photos. */
    uploadPhotos: builder.mutation<Photo[], { id: string; files: File[]; kind?: PhotoKind }>({
      query: ({ id, files, kind = "photo" }) => {
        const body = new FormData();
        body.append("kind", kind);
        for (const file of files) body.append("files", file);
        return { url: `/packs/${id}/photos`, method: "POST", body };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: "Pack", id }],
    }),

    /** The first item becomes the cover. */
    reorderPhotos: builder.mutation<Photo[], { id: string; photos: { photoId: string; tag?: string | null }[] }>({
      query: ({ id, photos }) => ({ url: `/packs/${id}/photos`, method: "PUT", body: photos }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Pack", id }],
    }),

    deletePhoto: builder.mutation<void, { id: string; photoId: string }>({
      query: ({ id, photoId }) => ({ url: `/packs/${id}/photos/${photoId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Pack", id }],
    }),

    /** Takes a credit. 402 `insufficient_credits`, 422 `pack_incomplete` with `fields`. */
    generatePack: builder.mutation<JobStarted, string>({
      query: (id) => ({ url: `/packs/${id}/generate`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Pack", id }, "Subscription"],
    }),

    regenerate: builder.mutation<JobStarted, { id: string; section?: SectionKey; tone?: string }>({
      query: ({ id, ...body }) => ({ url: `/packs/${id}/regenerate`, method: "POST", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Pack", id }, "Subscription"],
    }),

    updateSection: builder.mutation<Section, { id: string; key: SectionKey; content: Record<string, unknown> }>({
      query: ({ id, key, content }) => ({ url: `/packs/${id}/sections/${key}`, method: "PATCH", body: content }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Pack", id }],
    }),

    getSectionVersions: builder.query<SectionVersion[], { id: string; key: SectionKey }>({
      query: ({ id, key }) => `/packs/${id}/sections/${key}/versions`,
      providesTags: (_r, _e, { id }) => [{ type: "Pack", id }],
    }),

    requestPdf: builder.mutation<{ renderId: string; status: string }, string>({
      query: (id) => ({ url: `/packs/${id}/pdf`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Pdf", id }],
    }),

    /** Poll until `status` is `done`, then open `url`. */
    getPdfStatus: builder.query<PdfStatus, string>({
      query: (id) => `/packs/${id}/pdf`,
      providesTags: (_r, _e, id) => [{ type: "Pdf", id }],
    }),

    getPortalExport: builder.query<PortalExport, { id: string; portal: "rightmove" | "zoopla" }>({
      query: ({ id, portal }) => ({ url: `/packs/${id}/portal-export`, params: { portal, format: "json" } }),
      providesTags: (_r, _e, { id }) => [{ type: "Pack", id }],
    }),

    /** 404 `not_shared` if the pack was never shared. */
    getShareLink: builder.query<ShareLink, string>({
      query: (id) => `/packs/${id}/share`,
      providesTags: (_r, _e, id) => [{ type: "Share", id }],
    }),

    /** Creates the link or returns the existing one; the pack becomes `live`. */
    createShareLink: builder.mutation<ShareLink, string>({
      query: (id) => ({ url: `/packs/${id}/share`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Share", id }, { type: "Pack", id }, "Pack"],
    }),

    updateShareLink: builder.mutation<ShareLink, { packId: string; shareId: string; enabled?: boolean; expiresAt?: string | null }>({
      query: ({ shareId, enabled, expiresAt }) => ({ url: `/share/${shareId}`, method: "PATCH", body: { enabled, expiresAt } }),
      invalidatesTags: (_r, _e, { packId }) => [{ type: "Share", id: packId }, { type: "Pack", id: packId }, "Pack"],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useListPacksQuery,
  useGetPackQuery,
  useCreatePackMutation,
  useUpdatePackMutation,
  useDeletePackMutation,
  useUploadPhotosMutation,
  useReorderPhotosMutation,
  useDeletePhotoMutation,
  useGeneratePackMutation,
  useRegenerateMutation,
  useUpdateSectionMutation,
  useGetSectionVersionsQuery,
  useRequestPdfMutation,
  useGetPdfStatusQuery,
  useGetPortalExportQuery,
  useGetShareLinkQuery,
  useCreateShareLinkMutation,
  useUpdateShareLinkMutation,
} = packsApi;

export default packsApi;
