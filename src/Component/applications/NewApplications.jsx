import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
// import { useAllocateLeadMutation, useFetchAllLeadsQuery } from '../Service/Query';
import { useNavigate } from 'react-router-dom';
import { useAllocateApplicationMutation, useFetchAllApplicationQuery } from '../../Service/applicationQueries';
import Header from '../Header';
import useAuthStore from '../store/authStore';

const NewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { empInfo,activeRole } = useAuthStore()
  //   const apiUrl = import.meta.env.VITE_API_URL;
  const [allocateApplication, { data: updateApplication, isSuccess }] = useAllocateApplicationMutation();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const navigate = useNavigate()


  const { data: allApplication, isSuccess: applicationSuccess, refetch } = useFetchAllApplicationQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })





  const handleAllocate = async () => {
    // Perform action based on selected leads
    allocateApplication(selectedApplication);

  };

  const handleCheckboxChange = (id) => {
    setSelectedApplication(selectedApplication === id ? null : id);
  }


  const handlePageChange = (newPaginationModel) => {
    // Fetch new data based on the new page
    setPaginationModel(newPaginationModel)
    refetch(newPaginationModel); // Adjust this according to your data fetching logic
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/application-process")

    }

  }, [isSuccess, allApplication])



  useEffect(() => {
    refetch()
  }, [page, allApplication])

  useEffect(() => {
    if (applicationSuccess) {

      setApplications(allApplication);
      setTotalApplications(allApplication?.totalApplications)
    }

  }, [allApplication]);
  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        activeRole === "creditManager" &&
        <input
          type="checkbox"
          checked={selectedApplication === params.row.id}

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
    ...(activeRole === "sanctionHead" || activeRole === "admin"
      ? [{ field: 'recommendedBy', headerName: 'Recommended By', width: 150 }]
      : [])
  ];

  const rows = applications?.applications?.map(application => ({
    id: application?._id, // Unique ID for each lead
    name: `${application?.lead?.fName} ${application?.lead?.mName} ${application?.lead?.lName}`,
    mobile: application?.lead?.mobile,
    aadhaar: application?.lead?.aadhaar,
    pan: application?.lead?.pan,
    city: application?.lead?.city,
    state: application?.lead?.state,
    loanAmount: application?.lead?.loanAmount,
    salary: application?.lead?.salary,
    source: application?.lead?.source,
    ...((activeRole === "sanctionHead" || activeRole === "admin") &&
      { recommendedBy: `${application?.lead?.recommendedBy?.fName}${application?.lead?.recommendedBy?.mName ? ` ${application?.lead?.recommendedBy?.mName}` : ``} ${application?.lead?.recommendedBy?.lName}`, })

  }));

  return (
    <>
      <div className='crm-container'>
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
          Total Applicattion: {totalApplications || 0} {/* Defaults to 0 if no leads */}
        </div>

        {/* Action button for selected leads */}
        {activeRole === "creditManager" && <button
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

      {columns && <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalApplications}
          // loading={isLoading}
          pageSizeOptions={[5]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePageChange}
          sx={{
            color: '#1F2A40',  // Default text color for rows
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#1F2A40',  // Optional: Header background color
              color: 'white'  // White text for the headers
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#1F2A40',  // Footer background color
              color: 'white',  // White text for the footer
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'white',
              cursor: 'pointer',
            },
            '& .MuiDataGrid-row': {
              backgroundColor: 'white',
              // cursor: 'pointer',
            },
          }}
        />
      </div>}
    </>
  );
};

export default NewApplications;
