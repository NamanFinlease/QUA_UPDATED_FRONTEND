import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import useAuthStore from "../store/authStore";
import { useActiveLeadsQuery } from "../../Service/LMSQueries";
import CommonTable from "../CommonTable";

const ActiveLeads = () => {
    const [activeLeads, setActiveLeads] = useState();
    const [totalActiveLeads, setTotalActiveLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { data, isSuccess, isError, error, refetch } = useActiveLeadsQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
    });
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleLeadClick = (disbursal) => {
        console.log("The disbursal", disbursal);
        navigate(`/collection-profile/${disbursal.id}`);
    };
    const columns = [
        { field: "name", headerName: "Full Name", width: 200 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "aadhaar", headerName: "Aadhaar No.", width: 150 },
        { field: "pan", headerName: "PAN No.", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        { field: "loanAmount", headerName: "Loan Amount", width: 150 },
        { field: "salary", headerName: "Salary", width: 150 },
        { field: "source", headerName: "Source", width: 150 },
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

    const rows = activeLeads?.map((activeLead) => {
        const { lead } = activeLead?.data?.disbursal?.sanction?.application;
        return {
            id: activeLead?.data?.loanNo,
            name: ` ${lead?.fName}  ${lead?.mName} ${lead?.lName}`,
            mobile: lead?.mobile,
            aadhaar: lead?.aadhaar,
            pan: lead?.pan,
            city: lead?.city,
            state: lead?.state,
            loanAmount: lead?.loanAmount,
            salary: lead?.salary,
            source: lead?.source,
            ...((activeRole === "collectionHead" || activeRole === "admin") && {
                disbursalHead: `${active?.data?.disbursal?.disbursedBy?.fName}${
                    active?.data?.disbursal?.disbursedBy?.mName
                        ? ` ${active?.data?.disbursal?.disbursedBy?.mName}`
                        : ``
                } ${active?.data?.disbursal?.disbursedBy?.lName}`,
            }),
        };
    });

    useEffect(() => {
        refetch({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    }, [paginationModel]);

    useEffect(() => {
        console.log("data", data);
        if (data) {
            setActiveLeads(data.activeLeads);
            setTotalActiveLeads(data?.totalActiveLeads);
        }
    }, [isSuccess, data]);

    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalActiveLeads}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Active Leads"
            />
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}
        </>
    );
};

export default ActiveLeads;
