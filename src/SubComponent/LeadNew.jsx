// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { DataGrid } from '@mui/x-data-grid';
// import { useAllocateLeadMutation, useFetchAllLeadsQuery } from '../Service/Query';
// import { useNavigate } from 'react-router-dom';
// import Header from '../Component/Header';
// import useAuthStore from '../Component/store/authStore';
// import { tokens } from '../theme';
// import { useTheme } from '@mui/material/styles';
// import CommonTable from '../Component/CommonTable';

// const LeadNew = () => {
//   const [leads, setLeads] = useState([]); // Stores lead details
//   const [totalLeads, setTotalLeads] = useState(0); // Stores the total lead count
//   const [page, setPage] = useState(1); // Current page
//   const [selectedLeads, setSelectedLeads] = useState(null); // Stores selected leads
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [allocateLead, { data: updatedLeads, isSuccess }] = useAllocateLeadMutation();
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 10,
//   });
//   const {empInfo,activeRole} = useAuthStore()
//   const navigate = useNavigate()
//   const { data: allLeads, refetch } = useFetchAllLeadsQuery({page:paginationModel.page+1,limit:paginationModel.pageSize})

//   useEffect(() => {
//     setLeads(allLeads);
//   }, [page]);

//   //color theme
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
  
//   const handleAllocate = async () => {
//     // Perform action based on selected leads
//     allocateLead(selectedLeads);
    
//   };

//   const handleCheckboxChange = (id) => {
//     setSelectedLeads(selectedLeads === id ? null : id);
//   }

//   const handlePageChange = (newPaginationModel) => {
//     // setPage(newPaginationModel);
//     // Fetch new data based on the new page
//     setPaginationModel(newPaginationModel)
//     refetch(newPaginationModel); // Adjust this according to your data fetching logic
//   };

//   useEffect(() => {
//     if(isSuccess) navigate("/lead-process")

//   },[isSuccess])

//   useEffect(() => {
//     refetch()
//     setTotalLeads(allLeads?.totalLeads)
//   }, [page, allLeads, updatedLeads])
//   const columns = [
//     {
//       field: 'select',
//       headerName: '',
//       width: 50,
//       renderCell: (params) => (
//         activeRole === "screener" &&
//         <input
//           type="checkbox"
//           checked={selectedLeads === params.row.id}

//           onChange={() => handleCheckboxChange(params.row.id)}
//         />
//       ),
//     },
//     { field: 'name', headerName: 'Full Name', width: 200 },
//     { field: 'mobile', headerName: 'Mobile', width: 150 },
//     { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
//     { field: 'pan', headerName: 'Pan No.', width: 150 },
//     { field: 'city', headerName: 'City', width: 150 },
//     { field: 'state', headerName: 'State', width: 150 },
//     { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
//     { field: 'salary', headerName: 'Salary', width: 150 },
//     { field: 'source', headerName: 'Source', width: 150 },
//   ];

//   const rows = allLeads?.leads?.map(lead => ({
//     id: lead?._id, // Unique ID for each lead
//     name:` ${lead?.fName}  ${lead?.mName} ${lead?.lName}` ,
//     mobile: lead?.mobile,
//     aadhaar: lead?.aadhaar,
//     pan: lead?.pan,
//     city: lead?.city,
//     state: lead?.state,
//     loanAmount: lead?.loanAmount,
//     salary: lead?.salary,
//     source: lead?.source,
//   }));

//   return (
//     <>
//       <CommonTable
//         columns={columns}
//         rows={rows}
//         totalRows={totalLeads}
//         paginationModel={paginationModel}
//         onPageChange={handlePageChange}
//         // onRowClick={handleRowClick}
//         title="New Leads"
//         actionButton={true}
//         onAllocateButtonClick={handleAllocate}
//         // onActionButtonClick={handleActionButtonClick}
//       />
//       </>
//   );
// };

// export default LeadNew;


import { useEffect, useState } from 'react';
import React from 'react';
import { useAllocateLeadMutation, useFetchAllLeadsQuery } from '../Service/Query';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';
import CommonTable from '../Component/CommonTable';
import useAuthStore from '../Component/store/authStore';


const LeadNew = () => {
  const [leads, setLeads] = useState([]); // Stores lead details
  const [totalLeads, setTotalLeads] = useState(0); // Stores the total lead count
  const [page, setPage] = useState(1); // Current page 
  const [selectedLeads, setSelectedLeads] = useState(null); // Stores selected leads
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isAllocating, setIsAllocating] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const { empInfo, activeRole } = useAuthStore();
  const navigate = useNavigate();
  const { data: allLeads,isLoading, refetch } = useFetchAllLeadsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const [allocateLead, { data: updatedLeads, isSuccess }] = useAllocateLeadMutation();
  
  useEffect(() => {
    if (allLeads) {
      setLeads(allLeads.leads);
      setTotalLeads(allLeads.totalLeads);
    }
  }, [allLeads]);

  useEffect(() => {
        refetch()
        setTotalLeads(allLeads?.totalLeads)
      }, [page, allLeads, updatedLeads])

  useEffect(() => {
    setLeads(allLeads);
  }, [page]);    

  const handleCheckboxChange = (id) => {
    setSelectedLeads(selectedLeads === id ? null : id);
  }

  const handleAllocate = async () => {
    setIsAllocating(true);
    await allocateLead(selectedLeads);
    setIsAllocating(false);
  };

  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        activeRole === "screener" &&
        <input
          type="checkbox"
          checked={selectedLeads === params.row.id}

          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: 'leadNo', headerName: 'Lead Number', width: 200 },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
    { field: 'pan', headerName: 'PAN No.', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 150 },
    { field: 'source', headerName: 'Source', width: 150 },
  ];

  const rows = allLeads?.leads?.map((lead) => ({
      id: lead?._id,
      leadNo: lead?.leadNo,
      name: `${lead?.fName} ${lead?.mName} ${lead?.lName}`,
      mobile: lead?.mobile,
      aadhaar: lead?.aadhaar,
      pan: lead?.pan,
      city: lead?.city,
      state: lead?.state,
      loanAmount: lead?.loanAmount,
      salary: lead?.salary,
      source: lead?.source,
    })) || [];

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params);
    }
  };

  const handlePageChange = (newPaginationModel) => {
    // setPage(newPaginationModel);
    setPaginationModel(newPaginationModel)
    refetch({ page: newPaginationModel.page +1, limit: newPaginationModel.pageSize});
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/lead-process")
    }
  }, [isSuccess, allLeads])

  return (
    <>
      <CommonTable
        columns={columns}
        rows={rows}
        totalRows={totalLeads}
        paginationModel={paginationModel}
        onPageChange={handlePageChange}
        title="New Leads"
        actionButton={true}
        onAllocateButtonClick={handleAllocate}
        loading={isLoading}
        isAllocating={isAllocating}
      />
      </>
  );
};

export default LeadNew;