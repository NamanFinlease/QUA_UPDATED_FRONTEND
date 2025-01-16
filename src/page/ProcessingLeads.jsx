import React, { useEffect, useState } from 'react'
import { useFetchAllocatedLeadsQuery, useFetchSingleLeadQuery, useGetEmployeesQuery } from '../Service/Query';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useStore from '../Store';
import useAuthStore from '../Component/store/authStore';
import CommonTable from '../Component/CommonTable';



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
    

    const handleRowClick = (lead) => {
        setId(lead.id)
        navigate(`/lead-profile/${lead.id}`)
    }

    const handlePageChange = (newPaginationModel) => {
        setPage(newPaginationModel);
        // Fetch new data based on the new page
        setPaginationModel(newPaginationModel)
        refetch({ page: newPaginationModel.page +1, limit: newPaginationModel.pageSize}); // Adjust this according to your data fetching logic
    };
    
    const columns = [
        { field: 'name', headerName: 'Full Name', width: 200 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
        { field: 'pan', headerName: 'Pan No.', width: 150 },
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
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalLeads}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleRowClick}
                title="Leads In Process"
                // actionButton={true}
                // actionButtonText="Allocate Leads"
                // onActionButtonClick={handleActionButtonClick}
            />
        </>
    )
}

export default ProcessingLeads
