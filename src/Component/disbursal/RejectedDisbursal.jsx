import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRejectedDisbursalsQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';


const RejectedDisbursal = () => {
    const [rejectedApplications, setRejectedApplications] = useState()
    const [totalRejectedApplcations, setTotalRejectedApplications] = useState()
    const {empInfo,activeRole} = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const { data, isSuccess, isLoading, isError, error } = useRejectedDisbursalsQuery()
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
    }

    const handleLeadClick = (disbursal) => {
        navigate(`/disbursal-profile/${disbursal.id}`)
    }

    useEffect(() => {
        if (data) {
            setRejectedApplications(data?.rejectedDisbursals?.disbursals)
            setTotalRejectedApplications(data?.rejectedDisbursals?.totalDisbursals)
        }
    }, [isSuccess, data])

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
            ? [{ field: 'rejectedBy', headerName: 'Rejected By', width: 150 }]
            : [])
    ];
    const rows = rejectedApplications?.map(disbursal => ({
        id: disbursal?._id,
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
        { rejectedBy: `${disbursal?.rejectedBy?.fName}${disbursal?.rejectedBy?.mName ? ` ${disbursal?.rejectedBy?.mName}` : ``} ${disbursal?.rejectedBy?.lName}`, })
  
    }));

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
                    Total Applicattion: {totalRejectedApplcations || 0} {/* Defaults to 0 if no leads */}
                </div>
                </div>
                {columns && <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowCount={totalRejectedApplcations}
                        loading={isLoading}
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
                                cursor: 'pointer',
                            },
                        }}
                    />
                </div>}
            {isError &&
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            }

        </>
    )
}

export default RejectedDisbursal
