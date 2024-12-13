import React, { useEffect, useState } from 'react'
import { Button, Select, MenuItem, TextField, Box, Alert, Typography, FormControl, InputLabel } from '@mui/material';

import { useHoldLeadMutation, useRecommendLeadMutation, useRejectLeadMutation, useUnholdLeadMutation } from '../Service/Query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useHoldApplicationMutation, useHoldDisbursalMutation, useRecommendApplicationMutation, useRecommendLoanMutation, useRejectApplicationMutation, useRejectDisbursalMutation, useSanctionSendBackMutation, useDisbursalSendBackMutation, useSendBackMutation, useUnholdApplicationMutation, useUnholdDisbursalMutation } from '../Service/applicationQueries';
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

const LMSActionButton = ({ id, isHold, sanctionPreview, setForceRender }) => {

    const navigate = useNavigate()
    const { empInfo, activeRole } = useAuthStore()
    const { applicationProfile } = useStore()

    const [actionType, setActionType] = useState(''); // To track which action is selected: 'hold', 'reject', 'approve'
    const [selectedReason, setSelectedReason] = useState(''); // To track the selected reason for hold or reject
    const [selectedRecipient, setSelectedRecipient] = useState()
    const [reasonList, setReasonList] = useState(null)
    const [remarks, setRemarks] = useState('');

    // Application Action component API-----------
    const [holdApplication, { data: holdApplicationData, isSuccess: holdApplicationSuccess, isError: isApplicationHoldError, error: applicationHoldError }] = useHoldApplicationMutation();
    const [unholdApplication, { data: unholdApplicationData, isSuccess: unholdApplicationSuccess, isError: isApplicationUnHoldError, error: unHoldApplicationError }] = useUnholdApplicationMutation();
    const [recommendApplication, { data: recommendApplicationData, isSuccess: recommendApplicationSuccess, isError: isApplicationRecommendError, error: recommendApplicationError }] = useRecommendApplicationMutation();
    const [rejectApplication, { data: rejectApplicationData, isSuccess: rejectApplicationSuccess, isError: isApplicationRejectError, error: rejectApplicationError }] = useRejectApplicationMutation();

    // Disbursal Action component API-----------
    const [holdDisbursal, { data: holdDisbursalData, isSuccess: IsholdDisbursalSuccess, isError: isDisbursalHoldError, error: disbursalHoldError }] = useHoldDisbursalMutation();
    const [unholdDisbursal, { data: unholdDisbursalData, isSuccess: unholdDisbursalSuccess, isError: isUnholdDisbursalError, error: unHoldDisbursalError }] = useUnholdDisbursalMutation();
    const [recommendLoan, { data: RecommendLoan, isSuccess: isLoanRecommend, isError: isRecommendError, error: recommendLoanError }] = useRecommendLoanMutation()
    const [rejectDisbursal, { data: rejectDisbursalData, isSuccess: rejectDisbursalSuccess, isError: isRejectDisbursalError, error: rejectDisbursalError }] = useRejectDisbursalMutation();

    // Lead Action component API ----------------------
    const [holdLead, { data: holdLeadData, isSuccess: holdLeadSuccess, isError: isHoldError, error: leadHoldError }] = useHoldLeadMutation();
    const [unholdLead, { data: unholdLeadData, isSuccess: unholdLeadSuccess, isError: isUnHoldError, error: unHoldleadError }] = useUnholdLeadMutation();
    const [recommendLead, { data: recommendLeadData, isSuccess: recommendLeadSuccess, isError: isRecommendLeadError, error: recommendLeadError }] = useRecommendLeadMutation();
    const [rejectLead, { data: rejectLeadData, isSuccess: rejectLeadSuccess, isError: isRejectError, error: rejectLeadError }] = useRejectLeadMutation();
    const [sendBack, { data: sendBackData, isSuccess: SendBackSuccess, isError: isSendBackError, error: sendBackError }] = useSendBackMutation()

    // sanction Action mutation -------
    const [sanctionSendBack, { data: sanctionSendBackData, isSuccess: sanctionSendBackSuccess, isError: isSanctionSendBackError, error: sanctionSendBackError }] = useSanctionSendBackMutation()
    const [disbursalSendBack, { data: disbursalSendBackData, isSuccess: disbursalSendBackSuccess, isError: isdisbursalSendBackError, error: disbursalSendBackError }] = useDisbursalSendBackMutation()
    const [sanctionReject, { data: sanctionRejectData, isSuccess: sanctionRejectSuccess, isError: isSanctionRejectError, error: sanctionRejectError }] = useRejectLeadMutation();


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
            } else if(activeRole==='disbursalHead'){
                disbursalSendBack({ id: applicationProfile?.sanction?.application?.lead._id, reason: remarks, sendTo: selectedRecipient })
            }

        } else if (actionType === "recommend") {
            if (activeRole === "disbursalManager") {
                // console.log('submit', applicationProfile._id, remarks)
                recommendLoan({ id: applicationProfile._id, remarks })

            }

        }

        // Reset state after submission
        setActionType('');
        setSelectedReason('');
        setRemarks('');
    };

    const handlePreview = () => {
        sanctionPreview(id)
        setForceRender(true)
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
            Swal.fire({
                text: "Lead Forwarded!",
                icon: "success"
            });
            navigate("/lead-process")
        }

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


    }, [sendBackData, sanctionSendBackData, disbursalSendBackSuccess, disbursalSendBackData])
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

    }, [holdApplicationData, unholdApplicationData, rejectApplicationData, recommendApplicationData, sanctionRejectData])

    useEffect(()=> {
        if (unholdDisbursalData && unholdDisbursalSuccess) {
            Swal.fire({
                text: "Disbursal Unhold!",
                icon: "success"
            });
            navigate("/")
        }
        if (rejectApplicationSuccess && rejectApplicationData) {
            Swal.fire({
                text: "Disbursal Rejected!",
                icon: "success"
            });
            navigate("/rejected-disbursals")
        }

    },[unholdDisbursalData, unholdDisbursalSuccess])



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
                {(isSanctionSendBackError || isdisbursalSendBackError) &&
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {sanctionSendBackError?.data?.message}
                        {disbursalSendBackError?.data?.message}
                    </Alert>
                }

                {/* Render buttons if no action is selected */}
                {(!actionType && !applicationProfile?.isApproved) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                        {activeRole === "sanctionHead" && <Button
                            variant="contained"
                            color="success"
                            onClick={() => handlePreview()}
                        >
                            Preview
                        </Button>}
                        {(activeRole !== "sanctionHead" && activeRole !== "admin") &&
                            <>
                                {!isHold &&
                                    <>
                                        {(activeRole === "disbursalManager") ?
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleActionClick('recommend')}
                                            >
                                                Recommend
                                            </Button>
                                            :
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApprove('')}
                                            >
                                                Forward
                                            </Button>}
                                    </>
                                }
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleActionClick(isHold ? "unhold" : 'hold')}
                                >
                                    {isHold ? "Unhold" : "Hold"}
                                </Button>
                            </>
                        }
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleActionClick('reject')}
                        >
                            Reject
                        </Button>
                        {(activeRole !== "screener" && activeRole !== "disbursalManager") &&
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleActionClick('sendBack')}
                            >
                                Send Back
                            </Button>}
                    </Box>
                )}

                {/* Render dropdown, input, and submit/cancel buttons when Hold or Reject is selected */}



                {(actionType === 'hold' || actionType === "unhold" || actionType === 'reject' || actionType === "sendBack" || actionType === "recommend") && (
                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 4,
                            backgroundColor: '#f9f9f9', // Light background for the entire form
                            borderRadius: 2,
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {(actionType === "hold" || actionType === "reject") && (
                            <>
                                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                                    <InputLabel>Select a Reason</InputLabel>
                                    <Select
                                        value={selectedReason}
                                        onChange={handleReasonChange}
                                        displayEmpty
                                        fullWidth
                                        label="Select a Reason"
                                        sx={{
                                            borderRadius: 1,
                                            color: '#000',              // Ensure text is black or dark
                                            backgroundColor: '#f0f0f0', // Light background for better contrast
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c4c4c4' }, // Border color
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }, // Border on hover
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }, // Border on focus
                                        }}
                                    >
                                        <MenuItem value="" disabled>
                                            Select a reason
                                        </MenuItem>
                                        {reasonList && reasonList.length > 0 && reasonList.map((reason, index) => (
                                            <MenuItem key={index} value={reason.label}>
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
                                        marginBottom: 3,
                                        color: '#000',                // Ensure text is black or dark
                                        backgroundColor: '#aeb0af',   // Light background for text area
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#c4c4c4',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                            },
                                        },
                                    }}
                                />
                                {(actionType === "sendBack") && (
                                    <>
                                        <FormControl fullWidth sx={{ marginBottom: 3 }}>
                                            <InputLabel>Send Back to</InputLabel>
                                            <Select
                                                value={selectedRecipient}
                                                onChange={(e) => setSelectedRecipient(e.target.value)}
                                                label="Send Back to"
                                                sx={{
                                                    color: '#000',               // Ensure text is black or dark
                                                    backgroundColor: '#aeb0af',  // Light background for the dropdown
                                                    borderRadius: 1,
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c4c4c4' },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                }}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select recipient to send back
                                                </MenuItem>
                                                {activeRole === "creditManager" && <MenuItem value="screener">Screener</MenuItem>}
                                                {activeRole === "sanctionHead" && <MenuItem value="creditManager">Credit Manager</MenuItem>}
                                                {activeRole === "disbursalHead" && <MenuItem value="disbursalManager">Disbursal Manager</MenuItem>}
                                            </Select>
                                        </FormControl>
                                    </>
                                )}
                            </>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancel}
                                sx={{
                                    padding: '10px 20px',
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    ':hover': { backgroundColor: '#e0e0e0' },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{
                                    padding: '10px 20px',
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    backgroundColor: '#1976d2',
                                    ':hover': { backgroundColor: '#1565c0' },
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                )}



            </Box>

        </>
    )
}

export default LMSActionButton
