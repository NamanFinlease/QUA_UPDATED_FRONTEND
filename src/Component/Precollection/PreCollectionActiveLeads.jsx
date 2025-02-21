import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import useAuthStore from "../store/authStore";
import { useActivePreCollectionLeadsQuery, useAllocatePreCollectionsMutation } from "../../Service/LMSQueries";
import CommonTable from "../CommonTable";

const PreCollectionActiveLeads = () => {
    const [activeLeads, setActiveLeads] = useState();
    const [totalActiveLeads, setTotalActiveLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const [selectedLeads, setSelectedLeads] = useState(null); // Stores selected leads
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { data , isSuccess, isError, error, refetch } = useActivePreCollectionLeadsQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
    });

    const [ allocateCollections, { data: collection, isSuccess: isAllocateSuccess, isError: isAllocateError, error: allocateError }] = useAllocatePreCollectionsMutation();

    const handleCheckboxChange = (id) => {
        setSelectedLeads(selectedLeads === id ? null : id);
    }

    const handleAllocate = async () => {
        console.log(selectedLeads)
        if (selectedLeads) {
            await allocateCollections(selectedLeads);
        } else {
            console.warn("No lead selected for allocation.");
        }
    };

    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel)
    };

    const columns = [
        {
            field: 'select',
            headerName: '',
            width: 50,
            renderCell: (params) => (
              activeRole === "collectionExecutive" &&
              <input
                type="checkbox"
                checked={selectedLeads === params.row.id}
      
                onChange={() => handleCheckboxChange(params.row.id)}
              />
            ),
          },
        { field: "leadNo", headerName: "Loan Number", width: 200 },
        { field: "name", headerName: "Full Name", width: 200 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "aadhaar", headerName: "Aadhaar No.", width: 150 },
        { field: "pan", headerName: "PAN No.", width: 150 },
        { field: "loanNo", headerName: "Loan Number", width: 150 },
        { field: "city", headerName: "City", width: 150 },
        { field: "state", headerName: "State", width: 150 },
        { field: "sanctionAmount", headerName: "Sanction Amount", width: 150 },
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

    const rows = activeLeads?.map((activeLead) => ({
        id: activeLead?._id,
        leadNo: activeLead?.leadNo,
        name: ` ${activeLead?.fName}  ${activeLead?.mName} ${activeLead?.lName}`,
        mobile: activeLead?.mobile,
        aadhaar: activeLead?.aadhaar,
        pan: activeLead?.pan,
        loanNo: activeLead?.loanNo,
        city: activeLead?.city,
        state: activeLead?.state,
        sanctionAmount: activeLead?.sanctionAmount,
        salary: activeLead?.salary,
        source: activeLead?.source,
        ...((activeRole === "collectionHead" || activeRole === "admin") && {
            disbursalHead: `${activeLead?.fName}${
                activeLead?.mName
                    ? ` ${activeLead?.mName}`
                    : ``
            } ${activeLead?.lName}`,
        }),
    }));

    useEffect(() => {
        if (isAllocateSuccess) {
          navigate("/allocatedPreCollectionLeads")
        }
      }, [isAllocateSuccess, collection])

    useEffect(() => {
        refetch();
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
                title="PreCollection Active Leads"
                actionButton={true}
                onAllocateButtonClick={handleAllocate}
            />
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}
        </>
    );
};

export default PreCollectionActiveLeads;