import React, { useEffect, useState } from 'react';
import { Button, Select, MenuItem, TextField, Box, Alert, Typography, FormControl, InputLabel, CircularProgress, useTheme } from '@mui/material';
import { tokens } from '../theme';
import { useHoldLeadMutation, useRecommendLeadMutation, useRejectLeadMutation, useUnholdLeadMutation } from '../Service/Query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useHoldApplicationMutation, useHoldDisbursalMutation, useRecommendApplicationMutation, useRecommendLoanMutation, useRejectApplicationMutation, useRejectDisbursalMutation, useSanctionSendBackMutation, useDisbursalSendBackMutation, useSendBackMutation, useUnholdApplicationMutation, useUnholdDisbursalMutation, useSanctionApproveMutation } from '../Service/applicationQueries';
import useStore from '../Store';
import { useForm } from 'react-hook-form';

const loanHoldReasons = [
    { label: "Incomplete Documentation", value: "incomplete_documentation" },
    { label: "Inconsistent Information", value: "unverifiable_information" },
    { label: "Pending Verification", value: "pending_verification" },
    { label: "Regulatory Changes", value: "regulatory_changes" },
    { label: "Other", value: "Other" },
];

const loanRejectReasons = [
    { label: "Inconsistent Information", value: "unverifiable_information" },
    { label: "Low Credit Score or Poor Credit History", value: "poor_credit_history" },
    { label: "High Debt-to-Income Ratio", value: "high_debt_to_income" },
    { label: "Suspicious Activity", value: "suspicious_activity" },
    { label: "Unstable Employment History", value: "unstable_employment" },
    { label: "Legal or Regulatory Issues", value: "legal_regulatory_issues" },
    { label: "High-Risk Profile", value: "high_risk_profile" },
    { label: "Other", value: "Other" },
];

const ActionButton = ({ id, isHold, sanctionPreview, previewLoading, setForceRender, commonRemarks, disabled }) => {
    const navigate = useNavigate();
    const { empInfo, activeRole } = useAuthStore();
    const { applicationProfile } = useStore();

    const [actionType, setActionType] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [selectedRecipient, setSelectedRecipient] = useState();
    const [reasonList, setReasonList] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [isActionInProgress, setIsActionInProgress] = useState(false);

    const {watch} = useForm();

    const commonRemark = watch("commonRemarks");

    // Application Action component API-----------
    const [
        holdApplication,
        {
            data: holdApplicationData,
            isLoading: holdApplicationLoading,
            isSuccess: holdApplicationSuccess,
            isError: isApplicationHoldError,
            error: applicationHoldError,
        },
    ] = useHoldApplicationMutation();
    const [
        unholdApplication,
        {
            data: unholdApplicationData,
            isLoading: unholdApplicationLoading,
            isSuccess: unholdApplicationSuccess,
            isError: isApplicationUnHoldError,
            error: unHoldApplicationError,
        },
    ] = useUnholdApplicationMutation();
    const [
        recommendApplication,
        {
            data: recommendApplicationData,
            isLoading: recommendApplicationLoading,
            isSuccess: recommendApplicationSuccess,
            isError: isApplicationRecommendError,
            error: recommendApplicationError,
        },
    ] = useRecommendApplicationMutation();
    const [
        rejectApplication,
        {
            data: rejectApplicationData,
            isLoading: rejectApplicationLoading,
            isSuccess: rejectApplicationSuccess,
            isError: isApplicationRejectError,
            error: rejectApplicationError,
        },
    ] = useRejectApplicationMutation();

    // Disbursal Action component API-----------
    const [
        holdDisbursal,
        {
            data: holdDisbursalData,
            isSuccess: IsholdDisbursalSuccess,
            isError: isDisbursalHoldError,
            error: disbursalHoldError,
        },
    ] = useHoldDisbursalMutation();
    const [
        unholdDisbursal,
        {
            data: unholdDisbursalData,
            isSuccess: unholdDisbursalSuccess,
            isError: isUnholdDisbursalError,
            error: unHoldDisbursalError,
        },
    ] = useUnholdDisbursalMutation();
    const [
        recommendLoan,
        {
            data: recommendLoanData,
            isSuccess: isLoanRecommendSuccess,
            isLoading: recommendLoanLoading,
            isError: isRecommendError,
            error: recommendLoanError,
        },
    ] = useRecommendLoanMutation();
    const [
        rejectDisbursal,
        {
            data: rejectDisbursalData,
            isSuccess: rejectDisbursalSuccess,
            isError: isRejectDisbursalError,
            error: rejectDisbursalError,
        },
    ] = useRejectDisbursalMutation();

    // Lead Action component API ----------------------
    const [
        holdLead,
        {
            data: holdLeadData,
            isLoading: holdLeadLoading,
            isSuccess: holdLeadSuccess,
            isError: isHoldError,
            error: leadHoldError,
        },
    ] = useHoldLeadMutation();
    const [
        unholdLead,
        {
            data: unholdLeadData,
            isLoading: unholdLeadLoading,
            isSuccess: unholdLeadSuccess,
            isError: isUnHoldError,
            error: unHoldleadError,
        },
    ] = useUnholdLeadMutation();
    const [
        recommendLead,
        {
            data: recommendLeadData,
            isLoading: recommendLeadloading,
            isSuccess: recommendLeadSuccess,
            isError: isRecommendLeadError,
            error: recommendLeadError,
        },
    ] = useRecommendLeadMutation();
    const [
        rejectLead,
        {
            data: rejectLeadData,
            isLoading: rejectLeadLoading,
            isSuccess: rejectLeadSuccess,
            isError: isRejectError,
            error: rejectLeadError,
        },
    ] = useRejectLeadMutation();
    const [
        sendBack,
        {
            data: sendBackData,
            isSuccess: SendBackSuccess,
            isError: isSendBackError,
            error: sendBackError,
        },
    ] = useSendBackMutation();

    // sanction Action mutation -------
    const [sanctionSendBack, { data: sanctionSendBackData, isLoading: sanctionSendBackLoading, isSuccess: sanctionSendBackSuccess, isError: isSanctionSendBackError, error: sanctionSendBackError }] = useSanctionSendBackMutation();
    const [sanctionApprove, { data: sanctionApproveData, isLoading: sanctionApproveLoading, isSuccess: sanctionApproveSuccess, isError: isSanctionApproveError, error: sanctionApproveError }] = useSanctionApproveMutation();
    const [disbursalSendBack, { data: disbursalSendBackData, isLoading: disbursalSendBackLoading, isSuccess: disbursalSendBackSuccess, isError: isdisbursalSendBackError, error: disbursalSendBackError }] = useDisbursalSendBackMutation();
    const [sanctionReject, { data: sanctionRejectData, isSuccess: sanctionRejectSuccess, isError: isSanctionRejectError, error: sanctionRejectError }] = useRejectLeadMutation();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleForward = () => {
        onForward();
    };

    const handleApprove = () => {
        if (activeRole === "screener") {
            recommendLead({id, remarks:commonRemarks});
        } else if (activeRole === "creditManager") {
            recommendApplication({id, remarks:commonRemarks});
        } else if (activeRole === "disbursalManager") {
            recommendLoan({ id: applicationProfile._id, remarks });
        }
    };

    const handleActionClick = (type) => {
        if (type === "unhold") {
            setSelectedReason("Other");
        } else {
            if (type === "hold") {
                setReasonList(loanHoldReasons);
            } else {
                setReasonList(loanRejectReasons);
            }
        }
        setActionType(type); // Set the action to either 'hold' or 'reject'
    };

    const handleReasonChange = (event) => {
        const reason = event.target.value;
        setSelectedReason(reason);
        setRemarks(reason); // Clear remarks if 'Other' is not selected
    };

    const handleSubmit = () => {
        setIsActionInProgress(true); // Set to true when an action is initiated
        // Submit logic for hold/reject based on actionType
        if (actionType === "hold") {
            if (activeRole === "screener") {
                holdLead({ id, reason: remarks });
            } else if (activeRole === "creditManager") {
                holdApplication({ id, reason: remarks });
            } else if (
                activeRole === "disbursalManager" ||
                activeRole === "disbursalHead"
            ) {
                holdDisbursal({ id: applicationProfile._id, reason: remarks });
            }
        } else if (actionType === "reject") {
            if (activeRole === "screener") {
                rejectLead({ id, reason: remarks });
            } else if (activeRole === "creditManager") {
                rejectApplication({ id, reason: remarks });
            } else if (
                activeRole === "disbursalManager" ||
                activeRole === "disbursalHead"
            ) {
                rejectDisbursal({ id, reason: remarks });
            } else {
                sanctionReject({ id, reason: remarks });
            }
        } else if (actionType === "unhold") {
            if (activeRole === "screener") {
                unholdLead({ id, reason: remarks });
            } else if (activeRole === "creditManager") {
                unholdApplication({ id, reason: remarks });
            } else if (
                activeRole === "disbursalManager" ||
                activeRole === "disbursalHead"
            ) {
                unholdDisbursal({ id, reason: remarks });
            }
        } else if (actionType === "sendBack") {
            if (activeRole === "creditManager") {
                sendBack({
                    id: applicationProfile?.application?.lead._id,
                    reason: remarks,
                    sendTo: selectedRecipient,
                });
            } else if (activeRole === "sanctionHead") {
                sanctionSendBack({
                    id: applicationProfile?.application?.lead._id,
                    reason: remarks,
                    sendTo: selectedRecipient,
                });
            } else if (activeRole === "disbursalHead") {
                disbursalSendBack({
                    id: applicationProfile?.sanction?.application?.lead._id,
                    reason: remarks,
                    sendTo: selectedRecipient,
                });
            }
        } else if (actionType === "recommend") {
            if (activeRole === "disbursalManager") {
                recommendLoan({ id: applicationProfile._id, remarks });
            }
        } else if (actionType === "approve") {
            if (activeRole === "sanctionHead") {
                sanctionApprove({ id: applicationProfile?.sanction?.application?.lead._id, remarks });
            }
        }
    };

    const handlePreview = () => {
        sanctionPreview(id);
        setForceRender(true);
    };

    const handleSanctionApprove = () => {
        sanctionApprove({id, remarks:commonRemarks});
    };

    const handleCancel = () => {
        // Reset all states to go back to initial state
        setActionType("");
        setSelectedReason("");
        setRemarks("");
    };

    useEffect(() => {
        if (holdLeadSuccess && holdLeadData) {
            Swal.fire({
                text: "Lead on hold!",
                icon: "success",
            });
            navigate("/lead-hold");
            setIsActionInProgress(false); // Reset after success
        }
        if (IsholdDisbursalSuccess && holdDisbursalData) {
            Swal.fire({
                text: "Disbursal on hold!",
                icon: "success",
            });
            navigate("/disbursal-process");
            setIsActionInProgress(false); // Reset after success
        }
        if (unholdLeadSuccess && unholdLeadData) {
            Swal.fire({
                text: "Lead in process!",
                icon: "success",
            });
            navigate("/lead-process");
            setIsActionInProgress(false); // Reset after success
        }
        if (rejectLeadSuccess && rejectLeadData) {
            Swal.fire({
                text: "Lead Rejected!",
                icon: "success",
            });
            navigate("/rejected-leads");
            setIsActionInProgress(false); // Reset after success
        }
        if (recommendLeadSuccess && recommendLeadData) {
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Lead Forwarded!"
            });
            navigate("/lead-process");
            setIsActionInProgress(false); // Reset after success
        }
        setActionType("");
        setSelectedReason("");
        setRemarks("");
    }, [
        holdLeadData,
        holdDisbursalData,
        unholdLeadData,
        rejectLeadData,
        recommendLeadData,
    ]);

    useEffect(() => {
        if (SendBackSuccess && sendBackData) {
            Swal.fire({
                text: "Application successfully send back!",
                icon: "success",
            });
            navigate("/application-process");
            setIsActionInProgress(false); // Reset after success
        }
        if (sanctionSendBackSuccess && sanctionSendBackData) {
            Swal.fire({
                text: "Application successfully send back!",
                icon: "success",
            });
            navigate("/pending-sanctions");
            setIsActionInProgress(false); // Reset after success
        }
        if (disbursalSendBackSuccess && disbursalSendBackData) {
            Swal.fire({
                text: "Disbursal successfully send back!",
                icon: "success",
            });
            navigate("/disbursal-process");
            setIsActionInProgress(false); // Reset after success
        }
        if (recommendLoanData && isLoanRecommendSuccess) {
            Swal.fire({
                text: "Lead recommended for disbursal!",
                icon: "success",
            });
            navigate("/disbursal-process");
            setIsActionInProgress(false); // Reset after success
        }
        setActionType("");
        setSelectedReason("");
        setRemarks("");
    }, [
        sendBackData,
        sanctionSendBackData,
        disbursalSendBackSuccess,
        disbursalSendBackData,
        recommendLoanData,
        isLoanRecommendSuccess,
    ]);

    useEffect(() => {
        if (holdApplicationSuccess && holdApplicationData) {
            Swal.fire({
                text: "Application on hold!",
                icon: "success",
            });
            navigate("/application-hold");
            setIsActionInProgress(false); // Reset after success
        }
        if (unholdApplicationSuccess && unholdApplicationData) {
            Swal.fire({
                text: "Application in process!",
                icon: "success",
            });
            navigate("/application-process");
            setIsActionInProgress(false); // Reset after success
        }
        if (rejectApplicationSuccess && rejectApplicationData) {
            Swal.fire({
                text: "Application Rejected!",
                icon: "success",
            });
            navigate("/rejected-applications");
            setIsActionInProgress(false); // Reset after success
        }
        if (recommendApplicationSuccess && recommendApplicationData) {
            Swal.fire({
                text: "Application Forwarded!",
                icon: "success",
            });
            navigate("/application-process");
            setIsActionInProgress(false); // Reset after success
        }
        if (sanctionRejectSuccess && sanctionRejectData) {
            Swal.fire({
                text: "Application Forwarded!",
                icon: "success",
            });
            navigate("/pending-sanctions");
            setIsActionInProgress(false); // Reset after success
        }
        setActionType("");
        setSelectedReason("");
        setRemarks("");
    }, [
        holdApplicationData,
        unholdApplicationData,
        rejectApplicationData,
        recommendApplicationData,
        sanctionRejectData,
    ]);

    useEffect(() => {
        if (unholdDisbursalData && unholdDisbursalSuccess) {
            Swal.fire({
                text: "Disbursal Unhold!",
                icon: "success",
            });
            navigate("/");
            setIsActionInProgress(false); // Reset after success
        }
        if (rejectDisbursalSuccess && rejectDisbursalData) {
            Swal.fire({
                text: "Disbursal Rejected!",
                icon: "success",
            });
            navigate("/rejected-disbursals");
            setIsActionInProgress(false); // Reset after success
        }

        setActionType("");
        setSelectedReason("");
        setRemarks("");
    }, [
        unholdDisbursalData,
        unholdDisbursalSuccess,
        rejectApplicationSuccess,
        rejectDisbursalData,
    ]);

    useEffect(() => {
        if (sanctionApproveSuccess && sanctionApproveData) {
            Swal.fire({
                text: "Sanction Approved and Loan Number Allotted!",
                icon: "success",
            });
            setIsActionInProgress(false); // Reset after success
        }
    }, [sanctionApproveSuccess, sanctionApproveData]);

    return (
        <>
            <Box sx={{ padding: 2 }}>
                {(isRecommendLeadError ||
                    isHoldError ||
                    isRejectError ||
                    isUnHoldError ||
                    isSendBackError) && (
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {recommendLeadError?.data?.message}{" "}
                        {leadHoldError?.data?.message}{" "}
                        {rejectLeadError?.data?.message}{" "}
                        {unHoldleadError?.data?.message}{" "}
                        {sendBackError?.data?.message}
                    </Alert>
                )}
                {(isApplicationRecommendError ||
                    isApplicationHoldError ||
                    isApplicationRejectError ||
                    isApplicationUnHoldError) && (
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {recommendApplicationError?.data?.message}{" "}
                        {applicationHoldError?.data?.message}{" "}
                        {rejectApplicationError?.data?.message}{" "}
                        {unHoldApplicationError?.data?.message}
                    </Alert>
                )}
                {(isSanctionSendBackError ||
                    isdisbursalSendBackError ||
                    isRecommendError ||
                    isSanctionApproveError ||
                    isRejectDisbursalError) && (
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {sanctionSendBackError?.data?.message}
                        {sanctionApproveError?.data?.message}
                        {disbursalSendBackError?.data?.message}
                        {recommendLoanError?.data?.message}
                        {rejectDisbursalError?.data?.message}
                    </Alert>
                )}

                {/* Render buttons if no action is selected */}
                {(!actionType && !applicationProfile?.eSigned && !applicationProfile?.isDisbursed) && (
                    <Box sx={{ display: 'flex', flexWrap: "wrap", justifyContent: 'center', gap: 2, marginTop: 2 }}>
                        {
                            activeRole === "sanctionHead" &&
                            <>
                                {(!applicationProfile?.isApproved) ?
                                    <Button
                                        variant="contained"
                                        disabled={isActionInProgress || sanctionApproveLoading}
                                        onClick={(e) => {
                                            if (commonRemarks.trim().length < 15) {
                                              e.preventDefault();
                                            }else{
                                                handleSanctionApprove()
                                            }
                                        }}
                                        // onClick={() => handleSanctionApprove()}
                                        sx={{
                                            backgroundColor: (isActionInProgress || sanctionApproveLoading || disabled || commonRemarks.length < 15) ? "#ccc" : "#04c93f",
                                            color: (isActionInProgress || sanctionApproveLoading) ? "#666" : "white",
                                            cursor: (isActionInProgress || sanctionApproveLoading || disabled || commonRemarks.length < 15) ? "not-allowed" : "pointer",
                                            borderRadius: "0px 10px",
                                            "&:hover": {
                                                backgroundColor: (isActionInProgress || sanctionApproveLoading || disabled) ? "#ccc" : "#069130",
                                                cursor: (isActionInProgress || sanctionApproveLoading || disabled || commonRemarks.length < 15) ? "not-allowed" : "pointer",
                                            },
                                        }}
                                    >
                                        {sanctionApproveLoading ? <CircularProgress size={20} color='inherit' /> : "Approve"}
                                    </Button>
                                    :
                                    (!applicationProfile.eSignPending) ?
                                        <Button
                                            variant="contained"
                                            disabled={isActionInProgress || previewLoading}
                                            color="success"
                                            onClick={() => handlePreview()}
                                            sx={{
                                                background: (isActionInProgress || previewLoading) ? "#ccc" : "#04c93f",
                                                color: (isActionInProgress || previewLoading) ? "#666" : "white",
                                                cursor: (isActionInProgress || previewLoading) ? "not-allowed" : "pointer",
                                                boxShadow: (isActionInProgress || previewLoading) ? "0px 2px 5px 2px rgb(0,0,0,0.2)" : "0px 2px 5px rgb(0,0,0,0.2)",
                                                borderRadius: (isActionInProgress || previewLoading) ? "0px 10px" : "0px 10px",
                                                "&:hover": {
                                                    background: (isActionInProgress || previewLoading) ? "#ccc" : "#04b539",
                                                },
                                            }}
                                        >
                                            {previewLoading ? <CircularProgress size={20} color="inherit" /> : "Preview"}
                                        </Button> : null
                                }
                            </>
                        }
                        {(activeRole !== "sanctionHead" && activeRole !== "admin") &&
                            <>
                                {!isHold && activeRole !== "disbursalHead" &&
                                    <>
                                        {(activeRole === "disbursalManager") ?
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleActionClick('recommend')}
                                                disabled={isActionInProgress}
                                                sx={{
                                                    borderRadius: "0px 10px",
                                                    backgroundColor: "#04c93f",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        backgroundColor: "#8bf7ab",
                                                    },
                                                }}
                                            >
                                                Recommend
                                            </Button>
                                            :
                                            <Button
                                                variant="contained"
                                                onClick={(e) => {
                                                    if (commonRemarks.trim().length < 15) {
                                                      e.preventDefault();
                                                    }else{
                                                        handleApprove('')
                                                    }
                                                }}
                                                // onClick={() => handleApprove('')}
                                                disabled={isActionInProgress || recommendApplicationLoading || recommendLeadloading}
                                                sx={{
                                                    backgroundColor: (isActionInProgress || recommendApplicationLoading || recommendLeadloading || disabled || commonRemarks.length < 15) ? "#ccc" : colors.primary[400],
                                                    borderRadius: (isActionInProgress || recommendApplicationLoading || recommendLeadloading) ? "#ccc" : "0px 10px 0px 10px",
                                                    color: (isActionInProgress || recommendApplicationLoading || recommendLeadloading) ? "#666" : colors.white[100],
                                                    cursor: (isActionInProgress || recommendApplicationLoading || recommendLeadloading || disabled) ? "not-allowed" : "pointer",
                                                    "&:hover": {
                                                        backgroundColor: (isActionInProgress || recommendApplicationLoading || recommendLeadloading || disabled || commonRemarks.length < 15) ? "#ccc" : colors.primary[100],
                                                        cursor: (isActionInProgress || recommendApplicationLoading || recommendLeadloading || disabled || commonRemarks.length < 15) ? "not-allowed" : "pointer",
                                                    },
                                                }}
                                            >
                                                {(isActionInProgress || recommendApplicationLoading || recommendLeadloading) ? <CircularProgress size={20} color="inherit" /> : "Forward"}
                                            </Button>}
                                    </>
                                }
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleActionClick(isHold ? "unhold" : 'hold')}
                                    disabled={isActionInProgress}
                                    sx={{
                                        color:colors.white[100],
                                        borderRadius: (isHold) ? "0px 10px 0px 10px" : "0px 10px 0px 10px",
                                        '&:hover': {
                                            backgroundColor: isHold ? '#ffcccb' : '#ffc107',
                                        },
                                    }}
                                >
                                    {isHold ? "Unhold" : "Hold"}
                                </Button>
                            </>
                        }
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleActionClick('reject')}
                            disabled={isActionInProgress}
                            sx={{
                                borderRadius: "0px 10px",
                                '&:hover': {
                                    background: colors.redAccent[500],
                                },
                            }}
                        >
                            Reject
                        </Button>
                        {(activeRole !== "screener" && activeRole !== "disbursalManager" && !isHold) &&
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleActionClick('sendBack')}
                                disabled={isActionInProgress}
                                sx={{ borderRadius: "0px 10px", color: colors.white[100] }}
                            >
                                Send Back
                            </Button>}
                    </Box>
                )}
                {/* Render dropdown, input, and submit/cancel buttons when Hold or Reject is selected */}
                {(actionType === "hold" ||
                    actionType === "unhold" ||
                    actionType === "reject" ||
                    actionType === "sendBack" ||
                    actionType === "recommend" ||
                    actionType === "approve") && (
                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 4,
                            backgroundColor: colors.white[100],
                            borderRadius: "0px 15px 0px 15px",
                            boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        {(actionType === "hold" || actionType === "reject") && (
                            <>
                                <FormControl fullWidth sx={{ marginBottom: 3, }}>
                                    <InputLabel 
                                        sx={{ 
                                            color: colors.black[100],
                                            '& .MuiInputLabel-root':{
                                                color:colors.black[100],
                                            }, 
                                        }}
                                    >Select a Reason</InputLabel>
                                    <Select
                                        value={selectedReason}
                                        onChange={handleReasonChange}
                                        displayEmpty
                                        fullWidth
                                        label="Select a Reason"
                                        sx={{
                                            borderRadius: "0px 10px 0px 10px",
                                            color: colors.black[100],
                                            backgroundColor: colors.white[100],
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
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
                                    >
                                        {reasonList && reasonList.length > 0 && reasonList.map((reason, index) => (
                                            <MenuItem
                                                sx={{
                                                    background: colors.white[100],
                                                    color: colors.primary[400],
                                                    '&:hover': {
                                                        background: colors.primary[400],
                                                        color: colors.white[100],
                                                    },
                                                }}
                                                key={index}
                                                value={reason.label}
                                            >
                                                {reason.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}

                        {(selectedReason === "Other" ||
                            actionType === "sendBack" ||
                            actionType === "recommend") && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Remarks
                                </Typography>
                                <TextField
                                    label="Add your remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    sx={{
                                        marginTop: 2,
                                        marginBottom: 1,
                                        color: colors.black[100],
                                        backgroundColor: colors.white[100],
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: colors.primary[400],
                                                borderRadius: '0px 10px',
                                                color: colors.black[100],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.primary[400],
                                                color: colors.black[100]
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: colors.primary[400],
                                                color: colors.black[100]
                                            },
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: colors.black[100],
                                        },
                                        '& .MuiInputBase-root': {
                                            color: colors.black[100]
                                        },
                                    }}
                                />
                                <Typography variant="h6" gutterBottom sx={{margin:"10px 0px", color:colors.grey[400], fontSize:"12px", fontStyle:"italic"}}>
                                    Add atleast 15 letters in remarks
                                </Typography>
                                {actionType === "sendBack" && (
                                    <>
                                        <FormControl 
                                            fullWidth 
                                            sx={{ 
                                                marginBottom: 3,
                                                backgroundColor: colors.white[100],
                                                '& .MuiInputLabel-root':{
                                                    color:colors.black[100],
                                                },
                                            }}
                                        >
                                            <InputLabel>Send Back to</InputLabel>
                                            <Select
                                                value={selectedRecipient}
                                                onChange={(e) =>
                                                    setSelectedRecipient(
                                                        e.target.value
                                                    )
                                                }
                                                label="Send Back to"
                                                sx={{
                                                    color: colors.black[100],
                                                    background: colors.white[100],
                                                    borderRadius: "0px 10px",
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                                    '& .MuiSvgIcon-root': { color: colors.primary[400] },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
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
                                            >
                                                <MenuItem
                                                    value=""
                                                    sx={{
                                                        color: colors.black[100],
                                                        background: colors.white[100],
                                                        '& .MuiPopover-paper': {
                                                            background: colors.white[100],
                                                        },
                                                        '&:hover': {
                                                            background: colors.primary[400],
                                                            color: colors.white[100],
                                                        },
                                                    }}
                                                    disabled
                                                >
                                                    Select recipient to send back
                                                </MenuItem>
                                                {activeRole === "creditManager" && <MenuItem value="screener" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Screener</MenuItem>}
                                                {activeRole === "sanctionHead" && <MenuItem value="creditManager" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Credit Manager</MenuItem>}
                                                {activeRole === "disbursalHead" && <MenuItem value="disbursalManager" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Disbursal Manager</MenuItem>}
                                            </Select>
                                        </FormControl>
                                    </>
                                )}
                            </>
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 2,
                                marginTop: 3,
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleCancel}
                                disabled={isActionInProgress} // Disable if action is in progress
                                sx={{
                                    padding: '10px 20px',
                                    border: `1px solid ${colors.redAccent[500]}`,
                                    color: colors.redAccent[500],
                                    borderRadius: "0px 10px",
                                    backgroundColor: colors.white[100],
                                    ':hover': {
                                        backgroundColor: colors.redAccent[500],
                                        color: colors.white[100]
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={(e) => {
                                    if (remarks.trim().length < 15) {
                                      e.preventDefault();
                                    }else{
                                        handleSubmit()
                                    }
                                }}
                                // onClick={handleSubmit}
                                disabled={
                                    isActionInProgress || 
                                    sanctionSendBackLoading || 
                                    disbursalSendBackLoading || 
                                    holdLeadLoading || 
                                    unholdLeadLoading || 
                                    holdApplicationLoading || 
                                    unholdApplicationLoading || 
                                    rejectApplicationLoading || 
                                    rejectLeadLoading
                                }
                                sx={{
                                    backgroundColor: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading || remarks.length < 15) ? "#ccc" : colors.white[100],
                                    color: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading || remarks.length < 15) ? "#666" : colors.primary[400],
                                    border: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "#666" : `1px solid ${colors.primary[400]}`,
                                    borderRadius: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "0px 10px" : "0px 10px",
                                    cursor: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading || remarks.length < 15) ? "not-allowed" : "pointer",
                                    "&:hover": {
                                        backgroundColor: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading || remarks.length < 15) ? "#ccc" : colors.primary[400],
                                        cursor: (isActionInProgress || sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading || remarks.length < 15) ? "not-allowed" : "pointer",
                                        color: (remarks.length < 15) ? "#666" : colors.white[100],
                                    },
                                }}
                            >
                                {sanctionSendBackLoading ||
                                disbursalSendBackLoading ||
                                holdLeadLoading ||
                                unholdLeadLoading ||
                                holdApplicationLoading ||
                                unholdApplicationLoading ||
                                rejectApplicationLoading ||
                                rejectLeadLoading ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default ActionButton;