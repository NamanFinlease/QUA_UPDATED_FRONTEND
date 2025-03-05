import React, { useState, useEffect } from "react";
import { Alert } from '@mui/material';
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useClosedLeadsQuery } from "../../Service/LMSQueries";
import { DataGrid } from "@mui/x-data-grid";
import CommonTable from "../CommonTable";

function CloseLeads() {
    const [closedLeads, setClosedLeads] = useState();
    const [totalClosedLeads, setTotalClosedLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { data, isSuccess, isLoading, isError, error, refetch } = useClosedLeadsQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
    });

    const handleLeadClick = (disbursal) => {
        console.log("The disbursal", disbursal.row.loanNo);
        navigate(`/collection-profile/${disbursal.row.loanNo}`);
    };

    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
        refetch({ page: newPaginationModel.page +1, limit: newPaginationModel.pageSize});
    };

    const columns = [
        { field: "leadNo", headerName: "Lead Number", width: 180 },
        { field: "loanNo", headerName: "Loan Number", width: 150 },
        // { field: "loanAmount", headerName: "Loan Amount", width: 150 },
        { field: "name", headerName: "Full Name", width: 200 },
        { field: "gender", headerName: "Gender", width: 100 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "email", headerName: "E-Mail", width: 150 },
        { field: "pan", headerName: "PAN No.", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        // { field: "repaymentAmount", headerName: "Repayment Amount", width: 150 },
        ...(activeRole === "collectionHead" || activeRole === "admin"
            ? [
                  {
                      field: "disbursalHead",
                      headerName: "Disbursed By",
                      width: 150,
                  },
              ]
            : []),
    ];

    const rows = data?.closedList.map((closedLead) => ({
        id : closedLead?.leadNo,
        leadNo : closedLead?.leadNo,
        loanNo : closedLead?.loanNo,
        name : `${closedLead?.fName} ${closedLead?.mName} ${closedLead?.lName}`,
        gender : closedLead?.gender,
        mobile : closedLead?.mobile,
        email : closedLead?.email,
        pan : closedLead?.pan,
        city : closedLead?.city,
        state : closedLead?.state,
        // loanAmount : closedLead?.amount,

    }))

    useEffect(() => {
        refetch({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    }, [paginationModel]);

    useEffect(() => {
        if (data) {
            setClosedLeads(data?.closedLeads);
            setTotalClosedLeads(data?.totalClosedLeads);
        }
    }, [isSuccess, data]);

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalClosedLeads}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Closed Leads"
                loading={isLoading}
            />
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.message}
                </Alert>
            )}
        </>
    );
}

export default CloseLeads;
