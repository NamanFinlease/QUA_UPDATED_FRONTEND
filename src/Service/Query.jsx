import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import useAuthStore from '../Component/store/authStore';
import { BASE_URL } from './BaseURL';
// const role = useAuthStore()
const role = () => JSON.parse(localStorage.getItem("auth-storage")).state.activeRole
// Define a service using a base URL and expected endpoints
export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: fetchBaseQuery({
   
    baseUrl:BASE_URL,

    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["leadProfile", "rejectedLeads", "holdLeads", "logs"],
  endpoints: (builder) => ({
    // GET request to fetch a Pokemon by name
    getEmployees: builder.query({
      query: () => `employees/me/?role=${role()}`,
    }),
    //
    allocateLead: builder.mutation({
      query: (id) => ({
        url: `leads/${id}/?role=${role()}`,
        method: "PATCH",
      }),
    }),
    uploadDocuments: builder.mutation({
      query: ({ id, docsData }) => ({
        url: `leads/docs/${id}/?role=${role()}`,
        method: "PATCH",
        body: docsData,
      }),
      invalidatesTags: ["leadProfile"],
    }),

    // POST request to send data (this should use builder.mutation)
    loginUser: builder.mutation({
      query: (data) => ({
        url: `employees/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `employees/logout/?role=${role()}`,
        method: "POST",
      }),
    }),
    adminBank: builder.mutation({
      query: (bankDetails) => ({
        url: `employees/admin/banks?role=${role()}`,
        method: "POST",
        body: bankDetails,
      }),
    }),
    bulkUpload: builder.mutation({
      query: (data) => ({
        url: `leads/bulk-upload/?role=${role()}`,
        method: "POST",
        body: data,
      }),
    }),
    holdLead: builder.mutation({
      query: ({ id, reason }) => ({
        url: `leads/hold/${id}/?role=${role()}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["leadProfile", "logs"],
    }),
    rejectLead: builder.mutation({
      query: ({ id, reason }) => ({
        url: `leads/reject/${id}/?role=${role()}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["leadProfile", "logs"],
    }),
    unholdLead: builder.mutation({
      query: ({ id, reason }) => ({
        url: `leads/unhold/${id}/?role=${role()}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["leadProfile", "logs"],
    }),
    recommendLead: builder.mutation({
      query: (id) => ({
        url: `leads/recommend/${id}/?role=${role()}`,
        method: "PATCH",
      }),
    }),

    addEmployee: builder.mutation({
      query: (data) => ({
        url: `employees/register/?role=${role()}`,
        method: "POST",
        body: data,
      }),
    }),
    updateLead: builder.mutation({
      query: ({ id, formData }) => ({
        url: `leads/update/${id}/?role=${role()}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["leadProfile"],
    }),
    getEmailOtp: builder.mutation({
      query: (id) => ({
        url: `verify/email/${id}/?role=${role()}`,
        method: "PATCH",
      }),
      invalidatesTags: ["leadProfile"],
    }),
    verifyEmailOtp: builder.mutation({
      query: ({ id, data }) => ({
        url: `verify/email-otp/${id}/?role=${role()}`,
        method: "PATCH",
        body: { otp: data },
      }),
      invalidatesTags: ["leadProfile"],
    }),
    verifyAadhaarOtp: builder.mutation({
      query: ({ id, transactionId, otp,codeVerifier,fwdp }) => ({
        url: `verify/aadhaar-otp/?id=${id}&role=${role()}`,
        method: "POST",
        body: { otp,codeVerifier,fwdp,transactionId },
      }),
      invalidatesTags: ["leadProfile"],
    }),
    verifyAadhaar: builder.mutation({
      query: ({ id, details }) => ({
        url: `verify/verifyAadhaar/${id}/?role=${role()}`,
        method: "PATCH",
       
      }),
      invalidatesTags: ["leadProfile"],
    }),
    verifyPan: builder.mutation({
      query: ({ id, data }) => ({
        url: `verify/pan/${id}/?role=${role()}`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["leadProfile"],
    }),

    fetchAllEmployee: builder.query({
      query: () => "employees",
    }),
    fetchAllocatedLeads: builder.query({
      query: ({ page, limit }) =>
        `/leads/allocated/?page=${page}&limit=${limit}&role=${role()}`,
    }),
    fetchAllLeads: builder.query({
      query: ({ page, limit }) =>
        `/leads/?page=${page}&limit=${limit}&role=${role()}`,
    }),
    fetchSingleLead: builder.query({
      query: (id) => `/leads/${id}/?role=${role()}`,
      providesTags: ["leadProfile"],
    }),
    getLeadDocs: builder.query({
      query: ({ id, docId, docType }) =>
        `/leads/docs/${id}/?docType=${docType}&docId=${docId}&role=${role()}`,
    }),
    getInternalDedupe: builder.query({
      query: (id) => `/leads/old-history/${id}/?role=${role()}`,
      providesTags: ["holdLeads", "rejectedLeads"],
    }),
    applicationLogs: builder.query({
      query: (id) => `/leads/viewlogs/${id}/?role=${role()}`,
      providesTags: ["logs"],
    }),
    fetchAllHoldLeads: builder.query({
      query: () => `/leads/hold/?role=${role()}`,
      providesTags: ["holdLeads"],
    }),
    fetchAllRejectedLeads: builder.query({
      query: () => `/leads/reject/?role=${role()}`,
      providesTags: ["rejectedLeads"],
    }),
    fetchCibilScore: builder.query({
      query: (id) => `verify/equifax/${id}/?role=${role()}`,
      // providesTags:["rejectedLeads"]
    }),
    aadhaarOtp: builder.query({
      query: (id) => `verify/aadhaar/${id}/?role=${role()}`,
      // providesTags:["leadProfile"]
    }),
    getPanDetails: builder.query({
      query: (id) => `verify/pan/${id}/?role=${role()}`,
      // providesTags:["leadProfile"]
    }),
    // get the lead numbers
    getLeadTotalRecords: builder.query({
      query: () => `leads/totalRecords/?role=${role()}`,
    }),
    // get the totalRecordsForSupervisor
    getTotalRecordsForSupervisor: builder.query(
      {
        query: () => `leads/totalRecordsForSupervisor/`
      }
    ),
    // get the totalRecordsForSupervisor
    generateAadhaarLink: builder.query(
      {
        query: (id) => `verify/generate-link/${id}/?role=${role()}`
      }
    ),
    checkDetails: builder.query(
      {
        query: (id) => `verify/verifyAadhaar/${id}/?role=${role()}`
      }
    ),
  }),
});

// Export hooks for usage in functional components
// Note: Mutations use `useMutation`, not `useQuery`
export const {
  useLoginUserMutation,
  useLogoutMutation,
  useAdminBankMutation,
  useGetEmployeesQuery,
  useAllocateLeadMutation,
  useAddEmployeeMutation,
  useFetchAllEmployeeQuery,
  useFetchAllocatedLeadsQuery,
  useFetchAllLeadsQuery,
  useFetchSingleLeadQuery,
  useUploadDocumentsMutation,
  useUpdateLeadMutation,
  useLazyGetLeadDocsQuery,
  useGetInternalDedupeQuery,
  useApplicationLogsQuery,
  useBulkUploadMutation,
  useHoldLeadMutation,
  useFetchAllHoldLeadsQuery,
  useUnholdLeadMutation,
  useRecommendLeadMutation,
  useGetEmailOtpMutation,
  useVerifyEmailOtpMutation,
  useLazyAadhaarOtpQuery,
  useVerifyPanMutation,
  useVerifyAadhaarOtpMutation,
  useVerifyAadhaarMutation,
  useLazyGetPanDetailsQuery,
  useRejectLeadMutation,
  useLazyFetchCibilScoreQuery,
  useFetchAllRejectedLeadsQuery,
  useGetLeadTotalRecordsQuery,
  useGetTotalRecordsForSupervisorQuery,
  useLazyGenerateAadhaarLinkQuery,
  useLazyCheckDetailsQuery,

} = leadsApi;
