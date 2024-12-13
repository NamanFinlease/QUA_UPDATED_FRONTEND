import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { leadsApi } from './Query'
import { applicationApi } from '../Service/applicationQueries'
import { lmsQueries } from './LMSQueries'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [leadsApi.reducerPath]: leadsApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [lmsQueries.reducerPath]: lmsQueries.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leadsApi.middleware,applicationApi.middleware,lmsQueries.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)