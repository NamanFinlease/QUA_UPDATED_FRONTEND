import React, { useEffect, useState } from 'react'
import { useFetchAllocatedLeadsQuery, useFetchSingleLeadQuery, useGetEmployeesQuery } from '../Service/Query';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useStore from '../Store';
import useAuthStore from '../Component/store/authStore';



const ProcessingLeads = () => {
    const [processingLeads, setProcessingLeads] = useState()
    const [totalLeads, setTotalLeads] = useState()
    const [id, setId] = useState(null)
    const {empInfo,activeRole} = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const { data, isSuccess, refetch } = useFetchAllocatedLeadsQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    const { data: LeadData, isSuccess: leadSuccess } = useFetchSingleLeadQuery(id, { skip: id === null })
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)

    }

    const handleLeadClick = (lead) => {
        setId(lead.id)
        navigate(`/lead-profile/${lead.id}`)
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
        { field: 'source', headerName: 'Source', width: 150 },
        ...(activeRole === "sanctionHead" || activeRole === "admin" 
            ? [{ field: 'screener', headerName: 'Screener', width: 150 }] 
            : [])

    ];

    const rows = processingLeads?.leads?.map(lead => ({
        id: lead?._id,
        name: ` ${lead?.fName}  ${lead?.mName} ${lead?.lName}`,
        mobile: lead?.mobile,
        aadhaar: lead?.aadhaar,
        pan: lead?.pan,
        city: lead?.city,
        state: lead?.state,
        loanAmount: lead?.loanAmount,
        salary: lead?.salary,
        source: lead?.source,
        ...((activeRole === "sanctionHead" || activeRole === "admin") &&
        { screener: `${lead?.screenerId?.fName}${lead?.screenerId?.mName ? ` ${lead?.screenerId?.mName}` :``} ${lead?.screenerId?.lName}`,})
    }));

    useEffect(() => {
        refetch({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
    }, [paginationModel]);

    useEffect(() => {
        if (data) {
            setProcessingLeads(data)
            setTotalLeads(data?.totalLeads)
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
                    Total Applicattion: {totalLeads || 0} {/* Defaults to 0 if no leads */}
                </div>
                </div>
                {columns && <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowCount={totalLeads}
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
                                cursor: 'pointer',
                            },
                        }}
                    />
                </div>}
            {/* </div> */}

        </>
    )
}

export default ProcessingLeads
