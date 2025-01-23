import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails,Paper,Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TextField, Box, MenuItem, Select, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import useAuthStore from '../store/authStore';
import { styled } from '@mui/system';
import LoanInfo from '../collection/loanInfo';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonTable from '../CommonTable';

const RepaymentDetails = (disburse) => {
  const { activeRole } = useAuthStore()
  const [checkedFields, setCheckedFields] = useState({
    loanNo: false,
    loanAmount: false,
    tenure: false,
    repayAmount: false,
    blacklist: false, // State for the "Add to Blacklist" checkbox
  });

  const [repaymentStatus, setRepaymentStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('Select a Reason');

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedFields((prevCheckedFields) => ({
      ...prevCheckedFields,
      [name]: checked,
    }));
  };

  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        activeRole === "screener" &&
        <input
          type="checkbox"
          checked={selectedLeads === params.row.id}

          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: 'sno', headerName: 'S.No', width: 50 },
    { field: 'loanNo', headerName: 'Loan No.', width: 150 },
    { field: 'recoveryRemarks', headerName: 'Remarks', width: 150 },
    { field: 'paymentMode', headerName: 'Payment Mode', width: 150 },
    { field: 'paymentAmount', headerName: 'Payment Amount', width: 150 },
    { field: 'recoveryDiscount', headerName: 'Discount', width: 150 },
    { field: 'recoveryRefund', headerName: 'Refund', width: 150 },
    { field: 'recoveryReferenceNumber', headerName: 'Reference No', width: 150 },
    { field: 'recoveryDate', headerName: 'Recovery Date', width: 150 },
    { field: 'loanStatus', headerName: 'Loan Status', width: 150 },
    { field: 'paymentVerification', headerName: 'Payment Verification', width: 150 },
    { field: 'paymentUploadedBy', headerName: 'Payment Uploaded By', width: 150 },
    { field: 'paymentUploadedOn', headerName: 'Payment Uploaded On', width: 150 },
    { field: 'paymentVerifiedBy', headerName: 'Payment Verified By', width: 150 },
    { field: 'paymentVerifiedOn', headerName: 'Payment Verified On', width: 150 },
    { field: 'recoveryAction', headerName: 'Action', width: 150 },
  ];

  const handleSaveBlacklist = () => {
    // Handle save logic here
    // You can use the blacklistReason and remarks state variables
    // to save the data to your backend or database
    console.log("Blacklist reason:", blacklistReason);
    console.log("Remarks:", remarks);
  };

  const handleRepaymentStatusChange = (event) => {
    setRepaymentStatus(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleBlacklistReasonChange = (event) => {
    setBlacklistReason(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <>
      <LoanInfo disburse={disburse} />

      <Paper elevation={3} sx={{margin:"30px auto", maxWidth:"800px", padding:"20px", background:colors.white[100], borderRadius:"0px 20px"}}>
        <Box sx={{width:"100%",margin:"20px 0px"}}>
          {(activeRole === "collectionExecutive" && 
            <>
              <Box 
                sx={{
                  display:'flex', 
                  justifyContent:'center', 
                  background:colors.white[100],
                  color:colors.primary[400], 
                  margin:"0 auto",
                  borderRadius: "0px 20px",
                  boxShadow:"0px 0px 10px rgb(0,0,0,0.2)",
                  }}
                >
                <TableContainer 
                  sx={{
                    borderRadius:"0px 20px",
                    '& .MuiTableCell-root':{
                      borderBottom:`2px solid ${colors.primary[400]}`,
                      color:colors.black[100],
                    }
                  }}
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Payable Amount</TableCell>
                          <TableCell>Recieved Amount</TableCell>
                          <TableCell>Discount Amount</TableCell>
                          <TableCell>Outstanding Amount</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TableHead>Interest Amount</TableHead>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TableHead>Principle Amount</TableHead>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TableHead>Penalty Amount</TableHead>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <TableHead>Grand Total</TableHead>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      <Paper elevation={3} 
        sx={{
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center",
          background:colors.white[100], 
          color:colors.black[100],
          maxWidth:"800px",
          margin:"0px auto",
          padding:"20px",
          borderRadius:"0px 20px"
        }}
      >
        <Checkbox
            name="blacklist"
            checked={checkedFields.blacklist}
            onChange={handleCheckboxChange}
            sx={{color:colors.primary[400]}}
          />
          <Typography variant="body1" style={{ color: colors.black[100] }}>
            Add to Blacklist
          </Typography>
          {checkedFields.blacklist && (
            <Box component={Paper} elevation={4} sx={{minWidth:"400px", marginTop: "20px", background:colors.white[100], padding:"10px 10px", borderRadius:"0px 20px"}}>
              <Typography variant="body2" style={{ color: colors.black[100] }}>
                Reason for Blacklisting:
              </Typography>
              <Select
                value={blacklistReason}
                onChange={handleBlacklistReasonChange}
                sx={{
                  width: "100%", 
                  margin: "10px 0", 
                  background:colors.white[100], 
                  color:colors.black[100],
                  borderColor:colors.black[100],
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.black[100], // Black border color
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.black[100], // Black border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.black[100], // Black border color when focused
                  },
                  '& .MuiSelect-select': {
                    color: colors.black[100], // Ensure the selected value text is black
                  },
                }}
              >
                <MenuItem value="default" disabled>Select a reason</MenuItem>
                <MenuItem value="fraud">Fraud</MenuItem>
                <MenuItem value="non-payment">Non-payment</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <Typography variant="body1" style={{ color: colors.black[100] }}>
                Remarks:
              </Typography>
              <TextField
                value={remarks}
                onChange={handleRemarksChange}
                sx={{
                  width: "100%", 
                  margin: "10px 0", 
                  background:colors.white[100],
                  color:colors.black[100],
                  borderColor:colors.black[100],
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.black[100], // Black border color
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.black[100], // Black border color on hover
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{marginTop: "10px", background:colors.primary[400], borderRadius:"0px 10px"}}
                onClick={handleSaveBlacklist}
              >
                Save
              </Button>
            </Box>
          )}
      </Paper>

      {/* <Paper elevation={3} sx={{maxWidth:"800px",margin:"20px auto", borderRadius:"0px 20px", background:colors.white[100]}}> */}
          <Accordion 
            sx={{
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              maxWidth: '800px',
              background: colors.white[100],
              borderRadius: '0px 20px',
              border: '0px',
              margin: '0px auto',
              marginTop: '20px',
              background:'transparent',
              '&.Mui-expanded': {
                  margin: '20px auto',
                  display: 'flex',
                  justifyContent: 'center',
              },
              '& .MuiPaper-root-MuiAccordion-root:last-of-type':{
                borderBottomLeftRadius:"20px",
              }
          }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color:colors.black[100]}}/>}>
              <Typography variant="h6" style={{ color: colors.black[100] }}>Recovery History</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Box 
                sx={{ 
                  background:colors.white[100],
                  color:colors.primary[400], 
                  margin:"0 auto",
                  borderRadius: "0px 20px",
                  boxShadow:"0px 0px 10px rgb(0,0,0,0.2)",
                }}
              >
                <CommonTable
                  columns={columns}
                  // rows={rows}
                  // paginationModel={paginationModel}
                  // onPageChange={handlePageChange}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
      {/* </Paper> */}
    </>
  );
};

export default RepaymentDetails;
