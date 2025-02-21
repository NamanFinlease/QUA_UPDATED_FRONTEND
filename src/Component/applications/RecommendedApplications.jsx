import React, { useEffect, useState } from 'react'
import { useRecommendedApplicationsQuery } from '../../Service/applicationQueries'
import { Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';

const RecommendedApplications = () => {

    const {activeRole} = useAuthStore()

    const navigate = useNavigate()

    const [applications, setApplications] = useState([])
    const [totalApplications, setTotalApplications] = useState()
    const [page, setPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const handlePageChange = (newPaginationModel) => {
        // Fetch new data based on the new page
        setPaginationModel(newPaginationModel)
        // refetch(newPaginationModel); 
    };

    const handleLeadClick = (lead) => {
        navigate(`/sanction-profile/${lead.id}`)
    }

    const { data, isSuccess, isError, error } = useRecommendedApplicationsQuery({page:paginationModel.page+1,limit:paginationModel.pageSize})
    const columns = [
        { field: 'name', headerName: 'Full Name', width: 200 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
        { field: 'pan', headerName: 'PAN No.', width: 150 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'state', headerName: 'State', width: 150 },
        { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
        { field: 'salary', headerName: 'Salary', width: 150 },
        ...((activeRole === "sanctionHead" || activeRole === "admin" ) ?
         [{ field: 'recommendedBy', headerName: 'Recommended By', width: 150 }] :[]),
        { field: 'source', headerName: 'Source', width: 150 },
    ];

    const rows = applications?.map(sanction => {
        const {fName,mName,lName} = sanction?.application?.recommendedBy
        return ({
        id: sanction?._id, // Unique ID for each lead
        name: `${sanction?.application?.lead?.fName} ${sanction?.application?.lead?.mName} ${sanction?.application?.lead?.lName}`,
        mobile: sanction?.application?.lead?.mobile,
        aadhaar: sanction?.application?.lead?.aadhaar,
        pan: sanction?.application?.lead?.pan,
        city: sanction?.application?.lead?.city,
        state: sanction?.application?.lead?.state,
        loanAmount: sanction?.application?.lead?.loanAmount,
        salary: sanction?.application?.lead?.salary,
        ...((activeRole === "sanctionHead" || activeRole === "admin" ) && 
        { recommendedBy: `${fName}${mName ? ` ${mName}` :``} ${lName}`}),
        source: sanction?.application?.lead?.source,
    })});

    useEffect(() => {
        if (isSuccess && data?.recommended && data.recommended.length > 0) {
            setApplications(data.recommended)
            setTotalApplications(data.totalRecommended)
        }

    }, [isSuccess, data?.recommended])
    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalApplications}
                paginationModel={{ page: 1, pageSize: 10 }}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Pending E-Sign"
            />
        </>
    )
}

export default RecommendedApplications
