import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useFetchAllocatedApplicationQuery, useFetchSingleApplicationQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';



const ProcessingApplication = () => {
    const [processingApplication, setProcessingApplication] = useState()
    const [totalApplications, setTotalApplications] = useState()
    const [id, setId] = useState(null)
    const { empInfo,activeRole } = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const { data, isSuccess, refetch } = useFetchAllocatedApplicationQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    // const {data:applicationData,isSuccess:applicationSuccess} = useFetchSingleApplicationQuery(id,{skip:id===null})
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)

    }

    const handleLeadClick = (lead) => {
        navigate(`/application-profile/${lead.id}`)
    }


    useEffect(() => {
        refetch({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
    }, [paginationModel]);

    useEffect(() => {
        if (data) {
            setProcessingApplication(data)
            setTotalApplications(data?.totalApplications)
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
        ...(activeRole === "sanctionHead" || activeRole === "admin"
            ? [{ field: 'creditManagerId', headerName: 'Credit Manager', width: 150 }]
            : [])
    ];

    const rows = processingApplication?.applications?.map(application => ({
        id: application?._id,
        name: ` ${application?.lead?.fName}  ${application?.lead?.mName} ${application?.lead?.lName}`,
        mobile: application?.lead?.mobile,
        aadhaar: application?.lead?.aadhaar,
        pan: application?.lead?.pan,
        city: application?.lead?.city,
        state: application?.lead?.state,
        loanAmount: application?.lead?.loanAmount,
        salary: application?.lead?.salary,
        source: application?.lead?.source,
        ...((activeRole === "sanctionHead" || activeRole === "admin") &&
            { creditManagerId: `${application?.creditManagerId?.fName}${application?.creditManagerId?.mName ? ` ${application?.creditManagerId?.mName}` : ``} ${application?.creditManagerId?.lName}`, })

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

        </>
    )
}

export default ProcessingApplication

