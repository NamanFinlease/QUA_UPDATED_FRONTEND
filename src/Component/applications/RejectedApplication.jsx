import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetRejectedApplicationsQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';

const RejectedApplication = () => {
    const [rejectedApplications, setRejectedApplications] = useState()
    const [totalRejectedApplcations, setTotalRejectedApplications] = useState()
    const {empInfo,activeRole} = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const { data, isSuccess, isLoading, isError, error } = useGetRejectedApplicationsQuery()
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
    }

    const handleLeadClick = (application) => {
        navigate(`/application-profile/${application.id}`)
    }

    useEffect(() => {
        if (data) {
            setRejectedApplications(data?.rejectedApplications?.application)
            setTotalRejectedApplications(data?.rejectedApplications?.totalApplications)
        }
    }, [isSuccess, data])

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
            ? [{ field: 'rejectedBy', headerName: 'Rejected By', width: 150 }]
            : [])
    ];
    const rows = rejectedApplications?.map(application => ({
        id: application?._id,
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
        { rejectedBy: `${application?.rejectedBy?.fName}${application?.rejectedBy?.mName ? ` ${application?.rejectedBy?.mName}` : ``} ${application?.rejectedBy?.lName}`, })
  
    }));

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalRejectedApplcations}
                paginationModel={{ paginationModel }}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Rejected Applications"
            />
        </>
    )
}

export default RejectedApplication
