import React, { useEffect, useState } from 'react'
import LeadProfile from '../../page/LeadProfile'
import { useFetchAllHoldLeadsQuery, useFetchSingleLeadQuery } from '../../Service/Query';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import OTPVerificationUI from './OtpVerification';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';


const HoldLead = () => {
    const [holdLeads, setHoldLeads] = useState()
    const [totalHoldLeads, setTotalHoldLeads] = useState()
    const [id, setId] = useState(null)
    const {empInfo,activeRole} = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const {data,isSuccess,isError,error,refetch} = useFetchAllHoldLeadsQuery()
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
        setPaginationModel(newPaginationModel)
        refetch({ page: newPaginationModel.page +1, limit: newPaginationModel.pageSize}); // Adjust this according to your data fetching logic
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
            setHoldLeads(data?.heldLeads)
        setTotalHoldLeads(data?.heldLeads?.totalRecords)
        }
    }, [isSuccess, data])
    const columns = [
        { field: 'leadNo', headerName: 'Lead Number', width: 200 },
        { field: 'name', headerName: 'Full Name', width: 200 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
        { field: 'PAN', headerName: 'PA No.', width: 150 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'state', headerName: 'State', width: 150 },
        { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
        { field: 'salary', headerName: 'Salary', width: 150 },
        { field: 'source', headerName: 'Source', width: 150 },
        ...(activeRole === "sanctionHead" || activeRole === "admin" 
            ? [{ field: 'heldBy', headerName: 'Held By', width: 150 }] 
            : [])
    ];
    

    const rows = holdLeads?.leads?.map(lead => ({
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
        { heldBy: `${lead?.heldBy?.fName}${lead?.heldBy?.mName ? ` ${lead?.heldBy?.mName}` :``} ${lead?.heldBy?.lName}`,})
        
    }));


    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalHoldLeads}
                paginationModel={{paginationModel }}
                onPageChange={handlePageChange}
                onRowClick={handleRowClick}
                title="Leads Hold"
            />
        </>
    )
}

export default HoldLead
