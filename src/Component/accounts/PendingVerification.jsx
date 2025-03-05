import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import {
    usePendingVerificationQuery,
    usePendingVerificationListQuery,
    useVerifyPendingLeadMutation,
} from "../../Service/LMSQueries";
import { Alert } from '@mui/material'
import { DataGrid } from "@mui/x-data-grid";
import CommonTable from "../CommonTable";
import moment from 'moment';

function PendingVerification() {
    const [pendingLeads, setPendingLeads] = useState([]);
    const [totalPendingLeads, setTotalPendingLeads] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const { data, isSuccess, isLoading, isError, error, refetch } =
        usePendingVerificationListQuery();

    console.log(data)

    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    const handleLeadClick = (disbursal) => {
        console.log(disbursal)
        navigate(`/collection-profile/${disbursal?.row?.loanNo}`);
    };

    const columns = [
        { field: "name", headerName: "Full Name", width: 200 },
        { field: "loanNo", headerName: "Loan No", width: 150 },
        { field: "panNo", headerName: "Pan No.", width: 150 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "paymentTransactionId", headerName: "Transaction ID", width: 150 },
        { field: "receivedAmount", headerName: "Received Amount", width: 150 },
        { field: "paymentDate", headerName: "Payment Date", width: 150 },
    ];

    const rows = pendingLeads?.map((lead, index) => ({
        id: `${lead._id}-${index}`,
        name: `${lead?.fName} ${lead?.mName} ${lead?.lName}`,
        loanNo: lead?.loanNo,
        panNo: lead?.pan,
        mobile: lead?.mobile,
        paymentTransactionId: lead?.transactionId,
        receivedAmount: lead?.receivedAmount,
        paymentDate: moment(lead?.paymenDate).format("DD-MM-YYYY"),  
    }));
    

    useEffect(() => {
    if (isSuccess && data) {
        const uniqueLeads = [...new Map(data?.paymentList.map(lead => [lead._id, lead])).values()];
        setPendingLeads(uniqueLeads);
        setTotalPendingLeads(uniqueLeads.length);
    }
}, [isSuccess, data]);

    useEffect(() => {
        if (paginationModel.page >= 0) {
            refetch({
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
            });
        }
    }, [paginationModel]);

    useEffect(() => {
        if (isSuccess && data) {
            setPendingLeads(data?.paymentList);
            setTotalPendingLeads(data?.paymentList.length || 0);
        }
    }, [isSuccess, data]);
    
    return (
        <>
            <CommonTable
                columns={columns}
                rows={rows}
                totalRows={totalPendingLeads}
                paginationModel={paginationModel}
                onPageChange={handlePageChange}
                onRowClick={handleLeadClick}
                title="Pending Verifications"
                loading={isLoading}
            />
            {isError && (
                <Alert severity="error" style={{ marginTop: "10px" }}>
                    {error?.data?.message}
                </Alert>
            )}
        </>
    );
}

export default PendingVerification;
