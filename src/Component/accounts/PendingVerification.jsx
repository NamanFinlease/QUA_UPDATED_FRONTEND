import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import {
    usePendingVerificationQuery,
    useVerifyPendingLeadMutation,
} from "../../Service/LMSQueries";
import { DataGrid } from "@mui/x-data-grid";

function PendingVerification() {
    const [pendingLeads, setPendingLeads] = useState();
    const [totalPendingLeads, setTotalPendingLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const { data, isSuccess, isError, error, refetch } =
        usePendingVerificationQuery({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });

    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleLeadClick = (disbursal) => {
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
    // console.log("The pending Leads id is",pendingLeads[0].data[0].loanNo)
    const rows = pendingLeads?.map((activeLead) => ({
        id: activeLead?.data?.loanNo || 0,
        name: ` ${activeLead?.data?.disbursal?.sanction?.application?.lead?.fName}  ${activeLead?.data?.disbursal?.sanction?.application?.lead?.mName} ${activeLead?.data?.disbursal?.sanction?.application?.lead?.lName}`,
        mobile: activeLead?.data?.disbursal?.sanction?.application?.lead
            ?.mobile,
        aadhaar:
            activeLead?.data?.disbursal?.sanction?.application?.lead?.aadhaar,
        pan: activeLead?.data?.disbursal?.sanction?.application?.lead?.pan,
        city: activeLead?.data?.disbursal?.sanction?.application?.lead?.city,
        state: activeLead?.data?.disbursal?.sanction?.application?.lead?.state,
        loanAmount:
            activeLead?.data?.disbursal?.sanction?.application?.lead
                ?.loanAmount,
        salary: activeLead?.data?.disbursal?.sanction?.application?.lead
            ?.salary,
        source: activeLead?.data?.disbursal?.sanction?.application?.lead
            ?.source,
        ...((activeRole === "accountExecutive" || activeRole === "admin") && {
            disbursalHead: `${activeLead?.data?.disbursal?.disbursedBy?.fName}${
                activeLead?.data?.disbursal?.disbursedBy?.mName
                    ? ` ${activeLead?.data?.disbursal?.disbursedBy?.mName}`
                    : ``
            } ${activeLead?.data?.disbursal?.disbursedBy?.lName}`,
        }),
    }));

    useEffect(() => {
        refetch({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    }, [paginationModel]);

    useEffect(() => {
        if (data) {
            setPendingLeads(data?.leadsToVerify);
            setTotalPendingLeads(data?.totalActiveLeadsToVerify);
        }
    }, [isSuccess, data]);

    return (
        <>
            <div className="crm-container">
                <div
                    style={{
                        padding: "10px 20px",
                        fontWeight: "bold",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer",
                        marginBottom: "15px",
                    }}
                >
                    Total Pending Verifications: {totalPendingLeads || 0}{" "}
                    {/* Defaults to 0 if no leads */}
                </div>
            </div>

            {columns && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowCount={totalPendingLeads}
                        // loading={isLoading}
                        pageSizeOptions={[5]}
                        paginationModel={paginationModel}
                        paginationMode="server"
                        onPaginationModelChange={handlePageChange}
                        onRowClick={(params) => activeRole === "accountExecutive" ? handleLeadClick(params) : null}
                        sx={{
                            color: "#1F2A40", // Default text color for rows
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#1F2A40", // Optional: Header background color
                                color: "white", // White text for the headers
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: "#1F2A40", // Footer background color
                                color: "white", // White text for the footer
                            },
                            "& .MuiDataGrid-row:hover": {
                                cursor: "pointer",
                            },
                            "& .MuiDataGrid-row": {
                                color: "black",
                                // cursor: 'pointer',
                            },
                        }}
                    />
                </div>
            )}

            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}
        </>
    );
}

export default PendingVerification;
