import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useAllHoldApplicationQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';

const HoldApplication = () => {
    const [holdApplications, setHoldApplications] = useState()
    const [totalHoldApplications, setTotalHoldApplications] = useState()
    const [id, setId] = useState(null)
    const {empInfo,activeRole} = useAuthStore()
    const navigate = useNavigate()
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const {data,isSuccess,isError,error} = useAllHoldApplicationQuery()
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
    }

    const handleLeadClick = (application) => {
        setId(application.id)
        navigate(`/application-profile/${application.id}`)
    }


    // useEffect(() => {
    //     refetch({ page: paginationModel.page + 1, limit: paginationModel.pageSize });
    // }, [paginationModel]);

    useEffect(() => {
        if (data) {
            setHoldApplications(data?.heldApplications?.applications)
        setTotalHoldApplications(data?.heldApplications?.totalRecords)
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
        { field: 'source', headerName: 'Source', width: 150 },
        ...(activeRole === "sanctionHead" || activeRole === "admin"
            ? [{ field: 'heldBy', headerName: 'Hold By', width: 150 }]
            : [])
    ];

    const rows = holdApplications?.map(application => ({
        id: application?._id, 
        leadNo: application?.leadNo, 
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
        { heldBy: `${application?.heldBy?.fName}${application?.heldBy?.mName ? ` ${application?.heldBy?.mName}` : ``} ${application?.heldBy?.lName}`, })
  
    }));

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalHoldApplications}
                paginationModel={{ paginationModel}}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Applications Hold"
            />            
            {/* <OTPVerificationUI /> */}
            {/* </div> */}

        </>
    )
}

export default HoldApplication
