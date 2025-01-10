import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { saveAs } from "file-saver"; // For file downloads
import * as Pap from "papaparse"; // For CSV conversion
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAllDisbursalsQuery, useAllocateDisbursalMutation, useLazyExportSanctionedQuery } from '../../Service/applicationQueries';
import Header from '../Header';
import useAuthStore from '../store/authStore';
import CustomToolbar from '../CustomToolbar';

const DisburseNew = () => {
  const [applications, setApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { empInfo, activeRole } = useAuthStore()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate()


  const [allocateApplication, { data: updateApplication, isSuccess, isError: isAllocateError, error: allocateError }] = useAllocateDisbursalMutation();
  const [exportSanctioned, { data: exportData, isLoading: isExportLoading, isSuccess: isExportSuccess, isFetching: isExportFetching, isError: isExportErro, error: exportError }] = useLazyExportSanctionedQuery();
  const { data: allApplication, isSuccess: applicationSuccess, isError, error, refetch } = useAllDisbursalsQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })





  const handleAllocate = async () => {
    allocateApplication(selectedApplication);

  };

  const handleExportClick = () => {
    console.log("Export click");
    // Replace with your actual API call
    exportSanctioned();
  };

  const handleCheckboxChange = (id) => {
    setSelectedApplication(selectedApplication === id ? null : id);
  }


  const handlePageChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)
    // refetch(newPaginationModel); 
  };


  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        activeRole === "disbursalManager" &&
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
    ...(activeRole === "disbursalHead" || activeRole === "admin"
      ? [{ field: 'recommendedBy', headerName: 'Recommended By', width: 150 }]
      : [])
  ];


  const rows = applications?.map(disbursal => ({
    id: disbursal?._id, // Unique ID for each lead
    name: `${disbursal?.sanction?.application?.lead?.fName} ${disbursal?.sanction?.application?.lead?.mName} ${disbursal?.sanction?.application?.lead?.lName}`,
    mobile: disbursal?.sanction?.application?.lead?.mobile,
    aadhaar: disbursal?.sanction?.application?.lead?.aadhaar,
    pan: disbursal?.sanction?.application?.lead?.pan,
    city: disbursal?.sanction?.application?.lead?.city,
    state: disbursal?.sanction?.application?.lead?.state,
    loanAmount: disbursal?.sanction?.application?.lead?.loanAmount,
    salary: disbursal?.sanction?.application?.lead?.salary,
    source: disbursal?.sanction?.application?.lead?.source,
    ...((activeRole === "disbursalHead" || activeRole === "admin") &&
      { recommendedBy: `${disbursal?.sanction?.application?.lead?.recommendedBy?.fName}${disbursal?.sanction?.application?.lead?.recommendedBy?.mName ? ` ${disbursal?.sanction?.application?.lead?.recommendedBy?.mName}` : ``} ${disbursal?.sanction?.application?.lead?.recommendedBy?.lName}`, })

  }));

  console.log('rows', rows)

  useEffect(() => {
    console.log('export',exportData)
    if (isExportSuccess && exportData) {
      try {
        
        const formattedData = exportData?.data?.map((row) => {
          const csvData = {
            ...row,
            'Account No': `"${row.accountNo}"`, // Add a leading single quote to force it as a string
          }
          delete csvData.accountNo
          return csvData
        });

        console.log('export data',exportData,formattedData)
        // Convert JSON to CSV using PapaParse
        const csv = Pap.unparse(formattedData, {
          header: true, // Include headers in the CSV
        });
  
        // Create a Blob for the CSV content
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  
        // Use file-saver to download the file
        saveAs(blob, "sanctioned_data.csv");
      } catch (error) {
        console.log('error',error)
      }
      // Preprocess the data to ensure accountNo is a string
    }
  }, [isExportSuccess, exportData,isExportFetching]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/disbursal-process")
    }
  }, [isSuccess, allApplication])

  useEffect(() => {
    // refetch()
  }, [page, allApplication])

  useEffect(() => {
    if (applicationSuccess) {
      setApplications(allApplication.disbursals);
      setTotalApplications(allApplication?.totalDisbursals)
    }

  }, [allApplication]);

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
        {activeRole === "disbursalManager" && <button
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
          slots={{ toolbar: () => <CustomToolbar onExportClick={handleExportClick} /> }}
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

export default DisburseNew;
