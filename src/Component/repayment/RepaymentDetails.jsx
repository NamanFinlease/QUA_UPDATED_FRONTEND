import React, { useState, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  Typography,
  Checkbox,
  TextField,
  Box,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import useAuthStore from "../store/authStore";
import { useForm } from "react-hook-form";
import LoanInfo from "../collection/loanInfo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OutstandingLoanAmount from "../collection/OutstandingLoanAmount";
import CommonTable from "../CommonTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { paymentReceivedSchema } from "../../utils/validations";
import { useAddPaymentMutation } from "../../Service/LMSQueries";
import NewPaymentRecieved from "./NewPaymentRecieved";

const RepaymentDetails = (disburse) => {
  const [checkedFields, setCheckedFields] = useState({
    loanNo: false,
    loanAmount: false,
    tenure: false,
    repayAmount: false,
    blacklist: false, // State for the "Add to Blacklist" checkbox
  });
  const [remarks, setRemarks] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("Select a Reason");

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
    { field: "sno", headerName: "S.No", width: 50 },
    { field: "loanNo", headerName: "Loan No.", width: 150 },
    { field: "recoveryRemarks", headerName: "Remarks", width: 150 },
    { field: "paymentMode", headerName: "Payment Mode", width: 150 },
    { field: "paymentAmount", headerName: "Payment Amount", width: 150 },
    { field: "recoveryDiscount", headerName: "Discount", width: 150 },
    // { field: 'recoveryDiscountType', headerName: 'Discount Type', width: 150 },
    { field: "recoveryRefund", headerName: "Refund", width: 150 },
    {
      field: "recoveryReferenceNumber",
      headerName: "Reference No",
      width: 150,
    },
    { field: "recoveryDate", headerName: "Recovery Date", width: 150 },
    { field: "loanStatus", headerName: "Loan Status", width: 150 },
    {
      field: "paymentVerification",
      headerName: "Payment Verification",
      width: 150,
    },
    {
      field: "paymentUploadedBy",
      headerName: "Payment Uploaded By",
      width: 150,
    },
    {
      field: "paymentUploadedOn",
      headerName: "Payment Uploaded On",
      width: 150,
    },
    {
      field: "paymentVerifiedBy",
      headerName: "Payment Verified By",
      width: 150,
    },
    {
      field: "paymentVerifiedOn",
      headerName: "Payment Verified On",
      width: 150,
    },
    { field: "recoveryAction", headerName: "Action", width: 150 },
  ];

  const handleSaveBlacklist = () => {
    // Handle save logic here
    // You can use the blacklistReason and remarks state variables
    // to save the data to your backend or database
    console.log("Blacklist reason:", blacklistReason);
    console.log("Remarks:", remarks);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleBlacklistReasonChange = (event) => {
    setBlacklistReason(event.target.value);
  };


  return (
    <>
      {/* Loan Information */}
      <LoanInfo disburse={disburse?.sanction?.application} />
      {console.log(disburse)}

      {/* Payable and Outstanding Amount Information */}
      <OutstandingLoanAmount />

      {/* Add to Blacklist */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: colors.white[100],
          color: colors.black[100],
          maxWidth: "800px",
          margin: "0px auto",
          padding: "20px",
          borderRadius: "0px 20px",
        }}
      >
        <Checkbox
          name="blacklist"
          checked={checkedFields.blacklist}
          onChange={handleCheckboxChange}
          sx={{ color: colors.primary[400] }}
        />
        <Typography variant="body1" style={{ color: colors.black[100] }}>
          Add to Blacklist
        </Typography>
        {checkedFields.blacklist && (
          <Box
            component={Paper}
            elevation={4}
            sx={{
              maxWidth: "400px",
              marginTop: "20px",
              background: colors.white[100],
              padding: "10px 10px",
              borderRadius: "0px 20px",
            }}
          >
            <Typography variant="body2" style={{ color: colors.black[100] }}>
              Reason for Blacklisting:
            </Typography>
            <Select
              value={blacklistReason}
              onChange={handleBlacklistReasonChange}
              sx={{
                width: "100%",
                margin: "10px 0",
                background: colors.white[100],
                color: colors.black[100],
                borderColor: colors.black[100],
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "& .MuiSelect-select": {
                  color: colors.black[100],
                },
              }}
            >
              <MenuItem value="default" disabled>
                Select a reason
              </MenuItem>
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
                background: colors.white[100],
                color: colors.black[100],
                borderColor: colors.black[100],
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.black[100],
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                marginTop: "10px",
                background: colors.primary[400],
                borderRadius: "0px 10px",
              }}
              onClick={handleSaveBlacklist}
            >
              Save
            </Button>
          </Box>
        )}
      </Paper>

      {/* Recovery History */}
      <Accordion
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "800px",
          background: colors.white[100],
          borderRadius: "0px 20px",
          border: "0px",
          margin: "0px auto",
          marginTop: "20px",
          boxShadow: "0px 0px 10px rgb(0,0,0,0.2)",
          "&.Mui-expanded": {
            margin: "20px auto",
            display: "flex",
            justifyContent: "center",
          },
          "&.MuiAccordion-root:last-of-type": {
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}
        >
          <Typography variant="h6" style={{ color: colors.primary[400] }}>
            Payment History
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              background: colors.white[100],
              color: colors.primary[400],
              margin: "0 auto",
              borderRadius: "0px 20px",
              boxShadow: "0px 0px 10px rgb(0,0,0,0.2)",
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

      {/* New Payment Recieved */}
      <NewPaymentRecieved />
    </>
  );
};

export default RepaymentDetails;
