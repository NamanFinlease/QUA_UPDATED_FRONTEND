import React, { useEffect, useState } from 'react';
import { Paper, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import UploadDocuments from '../UploadDocuments';
import LeadDetails from '../LeadDetails';
import PersonalDetails from './PersonalDetails';
import BankDetails from './BankDetails';
import { useFetchSingleApplicationQuery } from '../../Service/applicationQueries';
import useStore from '../../Store';
import Cam from './Cam';
import BarButtons from '../BarButtons';
import ActionButton from '../ActionButton';
import InternalDedupe from '../InternalDedupe';
import ApplicationLogHistory from '../ApplicationLogHistory';
import useAuthStore from '../store/authStore';
import VerifyContactDetails from '../leads/DetailsVerification';
import ApplicantProfileData from '../applicantProfileData';

const barButtonOptions = ['Application', 'Documents', 'Personal', 'Banking', 'Verification', 'Cam']

const ApplicationProfile = () => {
  const { id } = useParams();
  const { empInfo, activeRole } = useAuthStore()
  const { setApplicationProfile } = useStore();
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState("application");
  const [leadEdit, setLeadEdit] = useState(false);

  const { data: applicationData, isSuccess: applicationSuccess, isError, error, refetch } = useFetchSingleApplicationQuery(id, { skip: id === null });


  useEffect(() => {
    if (applicationSuccess) {
      setApplicationProfile(applicationData);
    }
    if (applicationSuccess && applicationData?.lead?.document?.length) {
      setUploadedDocs(applicationData?.lead?.document.map(doc => doc.type));
    }
  }, [applicationSuccess, applicationData]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  return (
    <div className="crm-container" style={{ padding: '10px' }}>
      {leadEdit ? (
        <LeadDetails applicationData={applicationData} setLeadEdit={setLeadEdit} />
      ) : (
        <>
          <div className='p-3'>
            <BarButtons
              barButtonOptions={barButtonOptions}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />

            {currentPage === "application" &&
              <>
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', borderRadius: '10px' }}>
                  <ApplicantProfileData leadData={applicationData?.lead} />
                </Paper>
                {applicationData?.lead?._id &&
                  <>
                    <InternalDedupe id={applicationData?.lead?._id} />
                    <ApplicationLogHistory id={applicationData?.lead?._id} />
                    {isError && (
                      <Alert severity="error" style={{ marginTop: "10px" }}>
                        {error?.data?.message}
                      </Alert>
                    )}

                    {/* Action Buttons */}

                    {(!applicationData.isRejected && activeRole !== "admin") &&
                      <Box display="flex" justifyContent="center" sx={{ marginTop: '20px' }}>
                        <ActionButton
                          id={applicationData._id}
                          isHold={applicationData.onHold}
                        />

                      </Box>}
                  </>

                }


              </>
            }

            {applicationData && Object.keys(applicationData).length > 0 &&
              <>
                {currentPage === "personal" && <PersonalDetails id={applicationData.applicant} />}
                {currentPage === "banking" &&
                  <BankDetails id={applicationData?.applicant} />}

                {currentPage === "verification" &&
                  <VerifyContactDetails
                    isMobileVerified={applicationData?.lead?.isMobileVerified}
                    isEmailVerified={applicationData?.lead?.isEmailVerified}
                    isAadhaarVerified={applicationData?.lead?.isAadhaarVerified}
                    isAadhaarDetailsSaved={applicationData?.lead?.isAadhaarDetailsSaved}
                    isPanVerified={applicationData?.lead?.isPanVerified}
                  />
                }
                {currentPage === "documents" &&
                  <UploadDocuments
                    leadData={applicationData?.lead}
                    setUploadedDocs={setUploadedDocs}
                    uploadedDocs={uploadedDocs}
                  />
                }

                {currentPage === "cam" && applicationData._id && <Cam id={applicationData._id} />}
              </>

            }


          </div>
        </>
      )}

    </div>
  );
};

export default ApplicationProfile;
