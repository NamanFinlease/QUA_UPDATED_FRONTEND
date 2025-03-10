import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { tokens } from '../../theme';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DisbursalLoanInfo from "./DisbursalLoanInfo"; // Ensure the path is correct
import useAuthStore from "../store/authStore";
import useStore from "../../Store";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import { disburseSchema } from "../../utils/validations";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ActionButton from "../ActionButton";
import { useDisburseLoanMutation } from "../../Service/applicationQueries";

const DisburseLoan = ({ disburse }) => {
  const { id } = useParams();
  console.log("disburse Loan:",disburse);
  const [showForm, setShowForm] = useState(false);
  const { activeRole } = useAuthStore();
  const { applicationProfile } = useStore();
  const navigate = useNavigate();

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  console.log(applicationProfile)
  const { disbursalDate, netDisbursalAmount } =
  applicationProfile?.sanction?.application?.cam;
  const [disburseLoan, { data, isSuccess,isLoading, isError, error }] =
  useDisburseLoanMutation();

  

  const defaultValues = {
    payableAccount: "",
    amount: netDisbursalAmount,
    paymentMode: "",
    channel: "",
    disbursalDate: disbursalDate && dayjs(disbursalDate),
    remarks: "",
  };

  const { handleSubmit, control,reset, setValue } = useForm({
    resolver: yupResolver(disburseSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data) => {
    disburseLoan({ id, data });
  };

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm); // Toggle form visibility
  };
  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        text: "Loan Disbursed!",
        icon: "success",
      });
      reset()
      navigate("/disbursal-pending");
    }
  }, [isSuccess, data]);

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: colors.white[100],
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "0px 20px",
      }}
    >
      {/* Render DisbursalProfile component before the dropdown header */}
      <DisbursalLoanInfo disburse={disburse?.application} />

      {/* Clickable Header for Disbursal Bank with Background */}

      {activeRole === "disbursalHead" &&
        !applicationProfile.isDisbursed &&
        applicationProfile.isRecommended && (
          <>
            <Box
              onClick={handleToggleForm}
              sx={{
                backgroundColor: colors.primary[400], // Background color for header
                borderRadius: "0px 10px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: colors.white[100], // Text color
                marginTop: "20px",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: colors.white[100] }}
              >
                Disbursal Bank
              </Typography>
              <ExpandMoreIcon
                sx={{
                  marginLeft: "8px",
                  color: colors.white[100],
                  transform: showForm
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </Box>

            {/* Form that appears when the header is clicked */}
            {showForm && (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  padding: "20px",
                  border: `1px solid ${colors.primary[400]}`,
                  borderRadius: "0px 20px",
                  backgroundColor: colors.white[100],
                  fontSize: "12px",
                  lineHeight: "1.5",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginTop: "10px",
                  '& .MuiFormLabel-root':{
                    color:colors.primary[400],
                  },
                  '& .Mui-disabled':{
                    background:colors.grey[100],
                    '& .MuiFormControl-root':{
                      color:colors.primary[400],
                    },
                    '-webkit-text-fill-color':colors.black[100],
                    borderColor:colors.black[100]
                  },
                  '& .MuiFormControl-root':{
                    borderColor:colors.primary[100],
                  },
                  '& .MuiOutlinedInput-root':{
                    color:colors.black[100],
                  },
                  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':{
                    borderColor:colors.primary[400],
                  },
                  '& .MuiSelect-icon':{
                    color:colors.primary[400],
                  },
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "16px",
                  }}
                >
                  <Controller
                    name="payableAccount"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                        error={!!fieldState.error}
                      >
                        <InputLabel>
                          Payable Account
                        </InputLabel>
                        <Select
                          {...field}
                          label="Payable Account *"
                        >
                          <MenuItem value="">
                            <em>Select Account</em>
                          </MenuItem>
                          {applicationProfile?.disbursalBanks &&
                            applicationProfile?.disbursalBanks.map(
                              (bank) => (
                                <MenuItem
                                  key={
                                    bank._id
                                  }
                                  value={
                                    bank?.accountNo
                                  }
                                >
                                  {
                                    bank?.accountNo
                                  }
                                </MenuItem>
                              )
                            )}
                        </Select>
                        {fieldState.error && (
                          <Typography color="error">
                            {
                              fieldState.error
                                .message
                            }
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="amount"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Amount"
                        variant="outlined"
                        required
                        fullWidth
                        type="text"
                        disabled
                        error={!!fieldState?.error}
                        helperText={
                          fieldState?.error
                            ? fieldState?.error
                              ?.message
                            : ""
                        }
                        inputProps={{
                          placeholder: "Enter Amount",
                        }}
                        
                      />
                    )}
                  />
                  <Controller
                    name="paymentMode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                      >
                        <InputLabel>
                          Payment Mode
                        </InputLabel>
                        <Select
                          {...field}
                          label="Payment Mode"
                          required
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value="online">
                            Online
                          </MenuItem>
                          <MenuItem value="offline">
                            Offline
                          </MenuItem>
                        </Select>
                        {fieldState.error && (
                          <Typography color="error">
                            {
                              fieldState.error
                                .message
                            }
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="channel"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        fullWidth
                        variant="outlined"
                      >
                        <InputLabel>
                          Channel
                        </InputLabel>
                        <Select
                          {...field}
                          label="Channel"
                          required
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value="imps">
                            IMPS
                          </MenuItem>
                          <MenuItem value="neft">
                            NEFT
                          </MenuItem>
                        </Select>
                        {fieldState.error && (
                          <Typography color="error">
                            {
                              fieldState.error.message
                            }
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                  >
                    <Controller
                      name="disbursalDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          format="DD/MM/YYYY"
                          label="Disbursal Date"
                          value={
                            field.value
                              ? dayjs(
                                field.value,
                                "YYYY-MM-DD"
                              )
                              : null
                          }
                          onChange={(newValue) => {
                            field.onChange(
                              newValue
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              fullWidth
                              required
                              error={
                                !!fieldState?.error
                              }
                              helperText={
                                fieldState?.error
                                  ? fieldState
                                    ?.error
                                    ?.message
                                  : ""
                              }
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  <Controller
                    name="remarks"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Remarks"
                        required
                        variant="outlined"
                        fullWidth
                        error={!!fieldState?.error}
                        helperText={
                          fieldState?.error
                            ? fieldState?.error
                              ?.message
                            : ""
                        }
                      />
                    )}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    marginTop:"10px",
                    // width:"100%",
                    backgroundColor: isLoading ? "#ccc" : colors.primary[400],
                    color: isLoading ? "#666" : colors.white[100],
                    cursor: isLoading ? "not-allowed" : "pointer",
                    borderRadius:"0px 10px",
                    "&:hover": {
                        backgroundColor: isLoading ? "#ccc" : colors.primary[100],
                    },
                }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : "Disburse"}
                </Button>
              </Box>
            )}
            {isError &&
              <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                {error?.data?.message}
              </Alert>
            }
            {/* Submit button */}
          </>
        )}

      {!applicationProfile.isRejected &&
        (activeRole === "disbursalManager" ||
          applicationProfile.isRecommended) && (
          <ActionButton
            id={applicationProfile?._id}
            isHold={applicationProfile?.onHold}
          // setPreviewSanction={setPreviewSanction}
          // sanctionPreview={sanctionPreview}
          // setForceRender={setForceRender}
          />
        )}
    </Box>
  );
};

export default DisburseLoan;
