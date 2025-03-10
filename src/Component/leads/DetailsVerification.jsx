import React, { useEffect, useState } from 'react';
import { tokens } from "../../theme";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Typography,
  colors,
  useTheme
} from '@mui/material';
import Swal from 'sweetalert2';
import {
  useGetEmailOtpMutation,
  useLazyCheckDetailsQuery,
  useLazyGenerateAadhaarLinkQuery,
  useLazyGetPanDetailsQuery,
} from '../../Service/Query';
import { useNavigate, useParams } from 'react-router-dom';
import EmailVerification from './OtpVerification';
import PanCompare from './PanCompare';
import useAuthStore from '../store/authStore';
import AadhaarCompare from './AadhaarCompare';
import BreDetails from '../applications/BreDetails';

const EKycVerification = ({ isAadhaarVerified, isAadhaarDetailsSaved, isPanVerified, isESignPending, isESigned, leadId, bre }) => {
  const { id } = useParams()
  const { activeRole } = useAuthStore()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(false)
  const [openAadhaarCompare, setOpenAadhaarCompare] = useState()
  const [openBreDetails, setOpenBreDetails] = useState(false)
  const [breDetails, setBreDetails] = useState(bre)
  const [aadhaarData, setAadhaarData] = useState()
  const [otpAadhaar, setOtpAadhaar] = useState(false)
  const [panData, setPanData] = useState()
  const [panModal, setPanModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [otpPan, setOtpPan] = useState(false)
  const [mobileVerified, setMobileVerified] = useState(false);

    const [
        getEmailOtp,
        {
            data: emailOtp,
            isSuccess: emailOtpSuccess,
            isError: isEmailError,
            error: emailError,
        },
    ] = useGetEmailOtpMutation();
    const [
        checkDetails,
        {
            data: aadhaarDetails,
            isSuccess: aadhaarDetailsSuccess,
            isFetching: isAadhaarDetailsFetching,
            isLoading: aadhaarDetailsLoading,
            isError: isAadhaarDetailError,
            error: aadhaarDetailsError,
        },
    ] = useLazyCheckDetailsQuery();

    const [sendAadhaarLink, aadhaarRes] = useLazyGenerateAadhaarLinkQuery();
    const [getPanDetails, panRes] = useLazyGetPanDetailsQuery();

  const handleMobileVerification = () => {
    // Logic for mobile verification
    setMobileVerified(true);
    Swal.fire({
      title: 'Mobile Verified!',
      icon: 'success',
    });
  };

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleEmailVerification = () => {
    getEmailOtp(id)
  };
  const handlePanVerification = () => {
    // getPanDetails(leadId)
    setLoading(true);
    getPanDetails(leadId).finally(() => setLoading(false));
  }
  const handleSendAadhaarLink = () => {
    // sendAadhaarLink(id);
    setLoading(true);
    checkDetails(leadId).finally(() => setLoading(false));
  };

  const handleAadhaarVerification = () => {
    console.log('handle verification')
    checkDetails(leadId);
  };

  const handleBreDetails = () => {
    setOpenBreDetails(true);
    setBreDetails(bre);
  }
  // Effects
  useEffect(() => {
    if (panRes?.isSuccess && panRes?.data && !panRes?.isFetching) {
      setPanData(panRes?.data?.data);
      setPanModal(true);
    }
  }, [panRes?.data, panRes?.isSuccess, panRes?.isFetching]);

  // useEffect(() => {
  //   if (panRes?.isSuccess && panRes?.data && !panRes?.isFetching) {
  //     setPanModal(true);
  //   }
  // }, [panRes?.data, panRes?.isSuccess, panRes?.isFetching]);

  // useEffect(() => {
  //   if (emailOtpSuccess) {
  //     setOtp(true);
  //   }
  // }, [emailOtpSuccess]);

  useEffect(() => {
    if (aadhaarRes?.isSuccess && aadhaarRes && !aadhaarRes?.isFetching) {
      Swal.fire({
        text: "Link sent successfully!",
        icon: "success",
      });
      navigate(`/lead-process`)
    }
    if (aadhaarDetails && aadhaarDetailsSuccess && !isAadhaarDetailsFetching) {
      setOpenAadhaarCompare(true);
      setAadhaarData(aadhaarDetails?.data?.details);
    }
  }, [aadhaarRes, aadhaarDetails, aadhaarDetailsSuccess, isAadhaarDetailsFetching]);

  useEffect(() => {
    if (bre && openBreDetails) {
      setOpenBreDetails(true);
      setBreDetails(bre);
    }
  }, [bre, openBreDetails]);

  // Table Data
  const verificationData = [
    {
      type: 'Aadhaar',
      status: isAadhaarVerified ? 'Verified' : 'Not Verified',
      action: (
        <Button
          variant="contained"
          onClick={(!isAadhaarDetailsSaved && isAadhaarVerified)? handleSendAadhaarLink : handleAadhaarVerification}
          disabled={isAadhaarDetailsFetching || aadhaarDetailsLoading || aadhaarRes?.isLoading || aadhaarRes?.isFetching}
          sx={{
            background: colors.white[100],
            color: colors.primary[400],
            border: colors.primary[400],
            borderRadius: "0px 10px",
            ":hover": {
              background: colors.primary[400],
              color: colors.white[100],
            }
          }}
        >
          {isAadhaarVerified ? "Show Details" : isAadhaarDetailsSaved ? "Verify Aadhaar" : "Send Link"}
          {/* {isAadhaarVerified ? "Show Details" : "Verify Aadhaar"} */}
        </Button>
      ),
    },
    {
      type: 'PAN',
      status: isPanVerified ? 'Verified' : 'Not Verified',
      action: (
        <Button
          variant="contained"
          onClick={handlePanVerification}
          sx={{
            background: colors.white[100],
            color: colors.primary[400],
            border: colors.primary[400],
            borderRadius: "0px 10px",
            ":hover": {
              background: colors.primary[400],
              color: colors.white[100],
            }
          }}
        >
          {loading ? <CircularProgress size={24} color='inherit' /> : (isPanVerified ? "Show Details" : "Verify PAN")}
        </Button>
      ),
    },
    ...(activeRole !== 'screener' ? [

      {
        type: 'BRE',
        status: 'Analysed',
        action: (
          <Button
            variant="contained"
            onClick={handleBreDetails}
            sx={{
              background: colors.white[100],
              color: colors.primary[400],
              border: colors.primary[400],
              borderRadius: "0px 10px",
              ":hover": {
                background: colors.primary[400],
                color: colors.white[100],
              }
            }}
          >
            Show Analysis
          </Button>
        ),
      },
    ] : []),
    ...(activeRole === 'sanctionHead' || activeRole === 'disbursalManager' || activeRole === 'disbursalHead' || activeRole === 'collectionExecutive' || activeRole === 'collectionHead' ||  activeRole === 'admin' ? [{
      type: 'E-Sign',
      status: isESigned ? 'Completed' : 'Pending',
    }] : []),
  ];


  return (
    <Box
      sx={{
        boxShadow: "0px 0px 5px 5px rgba(0,0,0,0.1)",
        width: "100%",
        borderRadius: "0px 20px 0px 20px",
        padding: "20px",
        margin: "0px auto",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "20px 0px",
          color: colors.primary[400]
        }}
      >Verify Details
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          display: "flex",
          justifyContent: "center",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
          borderRadius: "0px 20px 0px 20px",
          background: colors.white[100],
          '& .MuiTableCell-root': {
            textAlign: "center",
            borderBottom: `2px solid ${colors.primary[400]}`,
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.black[100] }}>Document Type</TableCell>
              <TableCell sx={{ color: colors.black[100] }}>Status</TableCell>
              <TableCell sx={{ color: colors.black[100] }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {verificationData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: colors.black[100] }}>{row.type}</TableCell>
                <TableCell><Typography sx={{ color: row.status == 'Verified' || row.status == 'Completed' || row.status == 'Analysed' ? 'green' : 'red'}}>{row.status}</Typography></TableCell>
                <TableCell>{row.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {panModal && <PanCompare open={panModal} setOpen={setPanModal} panDetails={panData} />}
      {openAadhaarCompare && <AadhaarCompare open={openAadhaarCompare} setOpen={setOpenAadhaarCompare} aadhaarDetails={aadhaarData} />}
      {openBreDetails && <BreDetails open={openBreDetails} setOpen={setOpenBreDetails} breDetails={breDetails} />}
      
    </Box>
  );
};

export default EKycVerification;