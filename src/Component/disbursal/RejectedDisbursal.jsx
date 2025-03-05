import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRejectedDisbursalsQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';

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
        { field: 'leadNo', headerName: 'Lead Number', width: 200 },
        { field: 'name', headerName: 'Full Name', width: 200 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
        { field: 'pan', headerName: 'PAN No.', width: 150 },
        { field: 'loanNo', headerName: 'Loan Number', width: 150 },
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
        leadNo: disbursal?.sanction?.application?.lead?.leadNo,
        name: `${disbursal?.sanction?.application?.lead?.fName} ${disbursal?.sanction?.application?.lead?.mName} ${disbursal?.sanction?.application?.lead?.lName}`,
        mobile: disbursal?.sanction?.application?.lead?.mobile,
        aadhaar: disbursal?.sanction?.application?.lead?.aadhaar,
        pan: disbursal?.sanction?.application?.lead?.pan,
        loanNo: disbursal?.sanction?.loanNo,
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
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalRejectedApplcations}
                paginationModel={{ paginationModel }}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Rejected Disbursals"
                loading={isLoading}
            />
            {isError &&
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            }

        </>
    )
}

export default RejectedDisbursal
