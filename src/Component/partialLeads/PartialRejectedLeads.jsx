import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import useAuthStore from "../store/authStore";
import { useRejectedPartialLeadsQuery } from "../../Service/LMSQueries";
import CommonTable from "../CommonTable";

const PartialRejectedLeads = () => {
    const [allocatedLeads, setAllocatedLeads] = useState([]);
    const [totalAllocatedLeads, setTotalAllocatedLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { data, isSuccess, isError, error, refetch } = useRejectedPartialLeadsQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
    });

    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleLeadClick = (disbursal) => {
        console.log("The disbursal", disbursal.row.loanNo);
        navigate(`/collection-profile/${disbursal.row.loanNo}`);
    };
    const columns = [
      { field: 'name', headerName: 'Full Name', width: 200 },
      { field: 'mobile', headerName: 'Mobile', width: 150 },
      { field: 'pan', headerName: 'PAN No.', width: 150 },
      { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
      { field: 'salary', headerName: 'Salary', width: 150 },
      { field: 'source', headerName: 'Source', width: 150 },
      { field: 'city', headerName: 'City', width: 150 },
      { field: 'state', headerName: 'State', width: 150 },
      { field: 'pinCode', headerName: 'Pin Code', width: 150 },
      { field: 'email', headerName: 'Email', width: 150 },
    ];

    useEffect(() => {
        if (isSuccess && data) {
            console.log("success")
        }
    }, [isSuccess, data]);

    const rows = allocatedLeads?.map((allocatedLeads) => ({
      id: lead?._id,
      name: `${lead?.fName} ${lead?.mName} ${lead?.lName}`,
      mobile: lead?.mobile,
      pan: lead?.pan,
      loanAmount: lead?.loanAmount,
      salary: lead?.salary,
      source: lead?.source,
      city: lead?.city,
      state: lead?.state,
      pinCode: lead?.pinCode,
      email: lead?.email,
    }));

    useEffect(() => {
        refetch({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    }, [paginationModel]);

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalAllocatedLeads}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                // onRowClick={handleLeadClick}
                title="Rejected Partial Leads"
            />
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}
        </>
    );
};

export default PartialRejectedLeads;
