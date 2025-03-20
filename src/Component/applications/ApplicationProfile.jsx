import React, { useEffect, useState } from 'react';
import { Paper, Box, Alert, useTheme, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from 'react-router-dom';
import UploadDocuments from '../UploadDocuments';
import LeadDetails from '../LeadDetails';
import PersonalDetails from './PersonalDetails';
import BankDetails from './BankDetails';
import { useFetchSingleApplicationQuery } from '../../Service/applicationQueries';
import useStore from '../../Store';
import CibilScorePage from '../leads/CibilScore';
import Cam from './Cam';
import BarButtons from '../BarButtons';
import ActionButton from '../ActionButton';
import InternalDedupe from '../InternalDedupe';
import ApplicationLogHistory from '../ApplicationLogHistory';
import useAuthStore from '../store/authStore';
import EKycVerification from '../leads/DetailsVerification';
import ApplicantProfileData from '../applicantProfileData';
import CommonRemarks from '../CommonRemarks';

const barButtonOptions = ['Application', 'Documents', 'Personal', 'Banking', 'Verification', 'Cam']

const ApplicationProfile = () => {
  const { id } = useParams();
  const { empInfo, activeRole } = useAuthStore()
  const { setApplicationProfile,setLead } = useStore();
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState("application");
  const [leadEdit, setLeadEdit] = useState(false);
  const [commonRemarks, setCommonRemarks] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [isRemarksValid, setIsRemarksValid] = useState(false);

  const { data: applicationData, isSuccess: applicationSuccess, isError, error, refetch } = useFetchSingleApplicationQuery(id, { skip: id === null });

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    if (applicationSuccess) {
      setApplicationProfile(applicationData);
      setLead(applicationData?.application?.lead)
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
    <div className="crm-container" style={{display:"flex", justifyContent:"center",}}>
      {leadEdit ? (
        <LeadDetails applicationData={applicationData} setLeadEdit={setLeadEdit} />
      ) : (
        <>
          <div className='p-3' style={{ width:"90%",}}>
            {applicationData?.isRejected ?
            <h1 style={{color:colors.primary[400]}}>Application : Rejected</h1>
            :
            applicationData?.onHold ?
            <h1 style={{color:colors.primary[400]}}>Application : On Hold</h1>
            :
            <h1 style={{color:colors.primary[400]}}>Application : In Process</h1>
            }
            <BarButtons
              barButtonOptions={barButtonOptions}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />

            {currentPage === "application" &&
              <>
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', borderRadius: '0px 20px 0px 20px', background:colors.white[100], }}>
                  <ApplicantProfileData leadData={applicationData?.application?.lead} />
                </Paper>
                {applicationData?.application?.lead?._id &&
                  <>
                    <CibilScorePage id={applicationData?.application?.lead?._id} creditScore={applicationData?.application?.lead?.cibilScore} />
                    <InternalDedupe id={applicationData?.application?.lead?._id} />
                    <ApplicationLogHistory id={applicationData?.application?.lead?._id} />
                    {(!applicationData?.application?.isRejected || !applicationData?.application?.onHold) && <CommonRemarks id={applicationData?.application?.lead?._id} onRemarksChange={handleForwardRemarks} />}
                    {(!applicationData?.application?.isRejected || !applicationData?.application?.onHold) && <Typography variant="h6" sx={{ mt: 2, color:colors.grey[400], fontSize:"14px", fontStyle:"italic" }}>
                      * Remark is Mandatory to forward the application (atleast 15 letters)
                    </Typography>}
                    {errorMessage && (
                      <Alert
                          severity="error"
                          sx={{ borderRadius: "8px", mt: 2 }}
                      >
                          {errorMessage}
                      </Alert>
                    )}
                    {isError && (
                      <Alert severity="error" style={{ marginTop: "10px" }}>
                        {error?.data?.message}
                      </Alert>
                    )}

                    {/* Action Buttons */}

                    {(!applicationData.isRejected && activeRole !== "admin") &&
                      <Box display="flex" justifyContent="center" sx={{ marginTop: '20px' }}>
                        <ActionButton
                          id={applicationData?.application?._id}
                          isHold={applicationData.onHold}
                          commonRemarks={commonRemarks}
                          disabled={!isRemarksValid}
                        />

                      </Box>}
                  </>

                }


              </>
            }

            {applicationData && Object.keys(applicationData).length > 0 &&
              <>
                {currentPage === "personal" && <PersonalDetails id={applicationData?.application?.applicant} />}
                {currentPage === "banking" &&
                  <BankDetails id={applicationData?.application?.applicant} leadData={applicationData?.application?.lead} />}

                {currentPage === "verification" &&
                  <EKycVerification
                    isMobileVerified={applicationData?.application?.lead?.isMobileVerified}
                    isEmailVerified={applicationData?.application?.lead?.isEmailVerified}
                    isAadhaarVerified={applicationData?.application?.lead?.isAadhaarVerified}
                    isAadhaarDetailsSaved={applicationData?.application?.lead?.isAadhaarDetailsSaved}
                    isPanVerified={applicationData?.application?.lead?.isPanVerified}
                    leadId={applicationData?.application?.lead?._id}
                    bre={applicationData?.bre?.analysis[0]}
                  />
                }
                {currentPage === "documents" &&
                  <UploadDocuments
                    leadData={applicationData?.application?.lead}
                    setUploadedDocs={setUploadedDocs}
                    uploadedDocs={uploadedDocs}
                  />
                }

                {currentPage === "cam" && applicationData?.application?._id && <Cam id={applicationData?.application?._id} />}
              </>

            }


          </div>
        </>
      )}

    </div>
  );
};

export default ApplicationProfile;
