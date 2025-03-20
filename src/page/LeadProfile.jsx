import React, { useEffect, useState } from 'react';
import { tokens } from '../theme';
import { Button, Paper, Box, Alert, useTheme, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchSingleLeadQuery, } from '../Service/Query';
import LeadDetails from '../Component/LeadDetails';
import InternalDedupe from '../Component/InternalDedupe';
import UploadDocuments from '../Component/UploadDocuments';
import ApplicationLogHistory from '../Component/ApplicationLogHistory';
import EKycVerification from '../Component/leads/DetailsVerification';
import CibilScorePage from '../Component/leads/CibilScore';
import useStore from '../Store';
import ActionButton from '../Component/ActionButton';
import BarButtons from '../Component/BarButtons';
import useAuthStore from '../Component/store/authStore';
import ApplicantProfileData from '../Component/applicantProfileData';
import CommonRemarks from '../Component/CommonRemarks';


const LeadProfile = () => {
    const { id } = useParams();
    const { empInfo, activeRole } = useAuthStore()
    const [currentPage, setCurrentPage] = useState("lead");
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const { setLead } = useStore()
    const [leadEdit, setLeadEdit] = useState(false);
    const [commonRemarks, setCommonRemarks] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [isRemarksValid, setIsRemarksValid] = useState(false);
    
    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const { data: leadData, isSuccess: leadSuccess, isError, error } = useFetchSingleLeadQuery(id, { skip: id === null });

    // const barButtonOptions = ["Lead", "Documents", "Verification"];
    const isVerificationDisabled = !leadData?.isAadhaarVerified && !leadData?.isPanVerified;
    const barButtonOptions = [
        "Lead",
        "Documents",
        "Verification"
    ];
    
    const handleForwardRemarks = (remarks) => {
        if (remarks.length === 0){
            setErrorMessage("Remark is required.");
            setIsRemarksValid(false);
        }else{
            setErrorMessage("");
            setCommonRemarks(remarks)
            setIsRemarksValid(true);
        }
    };

    useEffect(() => {
        if (leadSuccess) {
            setLead(leadData);
            if (leadData?.document && leadData?.document.length > 0) {
                for (let docs of leadData.document) {
                    setUploadedDocs((pre) => [...pre, docs.type]);
                }
            }
        }
    }, [leadSuccess, leadData]);

    return (
        <div className="crm-container" style={{ display: "flex", flexDirection:"column", justifyContent: "center", }}>
        
            {leadEdit ? (
                <LeadDetails leadData={leadData} setLeadEdit={setLeadEdit} />
            ) : (
                <>
                    <div className="p-3" style={{ width: "90%", }}>
                        {leadData?.isRejected ?
                        <h1 style={{color:colors.primary[400]}}>Lead : Rejected</h1>
                        :
                        leadData?.onHold ?
                        <h1 style={{color:colors.primary[400]}}>Lead : On Hold</h1>
                        :
                        <h1 style={{color:colors.primary[400]}}>Lead : In Process</h1>
                        }
                        <BarButtons
                            barButtonOptions={barButtonOptions}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            disabledOptions={{ Verification: isVerificationDisabled }}
                        />

                        {currentPage === "lead" && (
                            <>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: '20px',
                                        marginTop: '20px',
                                        borderTopRightRadius: '20px',
                                        borderBottomLeftRadius: '20px',
                                        background: colors.white[100],
                                        '& .MuiDataGrid-row:hover': {
                                            backgroundColor: colors.white[100],
                                            cursor: 'pointer',
                                        },
                                        '& .MuiDataGrid-row': {
                                            backgroundColor: colors.white[100],
                                        },
                                    }}
                                >
                                    <ApplicantProfileData leadData={leadData} />

                                    {isError && (
                                        <Alert
                                            severity="error"
                                            sx={{ borderRadius: "8px", mt: 2 }}
                                        >
                                            {error?.data?.message}
                                        </Alert>)
                                    }
                                    {(activeRole !== "sanctionHead" && activeRole !== "admin") && (!leadData?.isRejected) && <Box display="flex" justifyContent="flex-end" sx={{ my: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setLeadEdit(true)}
                                            sx={{
                                                border: `3px solid ${colors.primary[400]}`,
                                                borderTopRightRadius: "10px",
                                                borderBottomLeftRadius: "10px",
                                                background: colors.white[100],
                                                color: colors.primary[400],
                                                padding: '10px 20px',
                                                transition: "all 0.3s ease",
                                                '&:hover': {
                                                    backgroundColor: colors.primary[400],
                                                    color: colors.white[100]
                                                },
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Box>}


                                </Paper>
                                {leadData?._id && (
                                    <>
                                        <CibilScorePage id={leadData._id} creditScore={leadData.cibilScore} />
                                        <InternalDedupe id={leadData._id} />
                                        <ApplicationLogHistory id={leadData._id} />
                                        {(!leadData?.isRejected || !leadData?.onHold) && <CommonRemarks id={leadData._id} onRemarksChange={handleForwardRemarks}/>}
                                        {(!leadData?.isRejected || !leadData?.onHold) && <Typography variant="h6" sx={{ mt: 2, color:colors.grey[400], fontSize:"14px", fontStyle:"italic" }}>
                                        * Remark is Mandatory to forward the lead (atleast 15 letters)
                                        </Typography>}
                                        {errorMessage && (
                                            <Alert
                                                severity="error"
                                                sx={{ borderRadius: "8px", mt: 2 }}
                                            >
                                                {errorMessage}
                                            </Alert>
                                        )}
                                        {/* Action Buttons */}
                                        {(!leadData?.isRejected && activeRole !== "sanctionHead" && activeRole !== "admin") &&
                                            <div className='my-3  d-flex justify-content-center'>
                                                <ActionButton id={leadData._id} isHold={leadData.onHold} commonRemarks={commonRemarks} disabled={!isRemarksValid} />
                                            </div>}
                                    </>
                                )}
                            </>
                        )}
                        {leadData?._id && (
                            <>
                                {currentPage === "verification" &&(
                                    <EKycVerification
                                        isMobileVerified={leadData?.isMobileVerified}
                                        isEmailVerified={leadData?.isEmailVerified}
                                        isAadhaarVerified={leadData?.isAadhaarVerified}
                                        isAadhaarDetailsSaved={leadData?.isAadhaarDetailsSaved}
                                        isPanVerified={leadData?.isPanVerified}
                                        leadId={leadData?._id}
                                    />
                                
                                )}
                                {currentPage === "documents" && (
                                    <UploadDocuments
                                        leadData={leadData}
                                        setUploadedDocs={setUploadedDocs}
                                        uploadedDocs={uploadedDocs}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LeadProfile;
