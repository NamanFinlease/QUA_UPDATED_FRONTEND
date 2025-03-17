import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
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
  FormControl,
  InputLabel,
  OutlinedInput,
  useTheme,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddPaymentMutation } from "../../Service/LMSQueries";
import { paymentReceivedSchema } from "../../utils/validations";
import { tokens } from "../../theme";

const NewPaymentRecieved = ({repaymentDetails}) => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const dpd = repaymentDetails?.repaymentDetails?.dpd

  const [addPayment, { data, isLoading, isSuccess, isError, error }] =
    useAddPaymentMutation();

  const defaultValue = {
    receivedAmount: "",
    paymentDate: dayjs(),
    closingType: "",
    paymentMethod: "",
    transactionId: "",
    discount: "",
    bankName : "",
    excessAmount: "",
    accountRemarks: "",
    paymentUpload: "",
    repaymentDocs: "",
  };

  const { handleSubmit, control, setValue, getValues, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
    defaultValues: defaultValue,
    // resolver: yupResolver(paymentReceivedSchema),
  });

  const closingType = watch("closingType");
  const accountRemarks = watch("accountRemarks");

  const submitPayment = async (data) => {

    clearErrors("repaymentDocs")

    // Check if a file is selected
    if (!selectedFile) {
      setError("repaymentDocs", {
        type: "manual",
        message: "Upload Screenshot is required",
      });
      return; // Prevent form submission
    }
    try {
      const formData = new FormData();
      formData.append("receivedAmount", data.receivedAmount);
      formData.append("paymentDate", data.paymentDate);
      formData.append("closingType", data.closingType);
      formData.append("paymentMethod", data.paymentMethod);
      formData.append("transactionId", data.transactionId);
      formData.append("bankName", data.bankName);
      formData.append("discount", data.discount);
      formData.append("excessAmount", data.excessAmount);
      formData.append("repaymentDocs", selectedFile);
        formData.append("paymentRemarks", data.accountRemarks);
      // if (selectedFile) {
      //   formData.append("repaymentDocs", selectedFile);
      // }

      for (var pair of formData.entries()) {
        console.log("key <>>> ", pair[0] + ", " + pair[1]);
      }
      addPayment({ id, data: formData });
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileSelected(true);
      clearErrors("repaymentDocs");
      event.target.value = null;
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileSelected(false);
    fileInputRef.current.value = "";
    setError("repaymentDocs", { type: "manual", message: "" });
  };

  const handleKeyDown = (e) => {
    if (
      e.key.length === 1 &&
      !(e.key >= "0" && e.key <= "9") &&
      e.key !== "."
    ) {
      e.preventDefault();
    }
    if (e.key === "." && e.target.value.includes(".")) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Payment Added Successfully");
      Swal.fire({
        text: "Payment Added successfully",
        icon: "success"
      });
      reset();
      setSelectedFile(null);
    }
  }, [data, isSuccess]);



  return (
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
          New Payment Received
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
          <Paper sx={{ borderRadius: "20px" }}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(submitPayment)}
              sx={{
                background: colors.white[100],
                color: colors.black[100],
                padding: "30px",
                borderRadius: "0px 20px",
                boxShadow: "0 0px 18px rgba(0,0,0,0.1)",
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                "& .MuiTextField-root": {
                  color: colors.black[100],
                },
                "& .MuiInputLabel-root": {
                  color: colors.black[100],
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.primary[400],
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: colors.primary[400],
                },
                "& .MuiSelect-icon": {
                  color: colors.black[100],
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.primary[400],
                },
                "& .MuiInputBase-root": {
                  color: colors.black[100],
                },
                "& .Mui-disabled": {
                  color: colors.black[100],
                  background: colors.grey[100],
                  borderRadius: "3px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary[400],
                  },
                },
                '& .MuiOutlinedInput-root':{
                  color:colors.black[100],
                  '& fieldset': { borderColor: colors.primary[400] },
                  '&:hover fieldset': { borderColor: colors.primary[400] },
                },
              }}
            >
              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="receivedAmount"
                  type="number"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      onKeyDown={handleKeyDown}
                      fullWidth
                      label="Payment Received"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                />
              </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 45%" },
                    "& .MuiButtonBase-root": { color: "black" },
                  }}
                >
                  <Controller
                    name="paymentDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        {...field}
                        required
                        maxDate={dayjs()}
                        slotProps={{ textField: { format: "DD/MM/YYYY" } }}
                        label="Payment Receive Date"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </Box>
              </LocalizationProvider>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="closingType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                      error={!!fieldState.error}
                    >
                      <InputLabel htmlFor="closing-type">
                        Closing Type
                      </InputLabel>
                      <Select
                        {...field}
                        MenuProps={{
                          PaperProps: {
                              style: {
                                  backgroundColor: colors.white[100],
                                  color: colors.black[100],
                                  borderRadius:"20px 0px",
                              },
                          },
                        }}
                        input={
                          <OutlinedInput
                            label="Closing Type"
                            id="closing-type"
                          />
                        }
                      >
                        <MenuItem value="" disabled>Select</MenuItem>
                        <MenuItem value="closed" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Closed</MenuItem>
                        <MenuItem value="settled" hidden={dpd < 21} sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Settled</MenuItem>
                        <MenuItem value="writeOff" hidden={dpd < 21} sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>WriteOff</MenuItem>
                        <MenuItem value="partPayment" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>Part-Payment</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <Typography color="error">
                          {fieldState.error.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                      error={!!fieldState.error}
                    >
                      <InputLabel htmlFor="payment-select">
                        Payment Method
                      </InputLabel>
                      <Select
                        {...field}
                        MenuProps={{
                          PaperProps: {
                              style: {
                                  backgroundColor: colors.white[100],
                                  color: colors.black[100],
                                  borderRadius:"20px 0px",
                              },
                          },
                        }}
                        input={
                          <OutlinedInput
                            label="Payment Method"
                            id="payment-select"
                          />
                        }
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        <MenuItem value="upi" name="upiPayment" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          UPI
                        </MenuItem>
                        <MenuItem value="cash" name="cashpayment" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          Cash
                        </MenuItem>
                        <MenuItem value="cheque" name="chequePayment" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          Cheque
                        </MenuItem>
                        <MenuItem
                          value="Bank Transfer"
                          name="bankTransferPayment"
                          sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}
                        >
                          Bank Transfer
                        </MenuItem>
                      </Select>
                      {fieldState.error && (
                        <Typography color="error">
                          {fieldState.error.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="bankName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                      error={!!fieldState.error}
                    >
                      <InputLabel htmlFor="payment-bank">
                        Bank Name
                      </InputLabel>
                      <Select
                        {...field}
                        MenuProps={{
                          PaperProps: {
                              style: {
                                  backgroundColor: colors.white[100],
                                  color: colors.black[100],
                                  borderRadius:"20px 0px",
                              },
                          },
                        }}
                        input={
                          <OutlinedInput
                            label="Bank Name"
                            id="payment-bank"
                          />
                        }
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        <MenuItem value="HDFC7815" name="hdfcBank" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          HDFC / 7815
                        </MenuItem>
                        <MenuItem value="Bandhan4022" name="bandhanBank" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          Bandhan / 4022
                        </MenuItem>
                        <MenuItem value="Indusind2230" name="indusindBank" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          Indusind Bank / 2230
                        </MenuItem>
                        <MenuItem value="EquitasSmallFinance" name="equitasSmallBank" sx={{ background: colors.white[100], color: colors.black[100], ':hover': { background: colors.primary[400], color: colors.white[100] } }}>
                          Equitas Small Finance Bank
                        </MenuItem>
                      </Select>
                      {fieldState.error && (
                        <Typography color="error">
                          {fieldState.error.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="transactionId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="Reference No."
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                />
              </Box>

              {/* <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl variant="outlined" fullWidth error={!!fieldState.error}>
                        <InputLabel htmlFor="discount-type">Discount Type</InputLabel>
                        <Select
                          {...field}
                          value={selectedDiscountType}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedDiscountType(e.target.value);
                          }}
                          input={<OutlinedInput label="Discount Type" id="discount-type" />}
                        >
                          <MenuItem >Select</MenuItem>
                          <MenuItem value="PENALTY_DISCOUNT">Penalty Discount</MenuItem>
                          <MenuItem value="PRINCIPAL_DISCOUNT">Principle Discount</MenuItem>
                          <MenuItem value="INTEREST_DISCOUNT">Interest Discount</MenuItem>
                        </Select>
                        {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                      </FormControl>
                    )}
                  />
                </Box> */}

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="discount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      onKeyDown={handleKeyDown}
                      disabled={closingType === "partPayment" || closingType === ""}
                      // disabled={!selectedDiscountType}
                      fullWidth
                      label="Discount Amount"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <Controller
                  name="excessAmount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      onKeyDown={handleKeyDown}
                      label="Excess/Refund"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
                <Controller
                  name="accountRemarks"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Remarks"
                      variant="outlined"
                      required
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                />
                <p style={{fontSize:'12px', fontStyle:"italic", color:"#adadad", margin:0}}>Enter minimum 15 letters for remarks</p>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
                <Stack
                  spacing={1}
                  flexDirection="row"
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <input
                    name="repaymentDocs"
                    type="file"
                    id="paymentUpload"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <label htmlFor="paymentUpload">
                    <Button
                      variant="contained"
                      sx={{
                        color: colors.black[100],
                        background: colors.white[100],
                        borderRadius: "0px 10px",
                        border: `1px solid ${colors.primary[400]}`,
                      }}
                      component="span"
                    >
                      Upload Screenshot *
                    </Button>
                  </label>
                  {/* Display Selected File */}
                  {selectedFile && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      paddingLeft="10px"
                    >
                      <Typography>
                        Selected File: {selectedFile.name}
                      </Typography>
                      <IconButton color="error" onClick={handleRemoveFile}>
                        <CloseIcon />
                      </IconButton>
                    </Stack>
                  )}
                  {/* Display error message if no file is selected */}
                  {errors.repaymentDocs && (
                    <Typography color="error">
                      {errors.repaymentDocs.message}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Typography
                variant="h6"
                sx={{ fontStyle: "italic", color: colors.grey[400] }}
              >
                ( * ) Mandatory Fields are Required
              </Typography>

              <Box
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 100%" },
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: colors.primary[400],
                    color: colors.white[100],
                    borderRadius: "0px 10px",
                    cursor: accountRemarks.trim().length < 15 ? "not-allowed" : 'pointer',
                    ":hover": { 
                      background: colors.primary[100],
                      cursor : accountRemarks.trim().length < 15 ? "not-allowed" : 'pointer', 
                    },
                  }}
                  onClick={(e) => {
                    if (accountRemarks.trim().length < 15) {
                      e.preventDefault();
                    }
                  }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : "Add Payment"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default NewPaymentRecieved;
