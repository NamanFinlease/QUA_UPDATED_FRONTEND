import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useAllHoldApplicationQuery, useFetchDisbursalHoldQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';

const DisbursalHold = () => {
    const [holdApplications, setHoldApplications] = useState()
    const [totalHoldApplications, setTotalHoldApplications] = useState()
    const [id, setId] = useState(null)
    const {empInfo,activeRole} = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const {data,isSuccess,isLoading,isError,error} = useFetchDisbursalHoldQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
    }

    const handleLeadClick = (application) => {
        setId(application.id)
        navigate(`/disbursal-profile/${application.id}`)
    }



    useEffect(() => {
        if (data) {
            setHoldApplications(data?.heldApplications?.disbursals)
            setTotalHoldApplications(data?.heldApplications?.disbursals?.holdDisbursals)
        }
    }, [isSuccess, data])


    const columns = [
        { field: 'leadNo', headerName: 'Lead Number', width: 200 },
        { field: 'name', headerName: 'Full Name', width: 200 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
        { field: 'pan', headerName: 'PAN No.', width: 150 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'loanNo', headerName: 'Loan Number', width: 150 },
        { field: 'state', headerName: 'State', width: 150 },
        { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
        { field: 'salary', headerName: 'Salary', width: 150 },
        { field: 'source', headerName: 'Source', width: 150 },
        { field: "breDecision", headerName: "BRE Decision", width: 200 },
        { field: "maxLoanByBRE", headerName: "Max Loan Recommended by BRE",width: 200,},
        ...(activeRole === "disbursalHead" || activeRole === "admin"
            ? [{ field: 'heldBy', headerName: 'Hold By', width: 150 }]
            : [])
    ];

    const rows = holdApplications?.map(disbursal => ({
        id: disbursal?._id, 
        leadNo: disbursal?.sanction?.application?.lead?.leadNo,
        name: ` ${disbursal?.sanction?.application?.lead?.fName}  ${disbursal?.sanction?.application?.lead?.mName} ${disbursal?.sanction?.application?.lead?.lName}`,
        mobile: disbursal?.sanction?.application?.lead?.mobile,
        aadhaar: disbursal?.sanction?.application?.lead?.aadhaar,
        pan: disbursal?.sanction?.application?.lead?.pan,
        loanNo: disbursal?.sanction?.loanNo,
        city: disbursal?.sanction?.application?.lead?.city,
        state: disbursal?.sanction?.application?.lead?.state,
        loanAmount: disbursal?.sanction?.application?.lead?.loanAmount,
        salary: disbursal?.sanction?.application?.lead?.salary,
        source: disbursal?.sanction?.application?.lead?.source,
        breDecision: disbursal?.sanction?.application?.bre?.finalDecision || "-",
        maxLoanByBRE: disbursal?.sanction?.application?.bre?.maxLoanAmount || 0,
        ...((activeRole === "disbursalHead" || activeRole === "admin") &&
        { heldBy: `${disbursal?.sanction?.application?.heldBy?.fName}${disbursal?.sanction?.application?.heldBy?.mName ? ` ${disbursal?.sanction?.application?.heldBy?.mName}` : ``} ${disbursal?.sanction?.application?.heldBy?.lName}`, })
  
    }));

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalHoldApplications}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Hold Disbursals"
                isLoading={isLoading}
            />
            {/* <OTPVerificationUI /> */}
            {/* </div> */}

        </>
    )
}

export default DisbursalHold
