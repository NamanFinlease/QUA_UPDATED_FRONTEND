import { create } from "zustand";
import { devtools } from "zustand/middleware";

const Store = devtools((set, get) => ({
  login: false,
  employeeDetails: null,
  empInfo: null,
  applicationProfile: null,
  lead:null,
  setLogin: (payload) => {

    set(() => ({
      login: payload
    }));
  },

  setEmployeeDetails: (payload) => {

    set(() => ({
      employeeDetails: payload
    }));
  },
  setApplicationProfile: (payload) => {

    set(() => ({
      applicationProfile: payload
    }));
  },
  setLead: (payload) => {
    set(() => ({
      lead: payload
    }));
  },
}));

const useStore = create(Store);

export default useStore;
