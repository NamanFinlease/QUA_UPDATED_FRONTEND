import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useAllocateLeadMutation, useFetchAllLeadsQuery } from '../Service/Query';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';
import useAuthStore from '../Component/store/authStore';

const LeadNew = () => {
  const [leads, setLeads] = useState([]); // Stores lead details
  const [totalLeads, setTotalLeads] = useState(0); // Stores the total lead count
  const [page, setPage] = useState(1); // Current page
  const [selectedLeads, setSelectedLeads] = useState(null); // Stores selected leads
  const apiUrl = import.meta.env.VITE_API_URL;
  const [allocateLead, { data: updatedLeads, isSuccess }] = useAllocateLeadMutation();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const {empInfo,activeRole} = useAuthStore()
  const navigate = useNavigate()
  const { data: allLeads, refetch } = useFetchAllLeadsQuery({page:paginationModel.page+1,limit:paginationModel.pageSize})

  useEffect(() => {
    setLeads(allLeads);
  }, [page]);

  
  
  const handleAllocate = async () => {
    // Perform action based on selected leads
    allocateLead(selectedLeads);
    
  };

  const handleCheckboxChange = (id) => {
    setSelectedLeads(selectedLeads === id ? null : id);
  }

  const handlePageChange = (newPaginationModel) => {
    // setPage(newPaginationModel);
    // Fetch new data based on the new page
    setPaginationModel(newPaginationModel)
    refetch(newPaginationModel); // Adjust this according to your data fetching logic
  };

  useEffect(() => {
    if(isSuccess) navigate("/lead-process")

  },[isSuccess])

  useEffect(() => {
    refetch()
    setTotalLeads(allLeads?.totalLeads)
  }, [page, allLeads, updatedLeads])
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

  const rows = allLeads?.leads?.map(lead => ({
    id: lead?._id, // Unique ID for each lead
    name:` ${lead?.fName}  ${lead?.mName} ${lead?.lName}` ,
    mobile: lead?.mobile,
    aadhaar: lead?.aadhaar,
    pan: lead?.pan,
    city: lead?.city,
    state: lead?.state,
    loanAmount: lead?.loanAmount,
    salary: lead?.salary,
    source: lead?.source,
  }));

  return (
    <div>
      {/* Container for Lead counter and action button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '70px',
          marginLeft: '20px',
        }}
      >
        {/* Lead counter */}
        <div
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
        >
          Total Leads: {totalLeads || 0} {/* Defaults to 0 if no leads */}
        </div>

        {/* Action button for selected leads */}
        {activeRole === "screener" &&  <button
          onClick={handleAllocate}
          style={{
            marginLeft: '20px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Allocate
        </button>}
      </div>

      <Header />

      {columns && <div style={{ height: 400, width: '100%',  }}>
        <DataGrid
        sx={{color: '#1F2A40',  // Default text color for rows
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1F2A40',  // Optional: Header background color
            color: 'white'  // White text for the headers
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#1F2A40',  // Footer background color
            color: 'white',  // White text for the footer
          }}}
          rows={rows}
          columns={columns}
          rowCount={totalLeads}
          // loading={isLoading}
          pageSizeOptions={[10]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePageChange}
        />
      </div>}
    </div>
  );
};

export default LeadNew;
