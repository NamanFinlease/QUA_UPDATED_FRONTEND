import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./BaseURL";
import { idID } from "@mui/material/locale";

const role = () =>
  JSON.parse(localStorage.getItem("auth-storage")).state.activeRole;
// Define a service using a base URL and expected endpoints
export const lmsQueries = createApi({
  reducerPath: "lmsQueries",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["activeLeads", "preCollectionActiveLeads", "leadProfile", "collectionProfile"],
  endpoints: (builder) => ({
    updateCollection: builder.mutation({
      query: ({ loanNo, data }) => ({
        url: `/collections/active/${loanNo}/?role=${role()}`,
        method: "PATCH",
        body: { data },
      }),
      providesTags: ["activeLeads", "leadProfile"],
    }),
    verifyPayment : builder.mutation({
        query: ({ loanNo, transactionId }) => ({
            url: `/accounts/payment/verify/${loanNo}/?transactionId=${transactionId}&role=accountExecutive`,
            method: "PATCH",
            // body: { data },
        }),
        invalidatesTags: ["collectionProfile"]
    }),
    addPayment: builder.mutation({
      query: ({ id, data }) => ({
          url: `/collections/updatePayment/${id}/?role=${role()}`,
          method: "POST",
          body: data,
        
      }),
      invalidatesTags: ["activeLeads"],
    }),
    allocatePreCollections: builder.mutation({
      query: ( id ) =>  ({
        url:`collections/preCollection/allocate/${id}/?role=${role()}`,
        method:"PATCH"
      }),
      invalidatesTags: ["preCollectionActiveLeads"],
    }),
    allocateCollections: builder.mutation({
      query: ( id ) =>  ({
        url:`/collections/allocate/${id}/?role=${role()}`,
        method:"PATCH"
      }),
      invalidatesTags: ["activeLeads"],
    }),
    allocatePartialLead: builder.mutation({
      query: ( id ) =>  ({
        url:`/marketing/partialLead/${id}/?role=${role()}`,
        method:"POST"
      }),
      invalidatesTags: ["allocatedPartialLeads"],
    }),
    //Partial Leads
    partialLeads: builder.query({
      query: ({ page, limit }) =>
          `/marketing/landingPageData/?page=${page}&limit=${limit}&role=${role()}`,
      providesTags: ["partialLeads"],
    }),
    allocatedPartialLeads: builder.query({
      query: ({ page, limit }) =>
          `/marketing/allocated/?page=${page}&limit=${limit}&role=${role()}`,
      providesTags: ["allocatedPartialLeads"],
    }),
    completedPartialLeads: builder.query({
      query: ({ page, limit }) =>
          `/marketing/completed/?page=${page}&limit=${limit}&role=${role()}`,
    }),
    rejectedPartialLeads: builder.query({
      query: ({ page, limit }) =>
          `/marketing/rejectedList/?page=${page}&limit=${limit}&role=${role()}`,
    }),
    //Pre Collection Leads
    activePreCollectionLeads: builder.query({
      query: ({ page, limit }) => `collections/preCollection/active/?role=${role()}`,
      providesTags: ["preCollectionActiveLeads"],
    }),
    allocatedPreCollectionsList: builder.query({
      query: ( {page, limit} ) =>  `collections/preCollection/allocatedList/?role=${role()}`,
      providesTags: ["activeLeads"],
    }),
    //Collection Leads
    activeLeads: builder.query({
      query: ({ page, limit }) => `/collections/active/?role=${role()}`,
      providesTags: ["activeLeads"],
    }),
    allocatedCollectionsList: builder.query({
      query: ( {page, limit} ) =>  `/collections/allocatedList/?role=${role()}`,
      providesTags: ["activeLeads"],
    }),
    fetchActiveLead: builder.query({
      query: (loanNo) => `/collections/active/${loanNo}/?role=${role()}`,
      providesTags: ["activeLeads", "leadProfile"],
    }),
    fetchRepaymentDetails: builder.query({
      query: ( id ) => `/collections/repayment/${id}/?role=${role()}`,
      providesTags: ["collectionProfile"]
    }),

    pendingVerification: builder.query({
        query: (loanNo) =>  `/accounts/pendingPaymentVerification/${loanNo}/?role=${role()}`,
        providesTags:["collectionProfile"]
    }),
    pendingVerificationList: builder.query({
        query: (page, limit) =>  `/accounts/pendingPaymentVerificationList/?role=${role()}`,
        providesTags:["collectionProfile"]
    }),
    verifyPendingLead: builder.mutation({
        query: ({ loanNo, utr, status }) => ({
            url: `/accounts/active/verify/${loanNo}/?role=${role()}`,
            method: "PATCH",
            body: { utr, status },
        }),
        invalidatesTags:["leadProfile","activeLeads"]
    }),
    closedLeads: builder.query({
        query: ({ page, limit }) =>`/collections/closedList/?role=${role()}`,
        providesTags: ["activeLeads"],
    }),
    }),
});
export const {
  useUpdateCollectionMutation,
  useAddPaymentMutation,
  useActivePreCollectionLeadsQuery,
  useAllocatedPreCollectionsListQuery,
  useActiveLeadsQuery,
  useAllocatedCollectionsListQuery,
  useFetchActiveLeadQuery,
  usePendingVerificationQuery,
  useVerifyPendingLeadMutation,
  useClosedLeadsQuery,
  useVerifyPaymentMutation,
  useAllocatePreCollectionsMutation,
  useAllocateCollectionsMutation,
  useFetchRepaymentDetailsQuery,
  usePendingVerificationListQuery,
  usePartialLeadsQuery,
  useAllocatePartialLeadMutation,
  useAllocatedPartialLeadsQuery,
  useCompletedPartialLeadsQuery,
  useRejectedPartialLeadsQuery,
} = lmsQueries;
