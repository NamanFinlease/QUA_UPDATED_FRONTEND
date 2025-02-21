import React, { useState,useEffect, useRef } from "react";
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
  Alert,
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
import { useFetchRepaymentDetailsQuery, useAddPaymentMutation } from "../../Service/LMSQueries";
import NewPaymentRecieved from "./NewPaymentRecieved";
import moment from 'moment';

const RepaymentDetails = ({disburse, repaymentId}) => {
  const { empInfo, activeRole } = useAuthStore()
  const [checkedFields, setCheckedFields] = useState({
    loanNo: false,
    loanAmount: false,
    tenure: false,
    repayAmount: false,
    blacklist: false, // State for the "Add to Blacklist" checkbox
  });
  const [remarks, setRemarks] = useState("");
  const [repaymentDetails, setRepaymentDetails] = useState([]);
  const [blacklistReason, setBlacklistReason] = useState("Select a Reason");
  const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 10,
    });

  const id = repaymentId;
  console.log(id)

  const { data: fetchRepaymentDetails, isSuccess: isFetchRepaymentSuccess, isError: isFetchRepaymentError, error: fetchRepaymenterror, } = 
          useFetchRepaymentDetailsQuery( id, {skip:id ===null});

  useEffect(()=>{
    if(fetchRepaymentDetails && isFetchRepaymentSuccess){
        setRepaymentDetails(fetchRepaymentDetails)
    }
  },[fetchRepaymentDetails, isFetchRepaymentSuccess])

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
    // { field: "sno", headerName: "S.No", width: 50 },
    { field: "loanNo", headerName: "Loan No.", width: 150 },
    { field: "paymentDate", headerName: "Payment Date", width: 150 },
    { field: "paymentAmount", headerName: "Payment Amount", width: 150 },
    { field: "closingType", headerName: "Closing Type", width: 150 },
    { field: "paymentReferenceNumber", headerName: "Reference No", width: 150 },
    { field: "paymentStatus", headerName: "Payment Verification Status", width: 150 },
    // { field: "paymentApprove", headerName: "Payment Approve/Reject", width: 150 },
    { field: "paymentMode", headerName: "Payment Mode", width: 150 },
    { field: "bankName", headerName: "Payment Bank", width: 150 },
    { field: "paymentDiscount", headerName: "Discount", width: 150 },
    { field: "excessAmount", headerName: "Excess Amount", width: 150 },
    // { field: 'recoveryDiscountType', headerName: 'Discount Type', width: 150 },
    // { field: "recoveryRemarks", headerName: "Remarks", width: 150 },
  ];

  const rows = fetchRepaymentDetails?.repaymentDetails?.paymentHistory?.map((paymentHistory) => ({
    id: paymentHistory?._id,
    loanNo: paymentHistory?.loanNo, 
    paymentMode: paymentHistory?.paymentMode,
    bankName: paymentHistory?.bankName,
    paymentAmount: paymentHistory?.receivedAmount,
    closingType: paymentHistory?.closingType,
    // paymentApprove: paymentHistory?.isRejected ? "Rejected" : "Approved",
    paymentDiscount : paymentHistory?.discount || 0,
    excessAmount : paymentHistory?.excessAmount || 0,
    paymentReferenceNumber : paymentHistory?.transactionId,
    paymentStatus : paymentHistory?.isPaymentVerified === false ? paymentHistory?.isRejected ? "Rejected" : "Pending" : "Verified",
    paymentDate : moment(paymentHistory?.paymentDate).format("DD-MM-YYYY"),
  })) || [];

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

  const handlePageChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)
    refetch({ page: newPaginationModel.page +1, limit: newPaginationModel.pageSize});
  };


  return (
    <>
      {/* Loan Information */}
      <LoanInfo repaymentDetails={repaymentDetails} />

      {/* Payable and Outstanding Amount Information */}
      <OutstandingLoanAmount outstandingDetails={repaymentDetails}/>

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

      {/* Payment History */}
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
              rows={rows}
              paginationModel={paginationModel}
              onPageChange={handlePageChange}
            />
          </Box>
        </AccordionDetails>
        {isFetchRepaymentError &&
          <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
              {fetchRepaymenterror?.message}
          </Alert>
        }
      </Accordion>

      {/* New Payment Recieved */}
      {(activeRole === "collectionExecutive" || activeRole === "collectionHead") &&
        <NewPaymentRecieved repaymentDetails={repaymentDetails} />
      }
    </>
  );
};

export default RepaymentDetails;