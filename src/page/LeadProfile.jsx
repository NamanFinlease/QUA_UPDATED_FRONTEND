import React, { useEffect, useState } from 'react';
import {  Button, Paper, Box, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFetchSingleLeadQuery, } from '../Service/Query';
import LeadDetails from '../Component/LeadDetails';
import InternalDedupe from '../Component/InternalDedupe';
import UploadDocuments from '../Component/UploadDocuments';
import ApplicationLogHistory from '../Component/ApplicationLogHistory';
import VerifyContactDetails from '../Component/leads/DetailsVerification';
import CibilScorePage from '../Component/leads/CibilScore';
import useStore from '../Store';
import ActionButton from '../Component/ActionButton';
import BarButtons from '../Component/BarButtons';
import useAuthStore from '../Component/store/authStore';
import ApplicantProfileData from '../Component/applicantProfileData';

const barButtonOptions = ['Lead', 'Documents', 'Verification',]


const LeadProfile = () => {
    const { id } = useParams();
    const {empInfo,activeRole} = useAuthStore()
    const [currentPage, setCurrentPage] = useState("lead");
    const [uploadedDocs, setUploadedDocs] = useState([]); 
    const { setLead } = useStore()
    const [leadEdit, setLeadEdit] = useState(false);


    const { data: leadData, isSuccess: leadSuccess, isError, error } = useFetchSingleLeadQuery(id, { skip: id === null });

    useEffect(() => {
        if (leadSuccess) {
            setLead(leadData)
            if (leadData?.document && leadData?.document.length > 0) {
                for (let docs of leadData.document) {
                    setUploadedDocs(pre => [...pre, docs.type])
                }
            }
        }

    }, [leadSuccess, leadData])

    return (
        <div className="crm-container">

            {leadEdit ? (
                <LeadDetails leadData={leadData} setLeadEdit={setLeadEdit} />
            ) : (
                <>
                    <div className="p-3">
                        <BarButtons
                            barButtonOptions={barButtonOptions}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />

                        {currentPage === "lead" &&
                            <>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: '20px',
                                        marginTop: '20px',
                                        borderRadius: '10px',
                                        color: '#1F2A40',  // Default text color for rows
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#1F2A40',  // Optional: Header background color
                                            color: 'white',  // White text for the headers
                                        },
                                        '& .MuiDataGrid-footerContainer': {
                                            backgroundColor: '#1F2A40',  // Footer background color
                                            color: 'white',  // White text for the footer
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                        },
                                        '& .MuiDataGrid-row': {
                                            backgroundColor: 'white',
                                        },
                                    }}
                                >
                                    <ApplicantProfileData leadData={leadData} />

                                    {isError &&
                                        <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                                            {error?.data?.message}
                                        </Alert>
                                    }
                                    {(activeRole !== "sanctionHead" && activeRole !== "admin") && <Box display="flex" justifyContent="flex-end" sx={{ my: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setLeadEdit(true)}
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                padding: '10px 20px',
                                                '&:hover': {
                                                    backgroundColor: 'darkPrimary',
                                                },
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Box>}


                                </Paper>
                                {leadData?._id &&
                                    <>
                                        <CibilScorePage id={leadData._id} />
                                        <InternalDedupe id={leadData._id} />
                                        <ApplicationLogHistory id={leadData._id} />
                                        {/* Action Buttons */}
                                        {(!leadData?.isRejected && activeRole !== "sanctionHead" && activeRole !== "admin" ) &&
                                            <div className='my-3  d-flex justify-content-center'>
                                                <ActionButton id={leadData._id} isHold={leadData.onHold} />
                                            </div>}
                                    </>
                                }
                            </>
                        }
                        {leadData?._id &&
                            <>
                                {currentPage === "verification" &&
                                    <VerifyContactDetails
                                        isMobileVerified={leadData?.isMobileVerified}
                                        isEmailVerified={leadData?.isEmailVerified}
                                        isAadhaarVerified={leadData?.isAadhaarVerified}
                                        isAadhaarDetailsSaved={leadData?.isAadhaarDetailsSaved}
                                        isPanVerified={leadData?.isPanVerified}
                                    />
                                }
                                {currentPage === "documents" &&
                                    <UploadDocuments
                                        leadData={leadData}
                                        setUploadedDocs={setUploadedDocs}
                                        uploadedDocs={uploadedDocs}
                                    />
                                }


                            </>
                        }
                    </div>


                </>
            )}
        </div>
    );
};

export default LeadProfile;
