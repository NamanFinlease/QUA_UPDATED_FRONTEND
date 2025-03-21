import React, { useEffect, useState } from "react";
import { tokens } from "../theme";
import { useTheme, Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddTaskIcon from "@mui/icons-material/AddTask";

const CommonTable = ({
    columns,
    rows,
    totalRows,
    paginationModel,
    onPageChange,
    onRowClick,
    title,
    actionButton,
    onAllocateButtonClick,
    onExportButtonClick,
    loading,
    isExporting,
    isAllocating,
}) => {
    const { activeRole } = useAuthStore();
    const navigate = useNavigate();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handlePageChange = (newPage) => {
        onPageChange(newPage);
    };

    const handleRowClick = (params) => {
        if (onRowClick) {
            onRowClick(params);
        }
    };

    const handleActionButtonClick = (param) => {
        if (param === "allocate") {
            onAllocateButtonClick();
            console.log(onAllocateButtonClick());
        } else if (param === "exportCSV") {
            onExportButtonClick();
            console.log(onExportButtonClick());
        }
    };

    return (
        <div
            sx={{
                display: "inline-block",
                height: "100%",
            }}
        >
            {title && (
                <div
                    style={{
                        padding: "11px 20px",
                        margin: "20px 10px 10px 60px",
                        fontWeight: "bold",
                        background: colors.white[100],
                        color: colors.primary[400],
                        border: `1px solid ${colors.primary[400]}`,
                        borderTopRightRadius: "15px",
                        borderBottomLeftRadius: "15px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        display: "inline-block",
                    }}
                >
                    {title} : {totalRows || 0}
                </div>
            )}

            {actionButton && (
                <>
                    <div
                        style={{
                            display: "inline-block",
                        }}
                    >
                        {(activeRole === "sanctionHead" ||
                            activeRole === "disbursalManager" ||
                            activeRole === "disbursalHead" ||
                            activeRole === "admin") && (
                            <Button
                                onClick={() =>
                                    handleActionButtonClick("exportCSV")
                                }
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    padding: "10px 20px",
                                    background: colors.white[100],
                                    color: colors.greenAccent[700],
                                    border: `1px solid ${colors.greenAccent[700]}`,
                                    borderRadius: "0px 10px 0px 10px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    display: "inline-block",
                                    margin: "10px",
                                    textTransform: "capitalize",
                                    "& .Mui-disabled": {
                                        background: colors.greenAccent[700],
                                        color: colors.white[100],
                                    },
                                    ":hover": {
                                        background: colors.greenAccent[700],
                                        color: colors.white[100],
                                    },
                                }}
                            >
                                {isExporting ? (
                                    <CircularProgress
                                        size={10}
                                        color="inherit"
                                    />
                                ) : (
                                    <FileDownloadIcon
                                        style={{ marginRight: "5px" }}
                                    />
                                )}
                                {isExporting ? "Exporting..." : "Export CSV"}
                            </Button>
                        )}
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                        }}
                    >
                        {(activeRole === "screener" ||
                            activeRole === "creditManager" ||
                            activeRole === "disbursalManager" ||
                            activeRole === "collectionExecutive") && (
                            <Button
                                onClick={() =>
                                    handleActionButtonClick("allocate")
                                }
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    padding: "10px 20px",
                                    background: colors.white[100],
                                    color: colors.greenAccent[700],
                                    border: `1px solid ${colors.greenAccent[700]}`,
                                    borderRadius: "0px 10px 0px 10px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    display: "inline-block",
                                    margin: "10px",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        background: colors.greenAccent[700],
                                        color: colors.white[100],
                                    },
                                }}
                            >
                                {isAllocating ? (
                                    <CircularProgress
                                        size={10}
                                        color="inherit"
                                    />
                                ) : (
                                    <AddTaskIcon
                                        style={{ marginRight: "5px" }}
                                    />
                                )}
                                {isAllocating ? "Allocating..." : "Allocate"}
                            </Button>
                        )}
                    </div>
                </>
            )}

            <div style={{ height: 500, width: "100%", padding: "20px" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={totalRows}
                    pageSizeOptions={[10]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={handlePageChange}
                    onRowClick={handleRowClick}
                    loading={loading}
                    sx={{
                        border: "none",
                        borderTopRightRadius: "30px",
                        borderBottomLeftRadius: "30px",
                        boxShadow: "0px 0px 20px rgb(0,0,0,0.3)",
                        color: colors.primary[400], // Default text color for rows
                        "& .MuiDataGrid-columnHeaders ": {
                            background: colors.primary[400], // Optional: Header background color
                            color: colors.white[100], // White text for the headers
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: colors.primary[400], // Footer background color
                            color: colors.white[100], // White text for the footer
                        },
                        "& .MuiDataGrid-row:hover": {
                            cursor: "pointer",
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default CommonTable;
