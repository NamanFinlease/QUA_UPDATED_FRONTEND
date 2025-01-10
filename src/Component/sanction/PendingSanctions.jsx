import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import { usePendingSanctionsQuery } from '../../Service/applicationQueries';
import CustomToolbar from '../CustomToolbar';

const PendingSanctions = () => {
  const [applications, setApplications] = useState([]); 
  const [totalApplications, setTotalApplications] = useState(0); 
  const [page, setPage] = useState(1); 
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate()


  const { data: allApplication,isSuccess:applicationSuccess, refetch } = usePendingSanctionsQuery({page:paginationModel.page+1,limit:paginationModel.pageSize})

  useEffect(() => {
    if(applicationSuccess){

        setApplications(allApplication?.sanctions);
        setTotalApplications(allApplication?.totalSanctions)
    }

  }, [page,allApplication,applicationSuccess]);





  

  const handlePageChange = (newPaginationModel) => {
    // Fetch new data based on the new page
    setPaginationModel(newPaginationModel)
  };

const handleLeadClick = (lead) => {
  navigate(`/sanction-profile/${lead.id}`)
}
  const columns = [
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
    { field: 'pan', headerName: 'PAN No.', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 150 },
    { field: 'recommendedBy', headerName: 'Recommended By', width: 150 },
    { field: 'source', headerName: 'Source', width: 150 },
  ];

  const rows = applications?.map(sanction => {
    return ({
    id: sanction?._id, // Unique ID for each lead
    name: `${sanction?.application?.lead?.fName} ${sanction?.application?.lead?.mName} ${sanction?.application?.lead?.lName}`,
    mobile: sanction?.application?.lead?.mobile,
    aadhaar: sanction?.application?.lead?.aadhaar,
    pan: sanction?.application?.lead?.pan,
    city: sanction?.application?.lead?.city,
    state: sanction?.application?.lead?.state,
    loanAmount: sanction?.application?.lead?.loanAmount,
    salary: sanction?.application?.lead?.salary,
    recommendedBy: `${sanction?.application?.recommendedBy?.fName}${sanction?.application?.recommendedBy?.mName ? ` ${sanction?.application?.recommendedBy?.mName}` : ``} ${sanction?.application?.recommendedBy?.lName}`,
    source: sanction?.application?.lead?.source,
  })});


  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '70px',
          marginLeft: '20px',
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            fontWeight: 'bold',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            marginBottom:"15px"
          }}
        >
          Total Applicattion: {totalApplications || 0} {/* Defaults to 0 if no leads */}
        </div>

      </div>

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
          onRowClick={(params) => handleLeadClick(params)}
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
    </div>
  );
};

export default PendingSanctions;
