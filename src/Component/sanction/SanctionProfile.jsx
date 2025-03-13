import React, { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import {Paper, Box, Alert, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazySanctionPreviewQuery, useSanctionProfileQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import useStore from '../../Store';
import BarButtons from '../BarButtons';
import InternalDedupe from '../InternalDedupe';
import CibilScorePage from '../leads/CibilScore';
import ApplicationLogHistory from '../ApplicationLogHistory';
import ActionButton from '../ActionButton';
import PersonalDetails from '../applications/PersonalDetails';
import BankDetails from '../applications/BankDetails';
import UploadDocuments from '../UploadDocuments';
import Cam from '../applications/Cam'
import LoanSanctionPreview from './LoanSanctionPreview'
import ApplicantProfileData from '../applicantProfileData';
import SanctionLetterPreview from './SanctionLetterPreview';
import EKycVerification from '../leads/DetailsVerification';


const barButtonOptions = ['Application', 'Documents', 'Personal', 'Banking', 'Verification', 'Cam']

const SanctionProfile = () => {
  const { id } = useParams();
  const { empInfo } = useAuthStore()
  const { setApplicationProfile,setLead } = useStore();
  const [previewSanction, setPreviewSanction] = useState(false)
  const [forceRender, setForceRender] = useState(false)
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState("application");

  const { data, isSuccess, isError, error } = useSanctionProfileQuery(id, { skip: id === null });
  const [sanctionPreview, { data: previewData, isSuccess: previewSuccess, isLoading: previewLoading, isFetching:previewFetching, reset, isError: isPreviewError, error: previewError }] = useLazySanctionPreviewQuery()

  console.log("Data totalInterest", previewData)

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (isSuccess) {
      setApplicationProfile(data);
      setLead(data?.application?.lead)
    }
    if (isSuccess && data?.application?.lead?.document?.length) {
      setUploadedDocs(data?.application?.lead?.document.map(doc => doc.type));
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (previewSuccess && previewData && forceRender) {
      setPreviewSanction(true);
      setForceRender(false)
    }

  }, [previewSuccess, previewData, forceRender]);

  // Check if previewData is available
  if (!previewData && previewSanction) {
    return <div>Loading...</div>; // Show loading state
}
  console.log('loading', previewLoading,previewFetching)
  return (
    <div className="crm-container" style={{display:"flex", justifyContent:"center", }} key={forceRender}>
      {previewSanction ? (previewLoading || previewFetching) ? <h1> .....Loading data</h1>:
        // <LoanSanctionPreview 
        // id={id} 
        // preview={previewSanction} 
        // setPreview={setPreviewSanction} 
        // previewData={previewData} 
        // />
        <SanctionLetterPreview
          id={id} 
          preview={previewSanction} 
          setPreview={setPreviewSanction} 
          previewData={previewData} 
        />
        :
        <>

          <div className='p-3' style={{ width:"90%",}}>
            {data?.isApproved ? 
            <h1 style={{color:colors.primary[400]}}>Application : Sanctioned</h1>
            :
            <h1 style={{color:colors.primary[400]}}>Application : Pending</h1>
            }
            <BarButtons
              barButtonOptions={barButtonOptions}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />

            {currentPage === "application" &&
              <>
                <Paper 
                  elevation={3} 
                  sx={{
                    padding: '20px',
                    marginTop: '20px',
                    borderTopRightRadius: '20px',
                    borderBottomLeftRadius: '20px',
                    background:colors.white[100],
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: colors.white[100],
                        cursor: 'pointer',
                    },
                    '& .MuiDataGrid-row': {
                        backgroundColor: colors.white[100],
                    },
                }}
                >
                  <ApplicantProfileData leadData={data?.application?.lead} />
                </Paper>
                {data?.application?.lead?._id &&
                  <>
                    <CibilScorePage id={data?.application?.lead?._id} creditScore={data?.application?.lead?.cibilScore} />
                    <InternalDedupe id={data?.application?.lead?._id} />
                    <ApplicationLogHistory id={data?.application?.lead?._id} />
                    

                    {/* Action Buttons */}
                    {(isPreviewError || isError) &&
                      <Alert severity="error" style={{ marginTop: "10px" }}>
                        {error?.data?.message}  {previewError?.data?.message}
                      </Alert>
                    }

                    {!data.isRejected && <Box display="flex" justifyContent="center" sx={{ marginTop: '20px' }}>
                      <ActionButton
                        id={data._id}
                        isHold={data.onHold}
                        previewLoading={previewLoading}
                        setPreviewSanction={setPreviewSanction}
                        sanctionPreview={sanctionPreview}
                        setForceRender={setForceRender}

                      />

                    </Box>}
                  </>
                }

              </>
            }
            {data && Object.keys(data).length > 0 &&
              <>
                {currentPage === "personal" && <PersonalDetails id={data?.application?.applicant} />}
                {currentPage === "banking" &&
                  <BankDetails id={data?.application?.applicant} leadData={data?.application?.lead} />}
                {currentPage === "verification" &&
                  <EKycVerification
                    isAadhaarVerified={data?.application?.lead?.isAadhaarVerified}
                    isAadhaarDetailsSaved={data?.applicationData?.lead?.isAadhaarDetailsSaved}
                    isPanVerified={data?.application?.lead?.isPanVerified}
                    isESignPending={data?.eSignPending}
                    isESigned={data?.eSigned}
                    leadId={data?.application?.lead?._id}
                  />
                }

                {currentPage === "documents" && <UploadDocuments leadData={data?.application?.lead} setUploadedDocs={setUploadedDocs} uploadedDocs={uploadedDocs} />}

                {currentPage === "cam" && <Cam id={data?.application?._id} />}
              </>

            }


          </div>
        </>
      }


    </div>
  );
};

export default SanctionProfile;
