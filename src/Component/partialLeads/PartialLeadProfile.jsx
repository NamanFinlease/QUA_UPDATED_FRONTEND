import React, { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import { Button, Paper, Alert, TextField, Box, useTheme, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { usePartialLeadProfileQuery, useRejectPartialLeadMutation } from '../../Service/LMSQueries';
import BarButtons from '../../Component/BarButtons';
import useAuthStore from '../../Component/store/authStore';
import PartialApplicantData from './partialApplicantData';
import Swal from 'sweetalert2';

const barButtonOptions = ["Lead"];

const PartialLeadProfile = () => {
    const { id } = useParams();
    const { activeRole } = useAuthStore();
    const [currentPage, setCurrentPage] = useState("lead");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [remarks, setRemarks] = useState("");

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data: leadData, isSuccess: leadSuccess, isError, error, isLoading } = usePartialLeadProfileQuery(id, { skip: id === null });
    const [rejectLead, { isSuccess: rejectSuccess, isError: rejectError }] = useRejectPartialLeadMutation();

    const handleRejectClick = () => {
        setShowRejectForm(true);
    };

    const handleConfirmReject = async () => {
        try {
            await rejectLead({id, remarks}).unwrap();
            setShowRejectForm(false);
        } catch (err) {
            console.error("Failed to reject lead:", err);
        }
    };

    const handleCancelReject = () => {
        setShowRejectForm(false);
        setRemarks("");
    };

    useEffect(() => {
        if (rejectSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Lead Rejected',
                text: 'The lead has been rejected.',
                confirmButtonText: 'OK'
            });
        }
    }, [rejectSuccess]);

    return (
        <div className="crm-container" style={{ display: "flex", flexDirection: "column", justifyContent: "center", }}>
            {/* {leadData?.partialLeadsDetails?.isRejected ?
            <h1 style={{color:colors.primary[400]}}>Partial Lead : Rejected</h1>
            :
            leadData?.partialLeadsDetails?.isCompleted ?
            <h1 style={{color:colors.primary[400]}}>Partial Lead : Compeleted</h1>
            :
            <h1 style={{color:colors.primary[400]}}>Partial Lead : In Process</h1>
            } */}
            <div className="p-3" style={{ width: "90%", }}>
                <BarButtons
                    barButtonOptions={barButtonOptions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

                {isLoading && <CircularProgress />}
                {leadSuccess && leadData && (
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '20px',
                            marginTop: '20px',
                            borderTopRightRadius: '20px',
                            borderBottomLeftRadius: '20px',
                            background: colors.white[100],
                        }}
                    >
                        <PartialApplicantData leadData={leadData?.partialLeadDetails} />

                        {isError && (
                            <Alert
                                severity="error"
                                sx={{ borderRadius: "8px", mt: 2 }}
                            >
                                {error?.data?.message}
                            </Alert>
                        )}
                    </Paper>
                )}

                {leadData?.partialLeadDetails?._id && (
                    <>
                        {/* Action Buttons */}
                        {(!leadData?.partialLeadDetails?.isRejected && activeRole === "screener") && !showRejectForm && (
                            <div className='my-3 d-flex justify-content-center'>
                                <Button
                                    variant='contained'
                                    sx={{
                                        backgroundColor: colors.redAccent[500],
                                        borderRadius: "0px 10px",
                                    }}
                                    onClick={handleRejectClick}
                                >
                                    Reject
                                </Button>
                            </div>
                        )}

                        {/* Rejection Form */}
                        {showRejectForm && (
                            <Box 
                                component={Paper} 
                                elevation={3} 
                                sx={{ 
                                    margin:'20px auto', 
                                    p: 2,
                                    width:'300px', 
                                    borderRadius: '0px 20px', 
                                    background: colors.white[100], 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <TextField
                                    autoFocus
                                    name='remarks'
                                    margin="dense"
                                    label="Remarks"
                                    type="text"
                                    sx={{
                                        ' & .MuiInputLabel-root': {
                                            color: colors.black[100],
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            color: colors.black[100],
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.primary[400],
                                        },
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                                <div className="d-flex justify-content-end mt-2">
                                    <Button 
                                        onClick={handleCancelReject} 
                                        sx={{ 
                                            mr: 1,
                                            background: colors.redAccent[500],
                                            color: colors.white[100],
                                            border: `1px solid ${colors.redAccent[500]}`, 
                                            borderRadius: "0px 10px",
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleConfirmReject}
                                        sx={{ 
                                            mr: 1,
                                            background: colors.primary[400],
                                            color: colors.white[100],
                                            border: `1px solid ${colors.primary[400]}`, 
                                            borderRadius: "0px 10px",
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </Box>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PartialLeadProfile;