import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Box,
  Modal,
  Button,
  Alert,
} from '@mui/material';
import { useApproveApplicationMutation } from '../../Service/applicationQueries';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LoanSanctionPreview = ({
  id,
  preview,
  setPreview,
  previewData,
  // setForceRender
  // reset
}) => {

  const { fullname, loanAmount, disbursalDate, pan, bouncedCharges, mobile, penalInterest, processingFee, repaymentAmount, repaymentDate, roi, residenceAddress, sanctionDate, stateCountry, tenure, title } = previewData
  console.log('preview data',previewData)

  const navigate = useNavigate()

  const [approveApplication, { data, isSuccess, isError, error }] = useApproveApplicationMutation()

  const handleClose = () => {
    setPreview(false);
    // reset();
  };


  const handleApprove = () => {
    // Handle the approval logic here
    console.log('Loan Approved');
    // setForceRender(pre => pre+1)
    approveApplication(id)
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '900px',
    bgcolor: '#f2f3f5',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Allows scrolling if content overflows
    maxHeight: '90vh', // Limits modal height and enables scrolling for large content
  };

  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        text: "Sanction send to User!",
        icon: "success"
      });
      handleClose();

      navigate("/pending-sanctions")

    }
  }, [isSuccess, data])

  return (
    <>
      {/* MUI Modal */}
      <Modal open={preview} onClose={() => handleClose()}>
        <Box sx={modalStyle}>
          <Container sx={{ padding: '20px', border: '1px solid #ddd' }}>
            {/* Header Section */}
            <Box textAlign="center" mb={3}>
              <img
                src="https://ramleela.s3.ap-south-1.amazonaws.com/QUALOAN+Header+Footer+/Header.webp"
                alt="Sanctionletter-header"
                width="760"
                height="123"
                style={{ maxWidth: '100%' }}
              />
            </Box>

            {/* Date Section */}
            <Box textAlign="right" mb={2}>
              <Typography variant="h6" sx={{ color: '#0363a3' }}>
                Date: {sanctionDate}
              </Typography>
            </Box>

            {/* Recipient Details */}
            <Typography variant="body1" gutterBottom>
              <strong>To,</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>{title}</strong> {fullname}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {residenceAddress}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Contact No. :</strong> +91-{mobile}
            </Typography>

            {/* Message Section */}
            <Typography variant="body1" mt={2}>
              Thank you for showing your interest in Qualoan and giving us an opportunity to serve you.
            </Typography>
            <Typography variant="body1" mb={2}>
              We are pleased to inform you that your loan application has been approved as per the below mentioned terms and conditions.
            </Typography>

            {/* Company Info */}
            <Typography variant="body2" fontWeight="bold" mb={2}>
              Qualoan, a brand name under Naman Finlease Private Limited (RBI approved NBFC – Reg No.14.01466) S-370, Panchsheel Park, Delhi, 110017, India.
            </Typography>

            <Typography variant="body1" mb={2}>
              This sanction will be subject to the following Terms and Conditions:
            </Typography>

            {/* Loan Terms Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {/* Add Table Rows as needed */}
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Customer Name
                    </TableCell>
                    <TableCell>{fullname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Pan
                    </TableCell>
                    <TableCell>{pan}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Sanctioned Loan Amount (Rs.)
                    </TableCell>
                    {/* <TableCell sx={{ color: '#d9534f' }}>{new Intl.NumberFormat().format((loanAmount))} /-</TableCell> */}
                    <TableCell sx={{ color: '#d9534f' }}>{loanAmount} /-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      ROI
                    </TableCell>
                    <TableCell>{roi}% </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Mobile
                    </TableCell>
                    <TableCell>{mobile}</TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Disbursal Date
                    </TableCell>
                    <TableCell>{disbursalDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Repayment Amount
                    </TableCell>
                    <TableCell sx={{ color: '#d9534f' }}>{repaymentAmount} /-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Repayment Date
                    </TableCell>
                    <TableCell sx={{ color: '#d9534f' }}>{repaymentDate} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Processing Fee
                    </TableCell>
                    <TableCell>{processingFee}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#0363a3', color: '#FFF', fontWeight: 'bold' }}>
                      Penal Interest (%) 
                    </TableCell>
                    <TableCell>{penalInterest}% </TableCell>
                  </TableRow>
                  {/* Add more rows... */}
                </TableBody>
              </Table>
            </TableContainer>
            <Box>
              {/* Informational Section */}
              <Typography variant="body1" mb={2}>
                Henceforth, visiting (physically) your Workplace and Residence has your concurrence on it.
              </Typography>

              <Typography variant="body1" mb={2}>
                Kindly request you to go through the above-mentioned terms and conditions and provide your kind acceptance over E-mail so that we can process your loan for final disbursement.
              </Typography>

              {/* Regards Section */}
              <Typography variant="body1" fontWeight="bold" color="#0363a3" mb={1}>
                Best Regards,
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="#0363a3" mb={2}>
                Team Qualoan
              </Typography>

              {/* Link Section */}
              <Typography variant="body1" mb={2}>
                If you are not able to click on the accept button, please copy and paste this URL in your browser to proceed or click here:{" "}
                <a href="https://qualoan.com" target="_blank" rel="noopener noreferrer">
                  Qualoan
                </a>
              </Typography>

              {/* Note Section */}
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Kindly Note:
              </Typography>
              <Typography variant="body1" mb={1}>
                You can Prepay/Repay the loan amount using our link REPAY LOAN.
              </Typography>
              <Typography variant="body1" mb={1}>
                Non-payment of the loan on time will adversely affect your credit score, further reducing your chances of getting a loan again. Upon approval, the processing fee will be deducted from your sanctioned amount, and the balance amount will be disbursed to your account.
              </Typography>
              <Typography variant="body1" mb={2}>
                This Sanction letter is valid for 24 Hours only.
              </Typography>

              {/* Footer Image */}
              {/* <Box textAlign="center">
                <img
                  src="https://ramleela.s3.ap-south-1.amazonaws.com/SalarySaathi+Header+Footer+/Footer.webp"
                  alt="Sanctionletter-footer"
                  width="760"
                  height="104"
                  style={{ maxWidth: "100%" }}
                />
              </Box> */}
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={3}>
              <img
                src="https://ramleela.s3.ap-south-1.amazonaws.com/QUALOAN+Header+Footer+/letterhead_footer.webp"
                alt="Sanctionletter-footer"
                width="760"
                height="104"
                style={{ maxWidth: '100%' }}
              />
            </Box>

            {isError &&
              <Alert severity="error" style={{ marginTop: "10px" }}>
                {error?.data?.message}
              </Alert>
            }
            {/* Approve Button */}

            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2, px: 3 }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 3 }}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </Box>

          </Container>
        </Box>
      </Modal>
    </>
  );
};

export default LoanSanctionPreview;
