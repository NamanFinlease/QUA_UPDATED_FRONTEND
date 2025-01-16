import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'universal-cookie';
import { BASE_URL } from './BaseURL';
const role = () => JSON.parse(localStorage.getItem("auth-storage")).state.activeRole
// Define a service using a base URL and expected endpoints
export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery: fetchBaseQuery({
    baseUrl:BASE_URL,
    credentials:"include",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },

  }),
  tagTypes: ["getApplication",
    "getProfile",
    "bankDetails",
    "recommendedApplications",
    "applicantDetails",
    'getDisbursals',
    "getCamDetails",
    "pendingSanctions",
    "sanctionProfile",
    "getPendinDisbursals"],
  endpoints: (builder) => ({
    // GET request to fetch a Pokemon by name
    holdApplication: builder.mutation({
      query: ({id,reason}) => ({

        url: `applications/hold/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getProfile"]
    }),
    rejectApplication: builder.mutation({
      query: ({id,reason}) => ({

        url: `applications/reject/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getProfile","getApplication"]
    }),
    sanctionReject: builder.mutation({
      query: ({id,reason}) => ({

        url: `sanction/reject/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getProfile","getApplication","pendingSanctions"]
    }),
    unholdApplication: builder.mutation({
      query: ({id,reason}) => ({

        url: `applications/unhold/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getProfile"]
    }),
    unholdDisbursal: builder.mutation({
      query: ({id,reason}) => ({

        url: `disbursals/unhold/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getProfile"]
    }),
    sendBack: builder.mutation({
      query: ({id,reason,sendTo}) => ({

        url: `applications/sent-back/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{sendTo,reason}
      }),
      invalidatesTags:["getApplication"]
    }),
    sanctionSendBack: builder.mutation({
      query: ({id,reason,sendTo}) => ({

        url: `sanction/sent-back/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{sendTo,reason}
      }),
      invalidatesTags:["getApplication","pendingSanctions"]
    }),
    disbursalSendBack: builder.mutation({
      query: ({id,reason,sendTo}) => ({

        url: `disbursals/sent-back/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{sendTo,reason}
      }),
      invalidatesTags:["getApplication","pendingSanctions"]
    }),
    sanctionApprove: builder.mutation({
      query: (id) => ({

        url: `sanction/approve/${id}/?role=${role()}`,
        method: 'PATCH',
      }),
      invalidatesTags:["sanctionProfile","pendingSanctions"]
    }),
    recommendApplication: builder.mutation({
      query: (id) => ({

        url: `applications/recommend/${id}/?role=${role()}`,
        method: 'PATCH',
      }),
      invalidatesTags:["recommendedApplications"]
    }),


    allocateApplication: builder.mutation({
      query: (id) => ({
        url: `/applications/${id}/?role=${role()}`,
        method: 'PATCH',
      }),
      invalidatesTags:["getApplication"]
    }),
    addBank: builder.mutation({
      query: ({id,data}) => ({

        url: `/verify/bank/${id}/?role=${role()}`,
        method: 'POST',
        body:data
      }),
      invalidatesTags:["getApplication","bankDetails"]
    }),
    updateBank: builder.mutation({
      query: ({id,data}) => ({

        url: `/applicant/bankDetails/${id}/?role=${role()}`,
        method: 'PATCH',
        body:data
      }),
      invalidatesTags:["getApplication","bankDetails"]
    }),
    updatePersonalDetails: builder.mutation({
      query: ({id,updates}) => ({

        url: `/applicant/${id}/?role=${role()}`,
        method: 'PATCH',
        body:updates
      }),
      invalidatesTags:["getApplication","applicantDetails"]
    }),
    allocateDisbursal: builder.mutation({
      query: (id) => ({
        url: `/disbursals/${id}/?role=${role()}`,
        method: 'PATCH',
      }),
      invalidatesTags:["getApplication"]
    }),
    recommendLoan: builder.mutation({
      query: ({id,remarks}) => ({
        url: `/disbursals/recommend/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{remarks}
      }),
      invalidatesTags:["getDisbursals"]
    }),
    disburseLoan: builder.mutation({
      query: ({id,data}) => ({
        url: `/disbursals/approve/${id}/?role=${role()}`,
        method: 'PATCH',
        body:data
      }),
      invalidatesTags:["getDisbursals"]
    }),
    holdDisbursal: builder.mutation({
      query: ({id,reason}) => ({

        url: `disbursals/hold/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getDisbursals","getPendinDisbursals"]
    }),
    rejectDisbursal: builder.mutation({
      query: ({id,reason}) => ({

        url: `disbursals/reject/${id}/?role=${role()}`,
        method: 'PATCH',
        body:{reason}
      }),
      invalidatesTags:["getProfile","getApplication","pendingSanctions"]
    }),
    fetchAllApplication: builder.query({
      query: ({ page, limit }) => `/applications/?page=${page}&limit=${limit}&role=${role()}`,
      providesTags:["getApplication"]
    }),
    fetchAllocatedApplication: builder.query({
      query: ({page,limit}) => `/applications/allocated/?page=${page}&limit=${limit}&role=${role()}`,
      providesTags: ["getApplication"]
    }),
    
    fetchSingleApplication: builder.query({
      query: (id) => `/applications/${id}/?role=${role()}`,
      providesTags: ["getProfile"]
    }),
    applicantPersonalDetails: builder.query({
      query: (id) => `/applicant/${id}/?role=${role()}`,
      providesTags: ["applicantDetails"]
    }),
    getBankDetails: builder.query({
      query: (id) => `/applicant/bankDetails/${id}/?role=${role()}`,
      providesTags:['bankDetails']
    }),
    allHoldApplication: builder.query({
      query: () => `/applications/hold/?role=${role()}`,
      providesTags: ["applicationHeld"]
    }),
    getCamDetails : builder.query({
      query : (id) => `/applications/cam/${id}/?role=${role()}`,
      providesTags:["getCamDetails"]
    }),
    updateCamDetails : builder.mutation({
      query: ({id,updates}) => ({

        url: `/applications/cam/${id}/?role=${role()}`,
        method: 'PATCH',
        body: {
          details: updates,  // Ensure updates is sent under the 'details' key
        },
      }),
      invalidatesTags : ['getCamDetails']
    }),
    getRejectedApplications: builder.query({
      query: () => `/applications/rejected/?role=${role()}`,
      providesTags:["getApplication"]
    }),
    pendingSanctions: builder.query({
      query: ({page,limit}) => `/sanction/pending/?role=${role()}`,
      providesTags:["pendingSanctions"] 
    }),
    eSignPending: builder.query({
      query: ({page,limit}) => `/sanction/eSignPending/?role=${role()}`,
      providesTags:["eSignPending"] 
    }),
    sendESign: builder.query({
      query: (id) => `/sanction/sendESign/${id}/?role=${role()}`,
      providesTags:["eSignPending"] 
    }),
    recommendedApplications: builder.query({
      query: ({page,limit}) => `/sanction/recommended/?page=${page}&limit=${limit}&role=${role()}`,
      providesTags:["recommendedApplications"]
    }),
    sanctionProfile: builder.query({
      query: (id) => `/sanction/${id}/?role=${role()}`,
      providesTags:["sanctionProfile"]
    }),
    sanctionPreview: builder.query({
      query: (id) => `/sanction/preview/${id}/?role=${role()}`,
      // providesTags:["getApplication"]
    }),
    sanctioned: builder.query({
      query: ({page,limit}) => `/sanction/approved/?role=${role()}`,
      // providesTags:["getApplication"]
    }),
    allDisbursals: builder.query({
      query: ({page,limit}) => `/disbursals/?role=${role()}`,
      // providesTags:["getApplication"]
    }),
    allocatedDisbursals: builder.query({
      query: ({page,limit}) => `/disbursals/allocated/?role=${role()}`,
      providesTags:["getDisbursals"]
    }),
    disbursalProfile: builder.query({
      query: (id) => `/disbursals/${id}/?role=${role()}`,
      // providesTags:["getApplication"]
    }),
    pendingDisbursal: builder.query({
      query: (id) => `/disbursals/pending/?role=${role()}`,
      providesTags:["getPendinDisbursals"]
    }),
    disbursed: builder.query({
      query: (id) => `/disbursals/disbursed/?role=${role()}`,
      // providesTags:["getApplication"]
    }),
    fetchDisbursalHold: builder.query({
      query: ({page,limit}) => `/disbursals/hold/?page=${page}&limit=${limit}&role=${role()}`,
      // providesTags:["getApplication"]
    }),
    rejectedDisbursals: builder.query({
      query: () => `/disbursals/rejected/?role=${role()}`,
      providesTags:["getApplication"]
    }),
    exportSanctioned: builder.query({
      query: () => `/sanction/approved/report/?role=${role()}`,
      providesTags:["getApplication"]
    }),
    exportDisbursed: builder.query({
      query: () => `/disbursals/disbursed/report/?role=${role()}`,
      
    }),
    
  }),
});
export const {
    useFetchAllApplicationQuery,
    useAllocateApplicationMutation,
    useHoldApplicationMutation,
    useRejectApplicationMutation,
    useSanctionRejectMutation,
    useUnholdApplicationMutation,
    useRecommendApplicationMutation,
    useAddBankMutation,
    useUpdateBankMutation,
    useSendBackMutation,
    useSanctionSendBackMutation,
    useDisbursalSendBackMutation,
    useSanctionApproveMutation,
    useUpdatePersonalDetailsMutation,
    useRecommendLoanMutation,
    useDisburseLoanMutation,
    useHoldDisbursalMutation,
    useUnholdDisbursalMutation,
    useRejectDisbursalMutation,
    useGetBankDetailsQuery,
    useFetchAllocatedApplicationQuery,
    useFetchSingleApplicationQuery,
    useApplicantPersonalDetailsQuery,
    useAllHoldApplicationQuery,
    useGetRejectedApplicationsQuery,  
    useGetCamDetailsQuery,
    useUpdateCamDetailsMutation,
    usePendingSanctionsQuery,
    useESignPendingQuery,
    useLazySendESignQuery,
    useSanctionProfileQuery,
    useSanctionedQuery,
    useRecommendedApplicationsQuery,
    useLazySanctionPreviewQuery,
    useAllDisbursalsQuery,
    useAllocateDisbursalMutation,
    useAllocatedDisbursalsQuery,
    useDisbursalProfileQuery,
    usePendingDisbursalQuery,
    useDisbursedQuery,
    useFetchDisbursalHoldQuery,
    useRejectedDisbursalsQuery,
    useLazyExportSanctionedQuery,
    useLazyExportDisbursedQuery,

} = applicationApi;
