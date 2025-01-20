import React, { useEffect, useState } from 'react';
import { Paper, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazySanctionPreviewQuery, useSanctionProfileQuery } from '../../Service/applicationQueries';
import useAuthStore from '../store/authStore';
import useStore from '../../Store';
import BarButtons from '../BarButtons';
import InternalDedupe from '../InternalDedupe';
import ApplicationLogHistory from '../ApplicationLogHistory';
import ActionButton from '../ActionButton';
import PersonalDetails from '../applications/PersonalDetails';
import BankDetails from '../applications/BankDetails';
import UploadDocuments from '../UploadDocuments';
import Cam from '../applications/Cam'
import LoanSanctionPreview from './LoanSanctionPreview'
import ApplicantProfileData from '../applicantProfileData';
import SanctionLetterPreview from './SanctionLetterPreview';
import VerifyContactDetails from '../leads/DetailsVerification';


const barButtonOptions = ['Application', 'Documents', 'Personal', 'Banking', 'Verification', 'Cam']

const SanctionProfile = () => {
  const { id } = useParams();
  const { empInfo } = useAuthStore()
  const { setApplicationProfile } = useStore();
  const [previewSanction, setPreviewSanction] = useState(false)
  const [forceRender, setForceRender] = useState(false)
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState("application");

  const { data, isSuccess, isError, error } = useSanctionProfileQuery(id, { skip: id === null });
  const [sanctionPreview, { data: previewData, isSuccess: previewSuccess, isLoading: previewLoading, reset, isError: isPreviewError, error: previewError }] = useLazySanctionPreviewQuery()

console.log('data',data)



  useEffect(() => {
    if (isSuccess) {
      setApplicationProfile(data);
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
  console.log('loading', previewLoading)
  return (
    <div className="crm-container" style={{ padding: '10px' }} key={forceRender}>
      {previewSanction ? previewLoading ? <h1> .....Loading data</h1> :
        <LoanSanctionPreview
          id={id}
          preview={previewSanction}
          setPreview={setPreviewSanction}
          previewData={previewData}
        />
        // <SanctionLetterPreview
        // id={id} 
        // preview={previewSanction} 
        // setPreview={setPreviewSanction} 
        // previewData={previewData} 

        // />
        :
        <>

          <div className='p-3'>
            {data?.isApproved ?
              <h1>Sanctioned Application</h1>
              :
              <h1>Pending Application</h1>
            }
            <BarButtons
              barButtonOptions={barButtonOptions}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />

            {currentPage === "application" &&
              <>
                <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', borderRadius: '10px' }}>
                  <ApplicantProfileData leadData={data?.application?.lead} />
                </Paper>
                {data?.application?.lead?._id &&
                  <>
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
                  <BankDetails id={data?.application?.applicant} />}
                {currentPage === "verification" &&
                  <VerifyContactDetails
                    isAadhaarVerified={data?.application?.lead?.isAadhaarVerified}
                    isAadhaarDetailsSaved={data?.applicationData?.lead?.isAadhaarDetailsSaved}
                    isPanVerified={data?.application?.lead?.isPanVerified}
                    isESignPending={data?.eSignPending}
                    isESigned={data?.eSigned}
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
