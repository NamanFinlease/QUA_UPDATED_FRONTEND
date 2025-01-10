import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import useAuthStore from "../store/authStore";
import { useActiveLeadsQuery } from "../../Service/LMSQueries";

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
                    Total Applicattion: {totalActiveLeads || 0}{" "}
                    {/* Defaults to 0 if no leads */}
                </div>
            </div>

            {columns && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowCount={totalActiveLeads}
                        // loading={isLoading}
                        pageSizeOptions={[5]}
                        paginationModel={paginationModel}
                        paginationMode="server"
                        onPaginationModelChange={handlePageChange}
                        onRowClick={(params) => {
                            console.log(params);
                            return handleLeadClick(params);
                        }}
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
};

export default ActiveLeads;
