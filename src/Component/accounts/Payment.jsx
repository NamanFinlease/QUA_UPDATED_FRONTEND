import React, { useState, useEffect } from "react";
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Alert,
    useTheme,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import { tokens } from '../../theme';
import { useVerifyPendingLeadMutation, usePendingVerificationQuery, useVerifyPaymentMutation, useRejectPaymentMutation } from "../../Service/LMSQueries";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";

const PaymentRow = ({ payment, onUpdateStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [open, setOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [reject, setReject] = useState();
    const [remarks, setRemarks] = useState("");
    const { id } = useParams();

    const [verifyPayment, { isSuccess, isError, error }] =
        useVerifyPaymentMutation();

    const [rejectPayment, { isSuccess: rejectSuccess, isError: rejectError }] = 
        useRejectPaymentMutation();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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

    const handleStatusChange = (event, utr) => {
        setSelectedStatus(event.target.value);
    };


    const handleOpen = (type) => {
        setActionType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setRemarks("");
    };

    const handleConfirm = () => {
        if (actionType === "Approve"){
            verifyPayment({
                loanNo : id, 
                transactionId: payment.transactionId, 
                closingType : selectedStatus,
                remarks : remarks
            }) 
        }else if (actionType === "Reject") {
            rejectPayment({
                loanNo: id,
                transactionId: payment.transactionId,
                remarks: remarks
            });
        }
        handleClose();
    }

    useEffect(() => {
        if(isSuccess && verifyPayment){
            Swal.fire({
                text: "Payment Verified",
                icon: "success"
            });
        }
    }, [isSuccess, verifyPayment ])

    useEffect(() => {
        if(rejectSuccess && rejectPayment){
            Swal.fire({
                text: "Payment Rejected",
                icon: "success"
            });
        }
    }, [rejectSuccess, rejectPayment ])

    return (
        <tr>
            <td>{payment.paymentDate ? dayjs(payment.paymentDate).format('DD/MM/YYYY') : "N/A"}</td>
            <td>{payment.receivedAmount || "N/A"}</td>
            <td>{payment.closingType || "N/A"}</td>
            <td>{payment.paymentMethod || "N/A"}</td>
            <td>{payment.transactionId || "N/A"}</td>
            <td>{payment.discount || 0}</td>
            <td>{(payment.isPaymentVerified || payment.isRejected) ? payment.isRejected ? "Rejected" : "Verified" : "Pending"}</td>
            <td>{payment.accountRemarks || "-"}</td>
            {!payment.isPartlyPaid &&
                <>
                    <td>
                        <Select
                            variant="outlined"
                            name="updatePaymentStatus"
                            sx={{
                                color: colors.black[100],
                                padding: "10px 0px",
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: colors.primary[400],
                                },
                                '& .MuiSelect-icon': {
                                    color: colors.primary[100],
                                },
                                '& .MuiSelect-icon:disabled': {
                                    color: colors.white[100],
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        backgroundColor: colors.white[100],
                                        color: colors.black[100],
                                        borderRadius:"20px 0px",
                                    },
                                },
                            }}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            displayEmpty
                            fullWidth
                            size="small"
                            disabled={payment.isPaymentVerified}
                        >
                            <MenuItem value="" disabled>
                                Select Status
                            </MenuItem>

                            <MenuItem value={payment.requestedStatus}>
                                {payment.requestedStatus
                                    ? formatCamelCaseToTitle(payment.requestedStatus)
                                    : "N/A"}
                            </MenuItem>
                            <MenuItem value="partPayment" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Part Payment</MenuItem>
                            <MenuItem value="settled" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Settled</MenuItem>
                            <MenuItem value="writeOff" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Write Off</MenuItem>
                            <MenuItem value="closed" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Closed</MenuItem>
                        </Select>
                    </td>
                    <td>
                        <Button
                            variant="contained"
                            sx={{
                                background: colors.primary[400],
                                color: colors.white[100],
                                borderRadius: '0px 10px',
                                margin: "5px 1px",
                            }}
                            size="small"
                            onClick={() => handleOpen("Approve")}
                            disabled={payment.isPaymentVerified}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                background: colors.redAccent[500],
                                color: colors.white[100],
                                borderRadius: '0px 10px',
                                margin: "5px 1px",
                            }}
                            size="small"
                            onClick={() => handleOpen("Reject")}
                            disabled={payment.isPaymentVerified}
                        >
                            Reject
                        </Button>
                    </td>
                </>
            }
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiOutlinedInput-root':{
                        color:colors.black[100],
                        '& fieldset': { borderColor: colors.primary[400] },
                        '&:hover fieldset': { borderColor: colors.primary[400] },
                    },
                    '& .MuiTypography-root':{
                        color:colors.black[100],
                    },
                    '& .MuiFormLabel-root':{
                        color:colors.black[100],
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary[400],
                    },
                }}
                PaperProps={{
                    style: {
                        backgroundColor: colors.white[100], 
                        color:colors.black[100] ,
                        borderRadius: "0px 20px",
                    }
                }}
            >
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {actionType.toLowerCase()} this payment?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Remarks"
                        name="remarks"
                        type="text"
                        fullWidth
                        required
                        minLength={15}
                        variant="outlined"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                    {remarks.trim().length > 0 && remarks.trim().length < 15 && (
                        <Typography color="error" variant="caption">
                            Please enter at least 15 letters.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        sx={{
                            color: colors.white[100],
                            background: colors.redAccent[500],
                            borderRadius: "0px 10px",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        autoFocus
                        disabled={!remarks || remarks.length < 15} 
                        sx={{
                            color: colors.white[100],
                            background: colors.primary[400],
                            borderRadius: "0px 10px",
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
                {isError &&
                    <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                        {error?.data?.message}
                    </Alert>
                }
            </Dialog>
        </tr>
    );
};

const Payment = ({ collectionData, leadId, activeRole }) => {

    const { id } = useParams();
    const [paymentInfo, setPaymentInfo] = useState([]);
    if (!collectionData) {
        return <div style={{ textAlign: "center" }}>Loading...</div>;
    }

    const { data: paymentHistory, isLoading: verifyPaymentLoading, isSuccess: verifyPaymentSuccess, isError: verifyPaymentError } =
        usePendingVerificationQuery(id, { skip: id === null });

    useEffect(() => {
        if (verifyPaymentSuccess && paymentHistory) {
            const paymentList = paymentHistory.paymentList?.flatMap(item => item.paymentHistory) || [];
            setPaymentInfo(paymentList);
        }
    }, [verifyPaymentSuccess, paymentHistory]);

    // Loading and error states
    if (verifyPaymentLoading) return <div>Loading...</div>;
    if (verifyPaymentError) return <Alert severity="error">Failed to fetch payment data.</Alert>;

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleUpdateStatus = async (utr, newStatus, remarks = "") => {
        try {
            const response = await verifyPendingLead({
                loanNo: collectionData.loanNo, // ID of the CAM (assuming this is passed as a prop)
                utr: utr,
                status: newStatus, // The updated data from the form
                remarks,
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
        <Paper
            elevation={3}
            sx={{
                padding: "20px",
                background: colors.white[100],
                color: colors.black[100],
                borderRadius: "0px 20px",
                width: "100%",
                overflowX: "auto",
                '& .MuiTableCell-root': {
                    color: colors.white[100],
                },
            }}
        >
            <Typography variant="h5" gutterBottom>
                Payment Verification for Lead ID: {leadId}
            </Typography>
            <Typography variant="subtitle1">Role: {activeRole}</Typography>
            <Table
                component={Paper}
                sx={{
                    marginTop: "20px",
                    background: colors.white[100],
                    color: colors.black[100],
                    borderRadius: "0px 20px",
                    overflowY: "scroll",
                    textAlign: "center",
                    padding: "20px",
                    '& .MuiTableHead-root': {
                        background: colors.primary[400],
                        color: colors.white[100],
                    },
                    '& .MuiTableCell-root': {
                        outline: `1px solid ${colors.white[100]}`,
                    },
                }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Payment Receive Date</TableCell>
                        <TableCell>Received Amount</TableCell>
                        <TableCell>Payment Type</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Discount Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Remarks</TableCell>
                        <TableCell>Update Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(paymentInfo && paymentInfo.length > 0) ? (
                        
                            paymentInfo.map(payment =>

                                <PaymentRow
                                    key={payment._id}
                                    payment={payment}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            )
                        
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

                {/* <TableBody>
                    {previousPayments.length > 0 ? (
                        previousPayments.map((payment, index) => (
                            <PaymentRow
                                key={index}
                                payment={payment}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))
                    ) : previousPayments ? (
                        <PaymentRow
                            key={1}
                            payment={previousPayments}
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
                </TableBody> */}
            </Table>
        </Paper>
    );
};

export default Payment;