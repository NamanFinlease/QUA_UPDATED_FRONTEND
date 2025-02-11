import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import useAuthStore from "../store/authStore";
import { useActiveLeadsQuery, useFetchRepaymentDetailsQuery } from "../../Service/LMSQueries";
import CommonTable from "../CommonTable";
import ClosingRequest from "./ClosingRequest";
import RequestFieldVisit from "../repayment/RequestFieldVisit";
import OutstandingLoanAmount from "./OutstandingLoanAmount";

const CollectionDetails = ({repaymentId}) => {
    const [activeLeads, setActiveLeads] = useState();
    const [collectionData, setCollectionData] = useState()
    const [totalActiveLeads, setTotalActiveLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();

    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const id = repaymentId;
    console.log(id)

    const { data: fetchRepaymentDetails, isSuccess: isFetchRepaymentSuccess, isError: isFetchRepaymentError, error: FetchRepaymenterror, } = 
        useFetchRepaymentDetailsQuery( id, {skip:id ===null});

    console.log(fetchRepaymentDetails)
    
    const { data, isSuccess, isError, error, refetch } = useActiveLeadsQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
    });
    
    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const columns = [
        { field: "followupId", headerName: "Followup ID", width: 150 },
        { field: "followupBy", headerName: "Followup By", width: 150 },
        { field: "followupInitiatedOn", headerName: "Followup Initiated on", width: 150 },
        { field: "followupType", headerName: "Followup Type", width: 150 },
        { field: "followupStatus", headerName: "Followup Status", width: 150 },
        { field: "followupRemarks", headerName: "Followup Remarks", width: 150 },
        { field: "followupScheduleOn", headerName: "Followup Schedule On", width: 150 },
        { field: "cfeSelfie", headerName: "CFE Selfie with Customer", width: 150 },
        { field: "locationSelfie", headerName: "Selfie at the Location", width: 150 },
        { field: "distanceCovered", headerName: "Total Distance Covered", width: 150 },
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

    // const rows = activeLeads?.map((activeLead) => {
    //     const { lead } = activeLead?.data?.disbursal?.sanction?.application;
    //     return {
    //         id: activeLead?.data?.loanNo,
    //         name: ` ${lead?.fName}  ${lead?.mName} ${lead?.lName}`,
    //         mobile: lead?.mobile,
    //         aadhaar: lead?.aadhaar,
    //         pan: lead?.pan,
    //         city: lead?.city,
    //         state: lead?.state,
    //         loanAmount: lead?.loanAmount,
    //         salary: lead?.salary,
    //         source: lead?.source,
    //         ...((activeRole === "collectionHead" || activeRole === "admin") && {
    //             disbursalHead: `${active?.data?.disbursal?.disbursedBy?.fName}${
    //                 active?.data?.disbursal?.disbursedBy?.mName
    //                     ? ` ${active?.data?.disbursal?.disbursedBy?.mName}`
    //                     : ``
    //             } ${active?.data?.disbursal?.disbursedBy?.lName}`,
    //         }),
    //     };
    // });

    useEffect(()=>{
        if(fetchRepaymentDetails && isFetchRepaymentSuccess){
            setCollectionData(fetchRepaymentDetails)
        }
    },[fetchRepaymentDetails, isFetchRepaymentSuccess])

    useEffect(() => {
        refetch({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    }, [paginationModel]);

    // useEffect(() => {
    //     console.log("data", data);
    //     if (data) {
    //         setActiveLeads(data.activeLeads);
    //         setTotalActiveLeads(data?.totalActiveLeads);
    //     }
    // }, [isSuccess, data]);

    return (
        <>
            <OutstandingLoanAmount outstandingDetails={collectionData} />
            <CommonTable
                columns={columns}
                // rows={rows}
                // totalRows={}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
            />

            
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}

            <RequestFieldVisit />
        </>
    );
};

export default CollectionDetails;
