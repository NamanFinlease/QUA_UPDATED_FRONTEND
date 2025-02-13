import React, { useEffect, useState } from 'react'
import { useSanctionedQuery } from '../../Service/applicationQueries'
import { Alert } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarExport } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore';
import CustomToolbar from '../CustomToolbar';
import CommonTable from '../CommonTable';

const Sanctioned = () => {
    const { activeRole } = useAuthStore()

    const navigate = useNavigate()

    const [applications, setApplications] = useState([])
    const [totalApplications, setTotalApplications] = useState()
    const [page, setPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });


    const { data, isSuccess, isLoading, isError, error, refetch } = useSanctionedQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })
    const handlePageChange = (newPaginationModel) => {
        // Fetch new data based on the new page
        setPaginationModel(newPaginationModel)
        // refetch()
    };

    const handleLeadClick = (lead) => {
        navigate(`/sanction-profile/${lead.id}`)
    }

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
        ...((activeRole === "sanctionHead" || activeRole === "admin") ?
            [{ field: 'recommendedBy', headerName: 'Recommended By', width: 150 }] : []),
        { field: 'source', headerName: 'Source', width: 150 },
    ];

    const rows = applications?.map(sanction => ({
        id: sanction?._id, // Unique ID for each lead
        leadNo: sanction?.application?.lead?.leadNo,
        name: `${sanction?.application?.lead?.fName} ${sanction?.application?.lead?.mName} ${sanction?.application?.lead?.lName}`,
        mobile: sanction?.application?.lead?.mobile,
        aadhaar: sanction?.application?.lead?.aadhaar,
        pan: sanction?.application?.lead?.pan,
        loanNo: sanction?.loanNo,
        city: sanction?.application?.lead?.city,
        state: sanction?.application?.lead?.state,
        loanAmount: sanction?.application?.lead?.loanAmount,
        salary: sanction?.application?.lead?.salary,
        ...((activeRole === "sanctionHead" || activeRole === "admin") &&
            { recommendedBy: `${sanction?.application?.recommendedBy?.fName}${sanction?.application?.recommendedBy?.mName ? ` ${sanction?.application?.recommendedBy?.mName}` : ``} ${sanction?.application?.recommendedBy?.lName}` }),
        source: sanction?.application?.lead?.source,
    }));

    useEffect(() => {
        if (isSuccess && data?.sanction && data.sanction.length > 0) {
            setApplications(data.sanction)
            setTotalApplications(data.totalSanctions)
        }

    }, [isSuccess, data])
    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalApplications}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Total Sanctioned"
            />
            <div>
                {isError &&
                    <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                        {error?.data?.message}
                    </Alert>
                }
            </div>
        </>
    )
}

export default Sanctioned
