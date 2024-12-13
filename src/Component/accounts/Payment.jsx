import React, { useState } from "react";
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Alert,
} from "@mui/material";
import { useVerifyPendingLeadMutation } from "../../Service/LMSQueries";

import { Select, MenuItem, Button } from "@mui/material";
import Swal from "sweetalert2";

const PaymentRow = ({ payment, onUpdateStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState("");

    const formatCamelCaseToTitle = (text) => {
        return text
            .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
            .replace(/^[a-z]/, (match) => match.toUpperCase()); // Capitalize the first letter
    };

    // Convert date to IST
    const formatDateToIST = (dateString) => {
        const options = {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        return new Intl.DateTimeFormat("en-IN", options).format(
            new Date(dateString)
        );
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedStatus) {
            onUpdateStatus(payment.utr, selectedStatus); // Pass UTR and new status to parent
        }
    };


    return (
        <tr>
            <td>{payment.date ? formatDateToIST(payment.date) : "N/A"}</td>
            <td>{payment.amount || "N/A"}</td>
            <td>{payment.isPartlyPaid ? "Verified" : "Pending"}</td>
            <td>{payment.utr || "N/A"}</td>
            <td>
                {payment.requestedStatus
                    ? formatCamelCaseToTitle(payment.requestedStatus)
                    : "N/A"}
            </td>
            {!payment.isPartlyPaid &&
                <>
                    <td>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            displayEmpty
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="" disabled>
                                Select Status
                            </MenuItem>

                            <MenuItem value={payment.requestedStatus}>
                                {payment.requestedStatus
                                    ? formatCamelCaseToTitle(payment.requestedStatus)
                                    : "N/A"}
                            </MenuItem>
                        </Select>
                    </td>
                    <td>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleSubmit}
                            disabled={!selectedStatus}
                        >
                            Update
                        </Button>
                    </td>
                </>
            }
        </tr>
    );
};

const Payment = ({ collectionData, leadId, activeRole }) => {
    if (!collectionData) {
        return <div>Loading...</div>;
    }

    const [verifyPendingLead, isLoading, isSuccess, isError] =
        useVerifyPendingLeadMutation();

    console.log(collectionData);

    const paymentInfo =
        collectionData.partialPaid.length > 0
            ? collectionData.partialPaid
            : collectionData;

    console.log(paymentInfo);

    const handleUpdateStatus = async (utr, newStatus) => {
        try {
            const response = await verifyPendingLead({
                loanNo: collectionData.loanNo, // ID of the CAM (assuming this is passed as a prop)
                utr: utr,
                status: newStatus, // The updated data from the form
            }).unwrap();

            if (response?.success) {
                Swal.fire({
                    text: "Status Updated Successfuly!",
                    icon: "success",
                });
                // setIsEditing(false); // Stop editing after successful update
                // setErrorMessage(""); // Clear any error message
            } else {
                // setErrorMessage("Failed to update the data. Please try again.");
                console.log("Failed to update status ");
            }
        } catch (error) {
            console.error("Error updating CAM details:", error);
            // setErrorMessage("An error occurred while updating the data.");
        }
        console.log(
            `Updating status for UTR: ${utr}, New Status: ${newStatus}`
        );
    };

    return (
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h5" gutterBottom>
                Payment Verification for Lead ID: {leadId}
            </Typography>
            <Typography variant="subtitle1">Role: {activeRole}</Typography>
            <Table style={{ marginTop: "20px" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date (IST)</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>UTR</TableCell>
                        <TableCell>Requested Status</TableCell>
                        <TableCell>Update Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentInfo.length > 0 ? (
                        paymentInfo.map((payment, index) => (
                            <PaymentRow
                                key={index}
                                payment={payment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))
                    ) : paymentInfo ? (
                        <PaymentRow
                            key={1}
                            payment={paymentInfo}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <Alert severity="info">
                                    No payment data available.
                                </Alert>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default Payment;

// import React , {useState} from "react";
// import {
//     Paper,
//     Typography,
//     Table,
//     TableBody,
//     TableHead,
//     TableRow,
//     TableCell,
//     Alert,
// } from "@mui/material";
// import PaymentRow from "./PaymentRow";
// import React, { useState } from "react";
// import { Select, MenuItem, Button } from "@mui/material";

// const PaymentRow = ({ payment, onUpdateStatus }) => {
//     const [selectedStatus, setSelectedStatus] = useState("");
//     const [isUpdating, setIsUpdating] = useState(false);

//     const formatDateToIST = (dateString) => {
//         const options = {
//             timeZone: "Asia/Kolkata",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//         };
//         return new Intl.DateTimeFormat("en-IN", options).format(new Date(dateString));
//     };

//     const handleStatusChange = (event) => {
//         setSelectedStatus(event.target.value);
//     };

//     const handleSubmit = async () => {
//         if (selectedStatus) {
//             setIsUpdating(true);
//             try {
//                 await onUpdateStatus(payment.utr, selectedStatus);
//                 alert(`Status successfully updated to "${selectedStatus}" for UTR: ${payment.utr}`);
//             } catch (error) {
//                 alert("Failed to update status. Please try again.");
//             } finally {
//                 setIsUpdating(false);
//             }
//         }
//     };

//     return (
//         <tr>
//             <td>{payment.date ? formatDateToIST(payment.date) : "N/A"}</td>
//             <td>{payment.amount || "N/A"}</td>
//             <td>{payment.status || "N/A"}</td>
//             <td>{payment.utr || "N/A"}</td>
//             <td>{payment.collectionStatusRequested || "N/A"}</td>
//             <td>
//                 <Select
//                     value={selectedStatus}
//                     onChange={handleStatusChange}
//                     displayEmpty
//                     fullWidth
//                     size="small"
//                 >
//                     <MenuItem value="" disabled>
//                         Select Status
//                     </MenuItem>
//                     <MenuItem value="Settled">Settled</MenuItem>
//                     <MenuItem value="Write-Off">Write-Off</MenuItem>
//                     <MenuItem value="Partly Paid">Partly Paid</MenuItem>
//                     <MenuItem value="Closed">Closed</MenuItem>
//                 </Select>
//             </td>
//             <td>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     size="small"
//                     onClick={handleSubmit}
//                     disabled={!selectedStatus || isUpdating}
//                 >
//                     {isUpdating ? "Updating..." : "Update"}
//                 </Button>
//             </td>
//         </tr>
//     );
// };

// const Payment = ({ collectionData, leadId, activeRole }) => {
//     if (!collectionData) {
//         return <div>Loading...</div>;
//     }

//     const paymentInfo = collectionData.partialPaid || [];

//     const handleUpdateStatus = async (utr, newStatus) => {
//         try {
//             console.log(`Updating status for UTR: ${utr}, New Status: ${newStatus}`);
//             // Call your API here to update the status
//             // Example:
//             // await api.patch(`/api/accounts/active/verify/${utr}`, { status: newStatus });
//         } catch (error) {
//             throw new Error("Error updating status");
//         }
//     };

//     return (
//         <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
//             <Typography variant="h5" gutterBottom>
//                 Payment Verification for Lead ID: {leadId}
//             </Typography>
//             <Typography variant="subtitle1" gutterBottom>
//                 Role: {activeRole}
//             </Typography>
//             <Table sx={{ marginTop: 2 }}>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Date (IST)</TableCell>
//                         <TableCell>Amount</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>UTR</TableCell>
//                         <TableCell>Requested Status</TableCell>
//                         <TableCell>Update Status</TableCell>
//                         <TableCell>Action</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {paymentInfo.length > 0 ? (
//                         paymentInfo.map((payment, index) => (
//                             <PaymentRow
//                                 key={index}
//                                 payment={payment}
//                                 onUpdateStatus={handleUpdateStatus}
//                             />
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan={7}>
//                                 <Alert severity="info">No payment data available.</Alert>
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </Paper>
//     );
// };

// export default Payment;
