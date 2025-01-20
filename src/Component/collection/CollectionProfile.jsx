import React, { useEffect, useState } from 'react';
import { Paper, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchActiveLeadQuery } from '../../Service/LMSQueries';
import useAuthStore from '../store/authStore';
import useStore from '../../Store';
import BarButtons from '../BarButtons';
import ApplicantProfileData from '../applicantProfileData';
import InternalDedupe from '../InternalDedupe';
import ApplicationLogHistory from '../ApplicationLogHistory';
import PersonalDetails from '../applications/PersonalDetails';
import BankDetails from '../applications/BankDetails';
import VerifyContactDetails from '../leads/DetailsVerification';
import UploadDocuments from '../UploadDocuments';
import Cam from '../applications/Cam';
import DisburseInfo from '../disbursal/DisburseLoan';
import ClosingRequest from './ClosingRequest';
import Payment from '../accounts/Payment';





const CollectionProfile = () => {
    const { id } = useParams();
    const [collectionData, setCollectionData] = useState()
    const { empInfo, activeRole } = useAuthStore()
    const { setApplicationProfile } = useStore();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("application");


    const { data, isSuccess, isError, error } = useFetchActiveLeadQuery(id, { skip: id === null });
    const { lead } = collectionData?.disbursal?.sanction?.application ?? {}
    const { application } = collectionData?.disbursal?.sanction ?? {}

    console.log('collection profile 1', data, collectionData)
    const barButtonOptions = [
        'Application',
        'Documents',
        'Personal',
        'Banking',
        'Verification',
        'Cam',
        'Disbursal',
        'Collection',
        ...(activeRole === "accountExecutive" ? ["Accounts"] : [])
    ]

    useEffect(() => {
        if (isSuccess && data) {
            setCollectionData(data?.data)
            setApplicationProfile(data?.data?.disbursal);
        }
        // if (isSuccess && data?.sanction?.application?.lead?.document?.length) {
        // }
    }, [isSuccess, data]);

    return (
        <div className="crm-container" style={{ padding: '10px' }}>

            <div className='p-3'>
                <BarButtons
                    barButtonOptions={barButtonOptions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

                {currentPage === "application" &&
                    <>
                        {lead?._id &&
                            <>
                                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', borderRadius: '10px' }}>
                                    <ApplicantProfileData leadData={lead} />
                                </Paper>
                                <InternalDedupe id={lead?._id} />
                                <ApplicationLogHistory id={lead?._id} />

                            </>

                        }


                    </>
                }

                {collectionData && Object.keys(collectionData).length > 0 &&
                    <>
                        {console.log('collection profile',)}
                        {currentPage === "personal" && <PersonalDetails id={application?.applicant} />}
                        {currentPage === "banking" &&
                            <BankDetails id={application?.applicant} />}

                        {currentPage === "verification" &&
                            <VerifyContactDetails
                                isMobileVerified={lead?.isMobileVerified}
                                isEmailVerified={lead?.isEmailVerified}
                                isAadhaarVerified={lead?.isAadhaarVerified}
                                isAadhaarDetailsSaved={lead?.isAadhaarDetailsSaved}
                                isPanVerified={lead?.isPanVerified}
                                isESignPending={collectionData?.disbursal?.sanction?.eSignPending}
                                isESigned={collectionData?.disbursal?.sanction?.eSigned}
                            />
                        }
                        {currentPage === "documents" && lead &&
                            <UploadDocuments
                                leadData={lead}
                            />
                        }

                        {currentPage === "cam" && <Cam id={application?._id} />}
                        {currentPage === "disbursal" && <DisburseInfo disburse={collectionData?.disbursal?.sanction} />}
                        {currentPage === "collection" && <ClosingRequest disburse={collectionData?.disbursal} />}
                        {currentPage === "accounts" && (
                            <>
                                {collectionData ? (
                                    <Payment
                                        collectionData={collectionData}
                                        leadId={id}
                                        activeRole={activeRole}
                                    />
                                ) : (
                                    <div>Loading account details...</div>
                                )}
                                {isError && (
                                    <Alert severity="error" style={{ marginTop: "10px" }}>
                                        {error?.data?.message || "Failed to load account details."}
                                    </Alert>
                                )}
                            </>
                        )}

                    </>

                }
                {(isError) &&
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {error?.data?.message}
                    </Alert>
                }
            </div>
        </div>
    );
};

export default CollectionProfile;

