import React, { useEffect, useState } from "react";
import { useSanctionedQuery } from "../../Service/applicationQueries";
import { Alert } from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarExport } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver"; // For file downloads
import * as Pap from "papaparse"; // For CSV conversion
import { useLazyExportSanctionedQuery } from "../../Service/applicationQueries";
import useAuthStore from "../store/authStore";
import CustomToolbar from "../CustomToolbar";

const Sanctioned = () => {
    const { activeRole } = useAuthStore();

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [totalApplications, setTotalApplications] = useState();
    const [page, setPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { data, isSuccess, isLoading, isError, error, refetch } =
        useSanctionedQuery({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });

    const [
        exportSanctioned,
        {
            data: exportData,
            isLoading: isExportLoading,
            isSuccess: isExportSuccess,
            isFetching: isExportFetching,
            isError: isExportErro,
            error: exportError,
        },
    ] = useLazyExportSanctionedQuery();

    const handleExportClick = () => {
        console.log("Export click");
        // Replace with your actual API call
        exportSanctioned();
    };

    const handlePageChange = (newPaginationModel) => {
        // Fetch new data based on the new page
        setPaginationModel(newPaginationModel);
        // refetch()
    };

    const handleLeadClick = (lead) => {
        navigate(`/sanction-profile/${lead.id}`);
    };

    const columns = [
        { field: "name", headerName: "Full Name", width: 200 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "aadhaar", headerName: "Aadhaar No.", width: 150 },
        { field: "pan", headerName: "PAN No.", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        {
            field: "loanRecommended",
            headerName: "Sanctioned Amount",
            width: 150,
        },
        { field: "salary", headerName: "Salary", width: 150 },
        ...(activeRole === "sanctionHead" || activeRole === "admin"
            ? [
                  {
                      field: "recommendedBy",
                      headerName: "Recommended By",
                      width: 150,
                  },
              ]
            : []),
        { field: "source", headerName: "Source", width: 150 },
    ];

    const rows = applications?.map((sanction) => ({
        id: sanction?._id, // Unique ID for each lead
        name: `${sanction?.application?.lead?.fName} ${sanction?.application?.lead?.mName} ${sanction?.application?.lead?.lName}`,
        mobile: sanction?.application?.lead?.mobile,
        aadhaar: sanction?.application?.lead?.aadhaar,
        pan: sanction?.application?.lead?.pan,
        city: sanction?.application?.lead?.city,
        state: sanction?.application?.lead?.state,
        loanRecommended: sanction?.camDetails?.loanRecommended,
        salary: sanction?.camDetails?.actualNetSalary,
        ...((activeRole === "sanctionHead" || activeRole === "admin") && {
            recommendedBy: `${sanction?.application?.recommendedBy?.fName}${
                sanction?.application?.recommendedBy?.mName
                    ? ` ${sanction?.application?.recommendedBy?.mName}`
                    : ``
            } ${sanction?.application?.recommendedBy?.lName}`,
        }),
        source: sanction?.application?.lead?.source,
    }));

    useEffect(() => {
        console.log("export", exportData);
        if (isExportSuccess && exportData) {
            try {
                const formattedData = exportData?.data?.map((row) => {
                    const csvData = {
                        ...row,
                        "Account No": `"${row.accountNo}"`, // Add a leading single quote to force it as a string
                    };
                    delete csvData.accountNo;
                    return csvData;
                });

                console.log("export data", exportData, formattedData);
                // Convert JSON to CSV using PapaParse
                const csv = Pap.unparse(formattedData, {
                    header: true, // Include headers in the CSV
                });

                // Create a Blob for the CSV content
                const blob = new Blob([csv], {
                    type: "text/csv;charset=utf-8",
                });

                // Use file-saver to download the file
                saveAs(blob, "Sanctioned Data.csv");
            } catch (error) {
                console.log("error", error);
            }
            // Preprocess the data to ensure accountNo is a string
        }
    }, [isExportSuccess, exportData, isExportFetching]);

    useEffect(() => {
        if (isSuccess && data?.sanction && data.sanction.length > 0) {
            setApplications(data.sanction);
            setTotalApplications(data.totalSanctions);
        }
    }, [isSuccess, data]);
    return (
        <>
            <div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "70px",
                        marginLeft: "20px",
                    }}
                >
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
                        {/* <h1>Sanctioned</h1> */}
                        Total Applicattions: {totalApplications || 0}
                    </div>
                </div>

                {columns && (
                    <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            rowCount={totalApplications}
                            // loading={isLoading}
                            slots={{
                                toolbar: () => (
                                    <CustomToolbar
                                        onExportClick={handleExportClick}
                                    />
                                ),
                            }}
                            pageSizeOptions={[5]}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={(pagination) =>
                                handlePageChange(pagination)
                            }
                            onRowClick={(params) => handleLeadClick(params)}
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
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                },
                                "& .MuiDataGrid-row": {
                                    backgroundColor: "white",
                                    // cursor: 'pointer',
                                },
                            }}
                        />
                    </div>
                )}
                {isError && (
                    <Alert severity="error" sx={{ borderRadius: "8px", mt: 2 }}>
                        {error?.data?.message}
                    </Alert>
                )}
            </div>
        </>
    );
};

export default Sanctioned;
