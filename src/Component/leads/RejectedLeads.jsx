import React, { useEffect, useState } from 'react'
import LeadProfile from '../../page/LeadProfile'
import { useFetchAllHoldLeadsQuery, useFetchAllRejectedLeadsQuery, useFetchSingleLeadQuery } from '../../Service/Query';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';

const RejectedLeads = () => {
    const [rejectedLeads, setRejectedLeads] = useState()
    const [totalRejectedLeads, setTotalRejectedLeads] = useState()
    const { empInfo,activeRole } = useAuthStore()
    const [id, setId] = useState(null)
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const { data, isSuccess, isError, refetch } = useFetchAllRejectedLeadsQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    // const { data: LeadData, isSuccess: leadSuccess } = useFetchSingleLeadQuery(id, { skip: id === null })
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
        refetch({ page: newPaginationModel.page +1, limit: newPaginationModel.pageSize}); 
    }

    const handleRowClick = (lead) => {
        setId(lead.id)
        navigate(`/lead-profile/${lead.id}`)
    }

    useEffect(() => {
        refetch({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
    }, [paginationModel]);


    useEffect(() => {
        if (data) {
            setRejectedLeads(data?.rejectedLeads)
            setTotalRejectedLeads(data?.rejectedLeads?.totalLeads)
        }
    }, [isSuccess, data])

    const columns = [
        { field: 'leadNo', headerName: 'Lead Number', width: 200 },
        { field: 'name', headerName: 'Full Name', width: 200 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
        { field: 'pan', headerName: 'PAN No.', width: 150 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'state', headerName: 'State', width: 150 },
        { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
        { field: 'salary', headerName: 'Salary', width: 150 },
        ...(activeRole === "sanctionHead" || activeRole === "admin"
            ? [{ field: 'rejectedBy', headerName: 'Rejected By', width: 150 }]
            : [])
    ];

    const rows = rejectedLeads?.leads?.map(lead => ({
        id: lead?._id,
        leadNo: lead?.leadNo,
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
            { rejectedBy: `${lead?.rejectedBy?.fName}${lead?.rejectedBy?.mName ? ` ${lead?.rejectedBy?.mName}` : ``} ${lead?.rejectedBy?.lName}`, })
    }));

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalRejectedLeads}
                paginationModel={{ paginationModel}}
                onPageChange={handlePageChange}
                onRowClick={handleRowClick}
                title="Rejected Leads"
            />
        </>
    )
}

export default RejectedLeads
