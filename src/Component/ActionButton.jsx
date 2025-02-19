import React, { useEffect, useState } from 'react'
import { Button, Select, MenuItem, TextField, Box, Alert, Typography, FormControl, InputLabel, CircularProgress, useTheme } from '@mui/material';
import { tokens } from '../theme';
import { useHoldLeadMutation, useRecommendLeadMutation, useRejectLeadMutation, useUnholdLeadMutation } from '../Service/Query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useHoldApplicationMutation, useHoldDisbursalMutation, useRecommendApplicationMutation, useRecommendLoanMutation, useRejectApplicationMutation, useRejectDisbursalMutation, useSanctionSendBackMutation, useDisbursalSendBackMutation, useSendBackMutation, useUnholdApplicationMutation, useUnholdDisbursalMutation, useSanctionApproveMutation } from '../Service/applicationQueries';
import useStore from '../Store';
import RejectedLeads from './leads/RejectedLeads';

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
    // { label: "Unclear Purpose of Loan", value: "unclear_loan_purpose" }
];

const ActionButton = ({ id, isHold, sanctionPreview, previewLoading, setForceRender }) => {
    console.log('sanction :', sanctionPreview)

    const navigate = useNavigate()
    const { empInfo, activeRole } = useAuthStore()
    const { applicationProfile } = useStore()

    const [actionType, setActionType] = useState(''); // To track which action is selected: 'hold', 'reject', 'approve'
    const [selectedReason, setSelectedReason] = useState(''); // To track the selected reason for hold or reject
    const [selectedRecipient, setSelectedRecipient] = useState()
    const [reasonList, setReasonList] = useState(null)
    const [remarks, setRemarks] = useState('');

    // Application Action component API-----------
    const [holdApplication, { data: holdApplicationData, isLoading: holdApplicationLoading, isSuccess: holdApplicationSuccess, isError: isApplicationHoldError, error: applicationHoldError }] = useHoldApplicationMutation();
    const [unholdApplication, { data: unholdApplicationData, isLoading: unholdApplicationLoading, isSuccess: unholdApplicationSuccess, isError: isApplicationUnHoldError, error: unHoldApplicationError }] = useUnholdApplicationMutation();
    const [recommendApplication, { data: recommendApplicationData, isLoading: recommendApplicationLoading, isSuccess: recommendApplicationSuccess, isError: isApplicationRecommendError, error: recommendApplicationError }] = useRecommendApplicationMutation();
    const [rejectApplication, { data: rejectApplicationData, isLoading: rejectApplicationLoading, isSuccess: rejectApplicationSuccess, isError: isApplicationRejectError, error: rejectApplicationError }] = useRejectApplicationMutation();

    // Disbursal Action component API-----------
    const [holdDisbursal, { data: holdDisbursalData, isSuccess: IsholdDisbursalSuccess, isError: isDisbursalHoldError, error: disbursalHoldError }] = useHoldDisbursalMutation();
    const [unholdDisbursal, { data: unholdDisbursalData, isSuccess: unholdDisbursalSuccess, isError: isUnholdDisbursalError, error: unHoldDisbursalError }] = useUnholdDisbursalMutation();
    const [recommendLoan, { data: recommendLoanData, isSuccess: isLoanRecommendSuccess, isLoading: recommendLoanLoading, isError: isRecommendError, error: recommendLoanError }] = useRecommendLoanMutation()
    const [rejectDisbursal, { data: rejectDisbursalData, isSuccess: rejectDisbursalSuccess, isError: isRejectDisbursalError, error: rejectDisbursalError }] = useRejectDisbursalMutation();

    // Lead Action component API ----------------------
    const [holdLead, { data: holdLeadData, isLoading: holdLeadLoading, isSuccess: holdLeadSuccess, isError: isHoldError, error: leadHoldError }] = useHoldLeadMutation();
    const [unholdLead, { data: unholdLeadData, isLoading: unholdLeadLoading, isSuccess: unholdLeadSuccess, isError: isUnHoldError, error: unHoldleadError }] = useUnholdLeadMutation();
    const [recommendLead, { data: recommendLeadData, isLoading: recommendLeadloading, isSuccess: recommendLeadSuccess, isError: isRecommendLeadError, error: recommendLeadError }] = useRecommendLeadMutation();
    const [rejectLead, { data: rejectLeadData, isLoading: rejectLeadLoading, isSuccess: rejectLeadSuccess, isError: isRejectError, error: rejectLeadError }] = useRejectLeadMutation();
    const [sendBack, { data: sendBackData, isSuccess: SendBackSuccess, isError: isSendBackError, error: sendBackError }] = useSendBackMutation()

    // sanction Action mutation -------
    const [sanctionSendBack, { data: sanctionSendBackData, isLoading: sanctionSendBackLoading, isSuccess: sanctionSendBackSuccess, isError: isSanctionSendBackError, error: sanctionSendBackError }] = useSanctionSendBackMutation()
    const [sanctionApprove, { data: sanctionApproveData, isLoading: sanctionApproveLoading, isSuccess: sanctionApproveSuccess, isError: isSanctionApproveError, error: sanctionApproveError }] = useSanctionApproveMutation()
    const [disbursalSendBack, { data: disbursalSendBackData, isLoading: disbursalSendBackLoading, isSuccess: disbursalSendBackSuccess, isError: isdisbursalSendBackError, error: disbursalSendBackError }] = useDisbursalSendBackMutation()
    const [sanctionReject, { data: sanctionRejectData, isSuccess: sanctionRejectSuccess, isError: isSanctionRejectError, error: sanctionRejectError }] = useRejectLeadMutation();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleForward = () => {
        onForward();
      };

    const handleApprove = () => {
        if (activeRole === "screener") {
            recommendLead(id)
        } else if (activeRole === "creditManager") {
            recommendApplication(id)
        } else if (activeRole === "disbursalManager") {
            recommendLoan({ id: applicationProfile._id, remarks })
        }
    }
    const handleActionClick = (type) => {
        if (type === "unhold") {

            setSelectedReason("Other")
        } else {
            if (type === "hold") {
                setReasonList(loanHoldReasons)
            } else {
                setReasonList(loanRejectReasons)
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
        // Submit logic for hold/reject based on actionType
        if (actionType === 'hold') {
            if (activeRole === "screener") {

                holdLead({ id, reason: remarks })
            } else if (activeRole === "creditManager") {
                holdApplication({ id, reason: remarks })
            } else if (activeRole === "disbursalManager" || activeRole === "disbursalHead") {
                // console.log('disbursal hold',{ id:applicationProfile._id, reason: remarks })
                holdDisbursal({ id: applicationProfile._id, reason: remarks })
            }

        } else if (actionType === 'reject') {
            if (activeRole === "screener") {
                rejectLead({ id, reason: remarks })
            } else if (activeRole === "creditManager") {
                rejectApplication({ id, reason: remarks })
            } else if (activeRole === "disbursalManager" || activeRole === "disbursalHead") {
                rejectDisbursal({ id, reason: remarks })
            } else {
                sanctionReject({ id, reason: remarks })
            }

        } else if (actionType === "unhold") {
            if (activeRole === "screener") {

                unholdLead({ id, reason: remarks })
            } else if (activeRole === "creditManager") {
                unholdApplication({ id, reason: remarks })
            } else if (activeRole === "disbursalManager" || activeRole === "disbursalHead") {
                unholdDisbursal({ id, reason: remarks })
            }
        } else if (actionType === "sendBack") {
            if (activeRole === "creditManager") {
                sendBack({ id: applicationProfile?.lead._id, reason: remarks, sendTo: selectedRecipient })
            } else if (activeRole === "sanctionHead") {
                sanctionSendBack({ id: applicationProfile?.application?.lead._id, reason: remarks, sendTo: selectedRecipient })
            } else if (activeRole === 'disbursalHead') {
                disbursalSendBack({ id: applicationProfile?.sanction?.application?.lead._id, reason: remarks, sendTo: selectedRecipient })
            }

        } else if (actionType === "recommend") {
            if (activeRole === "disbursalManager") {
                // console.log('submit', applicationProfile._id, remarks)
                recommendLoan({ id: applicationProfile._id, remarks })

            }

        }
    };

    const handlePreview = () => {
        sanctionPreview(id)
        setForceRender(true)
    };
    const handleSanctionApprove = () => {
        sanctionApprove(id)
    };
    const handleCancel = () => {
        // Reset all states to go back to initial state
        setActionType('');
        setSelectedReason('');
        setRemarks('');
    };

    useEffect(() => {
        if (holdLeadSuccess && holdLeadData) {
            Swal.fire({
                text: "Lead on hold!",
                icon: "success"
            });
            navigate("/lead-hold")
        }
        if (IsholdDisbursalSuccess && holdDisbursalData) {
            Swal.fire({
                text: "Disbursal on hold!",
                icon: "success"
            });
            navigate("/disbursal-process")
        }
        if (unholdLeadSuccess && unholdLeadData) {
            Swal.fire({
                text: "Lead in process!",
                icon: "success"
            });
            navigate("/lead-process")
        }
        if (rejectLeadSuccess && rejectLeadData) {
            Swal.fire({
                text: "Lead Rejected!",
                icon: "success"
            });
            navigate("/rejected-leads")
        }
        if (recommendLeadSuccess && recommendLeadData) {
            // Swal.fire({
            //     text: "Lead Forwarded!",
            //     icon: "success"
            // });
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
                title: "Lead Forwarded!`"
            });
            navigate("/lead-process")
        }
        setActionType('');
        setSelectedReason('');
        setRemarks('');

    }, [holdLeadData, holdDisbursalData, unholdLeadData, rejectLeadData, recommendLeadData])
    useEffect(() => {
        if (SendBackSuccess && sendBackData) {
            Swal.fire({
                text: "Application successfully send back!",
                icon: "success"
            });
            navigate("/application-process")
        }
        if (sanctionSendBackSuccess && sanctionSendBackData) {
            Swal.fire({
                text: "Application successfully send back!",
                icon: "success"
            });
            navigate("/pending-sanctions")
        }
        if (disbursalSendBackSuccess && disbursalSendBackData) {
            Swal.fire({
                text: "Disbursal successfully send back!",
                icon: "success"
            });
            navigate("/disbursal-process")
        }
        if (recommendLoanData && isLoanRecommendSuccess) {
            Swal.fire({
                text: "Lead recommended for disbursal!",
                icon: "success"
            });
            navigate("/disbursal-process")
        }
        setActionType('');
        setSelectedReason('');
        setRemarks('');


    }, [sendBackData, sanctionSendBackData, disbursalSendBackSuccess, disbursalSendBackData, recommendLoanData, isLoanRecommendSuccess])
    useEffect(() => {
        if (holdApplicationSuccess && holdApplicationData) {
            Swal.fire({
                text: "Application on hold!",
                icon: "success"
            });
            navigate("/application-hold")
        }
        if (unholdApplicationSuccess && unholdApplicationData) {
            Swal.fire({
                text: "Application in process!",
                icon: "success"
            });
            navigate("/application-process")
        }
        if (rejectApplicationSuccess && rejectApplicationData) {
            Swal.fire({
                text: "Application Rejected!",
                icon: "success"
            });
            navigate("/rejected-applications")
        }
        if (recommendApplicationSuccess && recommendApplicationData) {
            Swal.fire({
                text: "Application Forwarded!",
                icon: "success"
            });
            navigate("/application-process")
        }
        if (sanctionRejectSuccess && sanctionRejectData) {
            Swal.fire({
                text: "Application Forwarded!",
                icon: "success"
            });
            navigate("/pending-sanctions")
        }
        setActionType('');
        setSelectedReason('');
        setRemarks('');

    }, [holdApplicationData, unholdApplicationData, rejectApplicationData, recommendApplicationData, sanctionRejectData])

    useEffect(() => {
        if (unholdDisbursalData && unholdDisbursalSuccess) {
            Swal.fire({
                text: "Disbursal Unhold!",
                icon: "success"
            });
            navigate("/")
        }
        if (rejectDisbursalSuccess && rejectDisbursalData) {
            Swal.fire({
                text: "Disbursal Rejected!",
                icon: "success"
            });
            navigate("/rejected-disbursals")
        }

        setActionType('');
        setSelectedReason('');
        setRemarks('');

    }, [unholdDisbursalData, unholdDisbursalSuccess, rejectApplicationSuccess, rejectDisbursalData])

    useEffect(() => {
        if (sanctionApproveSuccess && sanctionApproveData) {
            Swal.fire({
                text: "Sanction Approved and Loan Number Allotted!",
                icon: "success"
            });
            // navigate("/pending-sanctions")

        }


    }, [sanctionApproveSuccess, sanctionApproveData])

    const isReadyForSubmit = sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading || recommendLoanLoading



    return (
        <>
            <Box sx={{ padding: 2 }}>
                {(isRecommendLeadError || isHoldError || isRejectError || isUnHoldError || isSendBackError) &&
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {recommendLeadError?.data?.message} {leadHoldError?.data?.message} {rejectLeadError?.data?.message} {unHoldleadError?.data?.message}  {sendBackError?.data?.message}
                    </Alert>
                }
                {(isApplicationRecommendError || isApplicationHoldError || isApplicationRejectError || isApplicationUnHoldError) &&
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {recommendApplicationError?.data?.message} {applicationHoldError?.data?.message} {rejectApplicationError?.data?.message} {unHoldApplicationError?.data?.message}
                    </Alert>
                }
                {(isSanctionSendBackError || isdisbursalSendBackError || isRecommendError || isSanctionApproveError || isRejectDisbursalError) &&
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {sanctionSendBackError?.data?.message}
                        {sanctionApproveError?.data?.message}
                        {disbursalSendBackError?.data?.message}
                        {recommendLoanError?.data?.message}
                        {rejectDisbursalError?.data?.message}
                    </Alert>
                }

                {/* Render buttons if no action is selected */}
                {(!actionType && !applicationProfile?.eSigned && !applicationProfile?.isDisbursed) && (
                    <Box sx={{ display: 'flex', flexWrap: "wrap", justifyContent: 'center', gap: 2, marginTop: 2 }}>
                        {
                            activeRole === "sanctionHead" &&
                            <>
                            {console.log('approve check',applicationProfile)}
                                
                                        {(!applicationProfile?.isApproved) ?

                                            <Button
                                                variant="contained"
                                                disabled={sanctionApproveLoading}
                                                color="success"
                                                onClick={() => handleSanctionApprove()}
                                                sx={{
                                                    backgroundColor: sanctionApproveLoading ? "#ccc" : "#04c93f",
                                                    color: sanctionApproveLoading ? "#666" : "white",
                                                    cursor: sanctionApproveLoading ? "not-allowed" : "pointer",
                                                    borderRadius: "0px 10px",
                                                    "&:hover": {
                                                        backgroundColor: sanctionApproveLoading ? "#ccc" : "#069130",
                                                    },
                                                }}
                                            >
                                                {sanctionApproveLoading ? <CircularProgress size={20} color="inherit" /> : "Approve"}
                                            </Button>
                                            :
                                            (!applicationProfile.eSignPending) ?

                                            <Button
                                                variant="contained"
                                                disabled={previewLoading}
                                                color="success"
                                                onClick={() => handlePreview()}
                                                sx={{
                                                    // background: "#04c93f",
                                                    background: previewLoading ? "#ccc" : "#04c93f",
                                                    color: previewLoading ? "#666" : "white",
                                                    cursor: previewLoading ? "not-allowed" : "pointer",
                                                    boxShadow: previewLoading ? "0px 2px 5px 2px rgb(0,0,0,0.2)" : "0px 2px 5px rgb(0,0,0,0.2)",
                                                    borderRadius: previewLoading ? "0px 10px" : "0px 10px",
                                                    "&:hover": {
                                                        background: previewLoading ? "#ccc" : "#04b539",
                                                    },
                                                }}
                                            >
                                                {previewLoading ? <CircularProgress size={20} color="inherit" /> : "Preview"}
                                            </Button>:null
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
                                                onClick={() => handleApprove('')}
                                                disabled={recommendApplicationLoading || recommendLeadloading}
                                                sx={{
                                                    backgroundColor: (recommendApplicationLoading || recommendLeadloading) ? "#ccc" : colors.primary[400],
                                                    borderRadius: (recommendApplicationLoading || recommendLeadloading) ? "#ccc" : "0px 10px 0px 10px",
                                                    color: (recommendApplicationLoading || recommendLeadloading) ? "#666" : colors.white[100],
                                                    cursor: (recommendApplicationLoading || recommendLeadloading) ? "not-allowed" : "pointer",
                                                    "&:hover": {
                                                        backgroundColor: (recommendApplicationLoading || recommendLeadloading) ? "#ccc" : colors.primary[100],
                                                    },
                                                }}
                                            >
                                                {(recommendApplicationLoading || recommendLeadloading) ? <CircularProgress size={20} color="inherit" /> : "Forward"}
                                            </Button>}
                                    </>
                                }
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleActionClick(isHold ? "unhold" : 'hold')}
                                    sx={{
                                        borderRadius: (isHold) ? "0px 10px 0px 10px" : "0px 10px 0px 10px",
                                        '&:hover': {
                                            backgroundColor: isHold ? '#ffcccb' : '#ffc107', // Set hover colors based on `isHold`
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
                            sx={{
                                borderRadius: "0px 10px",
                                '&:hover': {
                                    background: colors.redAccent[500], // Set hover colors based on `isHold`
                                },
                            }}
                        >
                            Reject
                        </Button>
                        {(activeRole !== "screener" && activeRole !== "disbursalManager" && !isHold) || applicationProfile?.eSigned &&
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleActionClick('sendBack')}
                                sx={{ borderRadius: "0px 10px", color: colors.white[100] }}
                            >
                                Send Back
                            </Button>}
                        {console.log(applicationProfile)}
                    </Box>
                )}
                {/* Render dropdown, input, and submit/cancel buttons when Hold or Reject is selected */}

                {(actionType === 'hold' || actionType === "unhold" || actionType === 'reject' || actionType === "sendBack" || actionType === "recommend") && (
                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 4,
                            backgroundColor: colors.white[100], // Light background for the entire form
                            borderRadius: "0px 15px 0px 15px",
                            boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        {(actionType === "hold" || actionType === "reject") && (
                            <>
                                <FormControl fullWidth sx={{ marginBottom: 3, }}>
                                    <InputLabel sx={{ color: colors.black[100] }}>Select a Reason</InputLabel>
                                    <Select
                                        value={selectedReason}
                                        onChange={handleReasonChange}
                                        displayEmpty
                                        fullWidth
                                        label="Select a Reason"
                                        sx={{
                                            borderRadius: "0px 10px 0px 10px",
                                            color: colors.black[100],              // Ensure text is black or dark
                                            backgroundColor: colors.white[100], // Light background for better contrast
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] }, // Border color
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] }, // Border on hover
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] }, // Border on focus
                                        }}
                                    >
                                        {/* <MenuItem value="" disabled>
                                            Select a reason
                                        </MenuItem> */}
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

                        {(selectedReason === 'Other' || actionType === "sendBack" || actionType === "recommend") && (
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
                                        marginBottom: 3,
                                        color: colors.black[100],                // Ensure text is black or dark
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
                                {(actionType === "sendBack") && (
                                    <>
                                        <FormControl fullWidth sx={{ marginBottom: 3, }}>
                                            <InputLabel>Send Back to</InputLabel>
                                            <Select
                                                value={selectedRecipient}
                                                onChange={(e) => setSelectedRecipient(e.target.value)}
                                                label="Send Back to"
                                                sx={{
                                                    color: colors.black[100],               // Ensure text is black or dark
                                                    backgroundColor: colors.white[100],  // Light background for the dropdown
                                                    borderRadius: "0px 10px",
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                                    '& .MuiSvgIcon-root': { color: colors.black[100] },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[400] },
                                                }}
                                            >
                                                <MenuItem
                                                    value=""
                                                    sx={{
                                                        color: colors.black[100],
                                                        background: colors.white[100],
                                                        '& .MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
                                                            background: colors.white[100],
                                                        }
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

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
                            <Button
                                variant="contained"
                                onClick={handleCancel}
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
                                onClick={handleSubmit}
                                disabled={sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading}
                                sx={{
                                    backgroundColor: (sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "#95bdf0" : colors.white[100],
                                    color: (sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "#666" : colors.primary[400],
                                    border: (sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "#666" : `1px solid ${colors.primary[400]}`,
                                    borderRadius: (sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "0px 10px" : "0px 10px",
                                    cursor: (sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "not-allowed" : "pointer",
                                    "&:hover": {
                                        backgroundColor: (sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? "#95bdf0" : colors.primary[400],
                                        color: colors.white[100],
                                    },
                                }}
                            >
                                {(sanctionSendBackLoading || disbursalSendBackLoading || holdLeadLoading || unholdLeadLoading || holdApplicationLoading || unholdApplicationLoading || rejectApplicationLoading || rejectLeadLoading) ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                            </Button>
                        </Box>
                    </Box>
                )}



            </Box>

        </>
    )
}

export default ActionButton
