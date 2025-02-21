import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useFetchAllocatedApplicationQuery, useFetchSingleApplicationQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';


const ProcessingApplication = () => {
    const [processingApplication, setProcessingApplication] = useState();
    const [totalApplications, setTotalApplications] = useState();
    const [id, setId] = useState(null);
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const { data, isSuccess, refetch } = useFetchAllocatedApplicationQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
    });
    // const {data:applicationData,isSuccess:applicationSuccess} = useFetchSingleApplicationQuery(id,{skip:id===null})
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleLeadClick = (lead) => {
        navigate(`/application-profile/${lead.id}`);
    };

    useEffect(() => {
        refetch({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    }, [paginationModel]);

    useEffect(() => {
        if (data) {
            setProcessingApplication(data);
            setTotalApplications(data?.totalApplications);
        }
    }, [isSuccess, data]);

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
            ? [
                  {
                      field: "creditManagerId",
                      headerName: "Credit Manager",
                      width: 150,
                  },
              ]
            : []),
        { field: "breDecision", headerName: "BRE Decision", width: 200 },
        {
            field: "maxLoanByBRE",
            headerName: "Max Loan Recommended by BRE",
            width: 200,
        },
    ];

    const rows = processingApplication?.applications?.map((application) => ({
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
        ...((activeRole === "sanctionHead" || activeRole === "admin") && {
            creditManagerId: `${application?.creditManagerId?.fName}${
                application?.creditManagerId?.mName
                    ? ` ${application?.creditManagerId?.mName}`
                    : ``
            } ${application?.creditManagerId?.lName}`,
        }),
        breDecision: application?.bre?.finalDecision || "-",
        maxLoanByBRE: application?.bre?.maxLoanAmount || 0,
    }));

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalApplications}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Applications In Process"
            />
        </>
    );
};

export default ProcessingApplication;
