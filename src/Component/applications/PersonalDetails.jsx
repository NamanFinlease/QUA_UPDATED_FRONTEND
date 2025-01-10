import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
  Box,
  TableHead,
  Divider,
} from '@mui/material';
import { useApplicantPersonalDetailsQuery } from '../../Service/applicationQueries';
import useStore from '../../Store';
import Residence from './Residence';
import Employment from './Employment';
import Reference from './Reference';
import { formatDate } from '../../utils/helper';

const PersonalDetails = ({ id }) => {
  const { applicationProfile } = useStore()
  const [columns, setColumns] = useState()
  const [personalDetails, setPersonalDetails] = useState({});
  const [residence, setResidence] = useState({});
  const [employmentData, setEmploymentData] = useState({});
  const [reference, setReference] = useState({});

  const { data: applicantData, isSuccess: applicantSuccess, isError, error } = useApplicantPersonalDetailsQuery(
    id,
    { skip: id === null }
  );

  useEffect(() => {
    if (applicantSuccess) {
      setPersonalDetails(applicantData?.personalDetails);
      setResidence(applicantData?.residence);
      setEmploymentData(applicantData?.employment);
      setReference(applicantData?.reference);

    }
    setColumns([
      { label: 'Full Name', value: `${personalDetails?.fName || ''} ${personalDetails?.mName || ''} ${personalDetails?.lName || ''}`, label2: 'Date of Birth', value2: personalDetails?.dob && formatDate(personalDetails?.dob) || '' },
      { label: 'PAN', value: personalDetails?.pan || '', label2: 'Gender', value2: personalDetails?.gender || '' },
      { label: 'Aadhaar', value: personalDetails?.aadhaar || '', label2: 'Mobile', value2: personalDetails?.mobile || '' },
      { label: 'Personal Email', value: personalDetails?.personalEmail || '', label2: 'Office Email', value2: personalDetails?.officeEmail || '' },
    ]);
  }, [applicantSuccess, applicantData, personalDetails]);


  return (
    <>
      <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px', borderRadius: '10px', marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
          Personal Details
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
          <Table aria-label="personal details table">
            <TableBody>
              {columns?.map((row, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#918f8e' } }}>
                  <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                  <TableCell align="left">{row.value || ''}</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label2}</TableCell>
                  <TableCell align="left">{row.value2 || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {applicantData && Object.keys(applicantData).length > 0 &&
        <>
          <Residence residence={residence} />
          <Employment employmentData={employmentData} />
          <Reference reference={reference} />
        </>
      }
      {(isError) &&
        <Alert severity="error" style={{ marginTop: "10px" }}>
          {error?.data?.message}
        </Alert>
      }
    </>
  );
};

export default PersonalDetails;

