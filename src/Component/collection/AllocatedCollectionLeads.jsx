import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import useAuthStore from "../store/authStore";
import { useAllocatedCollectionsListQuery } from "../../Service/LMSQueries";
import CommonTable from "../CommonTable";

const AllocatedCollectionLeads = () => {
    const [allocatedLeads, setAllocatedLeads] = useState([]);
    const [totalAllocatedLeads, setTotalAllocatedLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { data, isSuccess, isError, error, refetch } = useAllocatedCollectionsListQuery({
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
        { field: "leadNo", headerName: "Lead Number", width: 200 },
        { field: "name", headerName: "Full Name", width: 200 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "aadhaar", headerName: "Aadhaar No.", width: 150 },
        { field: "pan", headerName: "PAN No.", width: 150 },
        { field: "loanNo", headerName: "Loan Number", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        { field: "sanctionAmount", headerName: "Sanction Amount", width: 150 },
        { field: "salary", headerName: "Salary", width: 150 },
        // { field: "source", headerName: "Source", width: 150 },
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

    useEffect(() => {
        if (isSuccess && data) {
            setAllocatedLeads(data.collectionList || []);
            setTotalAllocatedLeads(data.collectionList.totalAllocatedLeads || 0);
        }
    }, [isSuccess, data]);

    const rows = allocatedLeads?.map((allocatedLeads) => ({
        
        id: allocatedLeads._id,
        leadNo: allocatedLeads?.leadNo,
        name: ` ${allocatedLeads.fName}  ${allocatedLeads.mName} ${allocatedLeads.lName}`,
        mobile: allocatedLeads.mobile,
        aadhaar: allocatedLeads.aadhaar,
        pan: allocatedLeads.pan,
        loanNo: allocatedLeads.loanNo,
        city: allocatedLeads.city,
        state: allocatedLeads.state,
        sanctionAmount: allocatedLeads.sanctionAmount,
        salary: allocatedLeads.salary,
        source: allocatedLeads.source,
        ...((activeRole === "collectionHead" || activeRole === "admin") && {
            disbursalHead: `${allocatedLeads.fName}${
                allocatedLeads.mName
                    ? ` ${allocatedLeads.mName}`
                    : ``
            } ${allocatedLeads.lName}`,
        }),
    }));
    console.log("rows", rows)

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
                onRowClick={handleLeadClick}
                title="Allocated Collection Leads"
            />
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}
        </>
    );
};

export default AllocatedCollectionLeads;
