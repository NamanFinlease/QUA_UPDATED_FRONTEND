import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { saveAs } from "file-saver"; // For file downloads
import * as Pap from "papaparse";
import useAuthStore from '../store/authStore';
import { useDisbursedQuery, useLazyExportDisbursedQuery } from '../../Service/applicationQueries';
import CustomToolbar from '../CustomToolbar';



const Disbursed = () => {
    const [disbursals, setDisbursals] = useState()
    const [totalDisbursals, setTotalDisbursals] = useState()
    const [id, setId] = useState(null)
    const { empInfo,activeRole } = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

  const [exportDisbursed, { data: exportData,isLoading:isExportLoading, isSuccess:isExportSuccess,isFetching:isExportFetching,isError:isExportErro,error:exportError }] = useLazyExportDisbursedQuery();
    const { data, isSuccess,isError,error, refetch } = useDisbursedQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    // const {data:applicationData,isSuccess:applicationSuccess} = useFetchSingleApplicationQuery(id,{skip:id===null})
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)

    }

    const handleLeadClick = (disbursal) => {
        navigate(`/disbursal-profile/${disbursal.id}`)
    }

    const handleExportClick = () => {
        console.log("Disbursed Export click");
        // Replace with your actual API call
        exportDisbursed();
      };



    const columns = [
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
            ? [{ field: 'disbursalHead', headerName: 'Disbursed By', width: 150 }]
            : [])
    ];

    console.log('disbursal',disbursals)

    const rows = disbursals?.map(disbursal => ({
        id: disbursal?._id,
        name: ` ${disbursal?.sanction?.application?.lead?.fName}  ${disbursal?.sanction?.application?.lead?.mName} ${disbursal?.sanction?.application?.lead?.lName}`,
        mobile: disbursal?.sanction?.application?.lead?.mobile,
        aadhaar: disbursal?.sanction?.application?.lead?.aadhaar,
        pan: disbursal?.sanction?.application?.lead?.pan,
        city: disbursal?.sanction?.application?.lead?.city,
        state: disbursal?.sanction?.application?.lead?.state,
        loanAmount: disbursal?.sanction?.application?.lead?.loanAmount,
        salary: disbursal?.sanction?.application?.lead?.salary,
        source: disbursal?.sanction?.application?.lead?.source,
        ...((activeRole === "disbursalHead" || activeRole === "admin") &&
            { disbursalHead: `${disbursal?.disbursedBy?.fName}${disbursal?.disbursedBy?.mName ? ` ${disbursal?.disbursedBy?.mName}` : ``} ${disbursal?.disbursedBy?.lName}`, })

    }));
    const formatDate = (date) => {
        const parsedDate = new Date(date);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return parsedDate.toLocaleDateString('en-US', options).replace(/,/g, '');
      };

    useEffect(() => {
        
        if (isExportSuccess && exportData && !isExportFetching) {
            console.log('useEffect',isExportSuccess,exportData,!isExportFetching)
          try {
            
            const formattedData = exportData?.data?.map((row) => {
                console.log('row',row)
              const csvData = {
                ...row,
                'Beneficiary Account No.': `"${row.accountNo}"`, // Add a leading single quote to force it as a string
                'Lead Created': row["Lead Created"] ? formatDate(row["Lead Created"]) : "",
                'Disbursed Date': row["Disbursed Date"] ? formatDate(row["Disbursed Date"]) : "",
                'Repayment Date': row["Repayment Date"] ? formatDate(row["Repayment Date"]) : "",
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
            console.log('blob',blob)
            saveAs(blob, "Disbursed_data.csv");
          } catch (error) {
            console.log('error',error)
          }
          // Preprocess the data to ensure accountNo is a string
        }
      }, [isExportSuccess, exportData,isExportFetching]);
    useEffect(() => {
      refetch({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
  }, [paginationModel]);

  useEffect(() => {
      if (data) {
          setDisbursals(data.disbursals)
          setTotalDisbursals(data?.totalDisbursals)
      }
  }, [isSuccess, data])

    return (
        <>
            <div className="crm-container">
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
                    Total Applicattion: {totalDisbursals || 0} {/* Defaults to 0 if no leads */}
                </div>
            </div>

            {columns && <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={totalDisbursals}
                    // loading={isLoading}
                    pageSizeOptions={[5]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={handlePageChange}
                    slots={{ toolbar: () => <CustomToolbar onExportClick={handleExportClick} /> }}
                    onRowClick={(params) => handleLeadClick(params)}
                    // sx={{
                    //     '& .MuiDataGrid-row:hover': {
                    //         cursor: 'pointer',
                    //     },
                    // }}
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
                            cursor: 'pointer',
                        },
                        '& .MuiDataGrid-row': {
                            color: "black"
                            // cursor: 'pointer',
                        },
                    }}
                />
            </div>}

            {(isError) &&
          <Alert severity="error" style={{ marginTop: "10px" }}>
            {error?.data?.message}
          </Alert>
        }

        </>
    )
}

export default Disbursed

