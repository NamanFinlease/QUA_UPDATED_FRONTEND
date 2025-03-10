import React, { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { camSchema } from "../../utils/validations";
import { useUpdateCamDetailsMutation } from '../../Service/applicationQueries';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const EditCam = ({ camData, setIsEditing }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState(camData);
  const [errorMessage, setErrorMessage] = useState({
    recommendedLoanError: null,
  });
  const [loanRecommendedError, setLoanRecommendedError] = useState(null);


  console.log(camData)
  const today = new Date().toISOString().split('T')[0];

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [updateCamDetails, { data, isLoading, isSuccess, isError, error }] = useUpdateCamDetailsMutation();

  const defaultValue = {
    leadNo: '',                // Lead ID
    salaryDate1: '',           // Salary Date 1
    salaryAmount1: '',         // Salary Amount 1
    salaryDate2: '',           // Salary Date 2
    salaryAmount2: '',         // Salary Amount 2
    salaryDate3: '',           // Salary Date 3
    salaryAmount3: '',         // Salary Amount 3
    nextPayDate: '',           // Next Salary Date
    averageSalary: '',         // Median Salary Amount
    customerType: '',          // Customer Type
    dedupeCheck: '',           // Dedupe Check
    actualNetSalary: '',       // Net Salary
    creditBureauScore: '',     // Credit Bureau Score
    obligations: '',           // Obligations (Rs)
    salaryToIncomeRatio: '',   // Salary To Income Ratio
    eligibleLoan: '',          // Loan Amount
    loanRecommended: '',       // Loan Recommended
    disbursalDate: '',         // Disbursal Date
    repaymentDate: '',         // Repayment Date
    adminFeePercentage: '',    // Admin Fee Inc. GST (%)
    roi: '',                   // ROI (Rate of Interest)
    netAdminFeeAmount: '',     // Net Admin Fee Amount
    eligibleTenure: '',        // Eligible Tenure
    repaymentAmount: '',       // Repayment Amount
    remarks: '', 
  }

  const { handleSubmit, control, setValue, getValues, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
      defaultValues: defaultValue,
      resolver: yupResolver(camSchema),
    });

  const calculateDaysDifference = (disbursalDate, repaymentDate) => {
    if (!disbursalDate && !repaymentDate) {
      return 0;
    }
    const startDate = new Date(disbursalDate);
    const endDate = new Date(repaymentDate);
    const timeDiff = endDate - startDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const calculateRepayment = (amount) => {
    const repayAmount = Number(amount) ? Number(amount) + (Number(amount) * Number(formData.eligibleTenure) * Number(formData?.roi) / 100) : 0;
    return repayAmount;
  };

  const calculatePF = (loanRecommended, pfPercent) => {
    const processingFee = Number(loanRecommended) ? (Number(loanRecommended) * Number(pfPercent) / 100) : 0;
    return processingFee;
  };

  const validateSanctionAmount = (loan) => {
    if (loan > 100000) {
      setErrorMessage((prev) => ({
        ...prev,
        recommendedLoanError: "Amount mustn't be greater than 100000",
      }));
      return false;
    } else {
      setErrorMessage((prev) => ({ ...prev, recommendedLoanError: null }));
      return true;
    }
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

  // console.log(formData)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
      };

      if (name === 'adminFeePercentage') {
        updatedFormData.netAdminFeeAmount = calculatePF(updatedFormData.loanRecommended, updatedFormData.adminFeePercentage);
      }

      if (name === 'loanRecommended' || name === 'adminFeePercentage') {
        const recommendedLoan = Number(updatedFormData?.loanRecommended);
        if (!validateSanctionAmount(recommendedLoan)) return prevFormData;
        const finalSalaryToIncomeRatioPercentage = prevFormData.actualNetSalary
          ? (recommendedLoan / prevFormData.actualNetSalary) * 100
          : 0;
        updatedFormData.finalSalaryToIncomeRatioPercentage = `${finalSalaryToIncomeRatioPercentage.toFixed()}`;
        updatedFormData.netAdminFeeAmount = calculatePF(updatedFormData.loanRecommended, updatedFormData.adminFeePercentage);
        updatedFormData.netDisbursalAmount = recommendedLoan - updatedFormData?.netAdminFeeAmount;
        updatedFormData.repaymentAmount = calculateRepayment(recommendedLoan);
      }

      if (name === 'repaymentDate' || name === 'disbursalDate' || name === "nextPayDate") {
        
        const eligibleTenure = calculateDaysDifference(updatedFormData.disbursalDate, updatedFormData.nextPayDate);
        updatedFormData.eligibleTenure = eligibleTenure + 1 || 0;

        const roiDecimal = Number(updatedFormData?.roi) / 100;
        const loanRecommended = Number(updatedFormData.loanRecommended);
        updatedFormData.repaymentAmount = loanRecommended
          ? loanRecommended + (loanRecommended * roiDecimal * (eligibleTenure + 1))
          : 0;
      }

      // Check if loan recommended is greater than loan applied
      if (name === 'loanRecommended') {
        const loanRecommended = Number(value);
        const loanApplied = Number(updatedFormData.loanAmount); // Assuming loanAmount is the field for Loan Applied

        if (loanRecommended > loanApplied) {
          setLoanRecommendedError("Loan Recommended cannot be greater than Loan Applied.");
        } else {
          setLoanRecommendedError(null); // Clear the error if validation passes
        }
      }

      if (name === 'nextPayDate') {
        updatedFormData.repaymentDate = value;
      }

      return updatedFormData;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const isValidDate = (date) => {
      return !isNaN(Date.parse(date));
    };

    if (formData.actualNetSalary > 0 && isValidDate(formData.disbursalDate) && isValidDate(formData.repaymentDate)) {
      updateCamDetails({
        id: id,
        updates: formData
      });
    } else {
      setErrorMessage("Please fill out all the required fields.");
      console.warn("Validation failed. Required fields missing.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const calculatesalaryToIncomeRatio = (salary) => {
    if (salary < 25000) {
      return '0';
    } else if (salary >= 25000 && salary < 35000) {
      return '35';
    } else if (salary >= 35000 && salary < 50000) {
      return '40';
    } else {
      return '40';
    }
  };

  const calculateEligibleLoan = (salary, salaryToIncomeRatioPercentage,) => {
    const salaryToIncomeRatioDecimal = parseFloat(salaryToIncomeRatioPercentage) / 100;
    return salary * salaryToIncomeRatioDecimal;
  };

  useEffect(() => {
    const salaryToIncomeRatioPercentage = calculatesalaryToIncomeRatio(formData.actualNetSalary);
    const eligibleLoan = calculateEligibleLoan(formData.actualNetSalary, salaryToIncomeRatioPercentage, formData.loanAmount);
    if (formData.actualNetSalary > 25000) {
      setFormData((prevData) => ({
        ...prevData,
        customerCategory: 'CAT - B'
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        customerCategory: ''
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      salaryToIncomeRatio: salaryToIncomeRatioPercentage,
      eligibleLoan: eligibleLoan,
    }));
  }, [formData.actualNetSalary, formData.loanAmount]);

  const meanSalary = (sal1, sal2, sal3) => {
    return (sal1 + sal2 + sal3) / 3;
  };

  useEffect(() => {
    const avgSal = meanSalary(
      Number(formData.salaryAmount1),
      Number(formData.salaryAmount2),
      Number(formData.salaryAmount3)
    ).toFixed(2);

    setFormData((prevData) => ({
      ...prevData,
      averageSalary: avgSal || 0,
    }));
  }, [formData.salaryAmount1, formData.salaryAmount2, formData.salaryAmount3]);

  useEffect(() => {
    const calculateFOIR = (netSalary, obligations) => {
      const foir = netSalary > 0 ? ((netSalary - obligations) / netSalary) * 100 : 0;
      return `${foir.toFixed(2)}%`;
    };

    setFormData((prevData) => ({
      ...prevData,
      eligiblesalaryToIncomeRatioPercentage: calculateFOIR(prevData.actualNetSalary, prevData.obligations),
    }));
  }, [formData.actualNetSalary, formData.obligations]);

  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        text: "Cam Updated Successfully!",
        icon: "success"
      });
      setIsEditing(false);
      setErrorMessage("");
    }
  }, [isSuccess, data]);

  return (
    <Box
      novalidate
      component="form"
      onSubmit={handleSave}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: "0px 0px 20px rgb(0,0,0,0.2)",
        padding: '30px',
        borderRadius: '0px 20px',
        color: colors.black[100],
        background:colors.white[100],
        '& .MuiOutlinedInput-root':{
          color:colors.black[100],
        },
        '& .MuiFormLabel-root':{
          color:colors.black[100]
        },
        '& .MuiFormControl-root':{
          width:"100%",
        },
        '& .MuiOutlinedInput-notchedOutline':{
          borderColor:colors.primary[400],
        },
        '& .MuiTypography-root':{
          color:colors.black[100],
        },
        '& .Mui-readOnly':{
          background:colors.grey[100],
        },
      }}
    >
      {/* First Row (4 items) */}
      <Box display="flex" flexWrap="wrap" gap="16px">
        <Box flex="1 1 46%">
          <TextField
            label="Lead No"
            name="leadNo"
            type="string"
            fullWidth
            value={formData.leadNo}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Credit Bureau Score"
            name="creditBureauScore"
            fullWidth
            value={formData.creditBureauScore}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Box flex="1 1 46%">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DatePicker
              label="Salary Date 1"
              sx={{
                '& .MuiSvgIcon-root':{
                  fill: colors.black[100],
                },

              }}
              value={formData.salaryDate1 ? dayjs(formData.salaryDate1) : null}
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: 'salaryDate1',
                    value: newValue ? newValue.toISOString() : '',
                  },
                });
              }}
              slotProps={{
                textField: { format: "DD-MM-YYYY" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...params.inputProps,
                    min: today,
                  }}
                />
              )}
              maxDate={dayjs(today)}
            />
          </LocalizationProvider>
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Salary Amount 1"
            name="salaryAmount1"
            type="text"
            onKeyDown={handleKeyDown}
            fullWidth
            value={formData.salaryAmount1}
            onChange={handleChange}
          />
        </Box>
      

      {/* Second Row (4 items) */}

        <Box flex="1 1 46%">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DatePicker
              label="Salary Date 2"
              sx={{
                '& .MuiSvgIcon-root':{
                  fill: colors.black[100],
                },
              }}
              value={formData.salaryDate2 ? dayjs(formData.salaryDate2) : null}
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: 'salaryDate2',
                    value: newValue ? newValue.toISOString() : '',
                  },
                });
              }}
              slotProps={{
                textField: { format: "DD-MM-YYYY" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...params.inputProps,
                    min: today,
                  }}
                />
              )}
              maxDate={dayjs(today)}
            />
          </LocalizationProvider>
        </Box>
      
        <Box flex="1 1 46%">
          <TextField
            label="Salary Amount 2"
            name="salaryAmount2"
            type="text"
            onKeyDown={handleKeyDown}
            fullWidth
            value={formData.salaryAmount2}
            onChange={handleChange}
          />
        </Box>

        <Box flex="1 1 46%">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DatePicker
              label="Salary Date 3"
              sx={{
                '& .MuiSvgIcon-root':{
                  fill: colors.black[100],
                },
              }}
              value={formData.salaryDate3 ? dayjs(formData.salaryDate3) : null}
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: 'salaryDate3',
                    value: newValue ? newValue.toISOString() : '',
                  },
                });
              }}
              slotProps={{
                textField: { format: "DD-MM-YYYY" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...params.inputProps,
                    min: today,
                  }}
                />
              )}
              maxDate={dayjs(today)}
            />
          </LocalizationProvider>
        </Box>
        
        <Box flex="1 1 46%">
          <TextField
            label="Salary Amount 3"
            name="salaryAmount3"
            type="text"
            onKeyDown={handleKeyDown}
            fullWidth
            value={formData.salaryAmount3}
            onChange={handleChange}
          />
        </Box>

      {/* Third Row (4 items) */}

        <Box flex="1 1 46%">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DatePicker
              label="Next Salary Date"
              sx={{
                '& .MuiSvgIcon-root':{
                  fill: colors.black[100],
                },
              }}
              value={formData.nextPayDate ? dayjs(formData.nextPayDate) : null}
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: 'nextPayDate',
                    value: newValue ? newValue.toISOString() : '',
                  },
                });
              }}
              slotProps={{
                textField: { format: "DD-MM-YYYY" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...params.inputProps,
                    min: today,
                  }}
                />
              )}
              minDate={dayjs(today)}
            />
          </LocalizationProvider>
        </Box>
    
        <Box flex="1 1 46%">
          <TextField
            label="Average Salary"
            name="averageSalary"
            type="text"
            onKeyDown={handleKeyDown}
            fullWidth
            value={formData.averageSalary}
            onChange={handleChange}
          />
        </Box>
        
        <Box flex="1 1 46%">
          <TextField
            label="Net Salary"
            name="actualNetSalary"
            type="text"
            onKeyDown={handleKeyDown}
            fullWidth
            value={formData.actualNetSalary}
            onChange={handleChange}
            required
          />
        </Box>

      {/* Fourth Row (4 items) */}
      
        <Box flex="1 1 46%">
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
              '& .MuiInputLabel-root': { color: colors.black[100] },
              '& .MuiSelect-select': { color: colors.black[100] },
              '& .MuiSelect-icon': { color: colors.black[100] },
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
              }
            }}
          >
            <InputLabel id="customer-type" style={{ color: colors.black[100] }}>Customer Type</InputLabel>
            <Select
              labelId="customer-type"
              label="Customer Type"
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
            >
              <MenuItem value="" disabled>Select Customer Type</MenuItem>
              <MenuItem value="NEW">NEW</MenuItem>
              <MenuItem value="REPEAT">REPEAT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* <Box flex="1 1 46%">
          <TextField
            label="Customer Type"
            name="customerType"
            fullWidth
            value={formData.customerType}
            onChange={handleChange}
          />
        </Box> */}
        <Box flex="1 1 46%">
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
              '& .MuiInputLabel-root': { color: colors.black[100] },
              '& .MuiSelect-select': { color: colors.black[100] },
              '& .MuiSelect-icon': { color: colors.black[100] },
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
              }
            }}
          >
            <InputLabel id="dedupe-check-label" style={{ color: colors.black[100] }}>Dedupe Check *</InputLabel>
            <Select
              labelId="dedupe-check-label"
              label="Dedupe Check"
              name="dedupeCheck"
              value={formData.dedupeCheck}
              onChange={handleChange}
            >
              <MenuItem value="" disabled>Select Dedupe Check</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Customer Category"
            name="customerCategory"
            fullWidth
            value={formData.customerCategory}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly:true
            }}
          />
        </Box>

      {/* Fifth Row (4 items) */}
      
        <Box flex="1 1 46%">
          <TextField
            label="Obligations (Rs)"
            name="obligations"
            type="text"
            onKeyDown={handleKeyDown}
            fullWidth
            value={formData.obligations}
            onChange={handleChange}
          />
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Initial Loan To Salary Ratio (%)"
            name="salaryToIncomeRatio"
            fullWidth
            value={calculatesalaryToIncomeRatio(formData.netSalary)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
            required
          />
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="ROI (%)"
            name="roi"
            type="string"
            fullWidth
            value={formData.roi}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
            required
          />
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Processing Fee % Inc. Gst"
            name="adminFeePercentage"
            type="string"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.adminFeePercentage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
            required
          />
        </Box>

      {/* Sixth Row (4 items) */}
      
        <Box flex="1 1 46%">
          <TextField
            label="Eligible Loan"
            name="eligibleLoan"
            type="text"
            fullWidth
            value={formData.eligibleLoan}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>

        <Box flex="1 1 46%">
          <TextField
            label="Loan Applied"
            name="appliedLoan"
            type="text"
            fullWidth
            value={formData.loanAmount}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            // required
          />
        </Box>

        <Box flex="1 1 46%">
          <TextField
            label="Loan Recommended"
            name="loanRecommended"
            type="text"
            fullWidth
            value={formData.loanRecommended}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
          {loanRecommendedError && (
            <FormHelperText error>
              {loanRecommendedError}
            </FormHelperText>
          )}
        </Box>

      {/* Seventh Row (4 items) */}
      
        <Box flex="1 1 46%">
          <TextField
            label="Sanction Loan To Salary Ratio (%)"
            name="finalSalaryToIncomeRatioPercentage"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.finalSalaryToIncomeRatioPercentage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Net Disbursal Amount"
            name="netDisbursalAmount"
            type="text"
            fullWidth
            value={formData.netDisbursalAmount}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>  
      {/* Eighth Row (4 items) */}
      <Box flex="1 1 46%">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <DatePicker
            label="Disbursal Date"
            sx={{
              '& .MuiSvgIcon-root':{
                fill: colors.black[100],
              },
            }}
            value={formData.disbursalDate ? dayjs(formData.disbursalDate) : null}
            onChange={(newValue) => {
              handleChange({
                target: {
                  name: 'disbursalDate',
                  value: newValue ? newValue.toISOString() : '',
                },
              });
            }}
            slotProps={{
              textField: { format: "DD/MM/YYYY" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  ...params.inputProps,
                  min: today,
                  max: formData.repaymentDate || undefined,
                }}
              />
            )}
            minDate={dayjs(today)}
            maxDate={formData.repaymentDate ? dayjs(formData.repaymentDate) : null}
          />
        </LocalizationProvider>
      </Box>
        
        <Box flex="1 1 46%">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DatePicker
              label="Repayment Date"
              sx={{
                '& .MuiSvgIcon-root':{
                  fill: colors.black[100],
                },
              }}
              value={formData.repaymentDate ? dayjs(formData.repaymentDate) : null}
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: 'repyamentDate',
                    value: newValue ? newValue.toISOString() : '',
                  },
                });
              }}
              slotProps={{
                textField: { format: "DD/MM/YYYY" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box flex="1 1 46%">
          <TextField
            label="Eligible Tenure (days)"
            name="eligibleTenure"
            type="text"
            fullWidth
            value={formData.eligibleTenure}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>

      {/* Ninth Row (4 items) */}
      
        <Box flex="1 1 46%">
          <TextField
            label="Processing Fee"
            name="netAdminFeeAmount"
            type="text"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.netAdminFeeAmount}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>
        <Box flex="1 1 46%">
          <TextField
            label="Repayment Amount"
            name="repaymentAmount"
            type="text"
            fullWidth
            value={calculateRepayment(formData.loanRecommended)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Box>

      {/* Tenth Row (4 items) */}
      
        <Box flex="1 1 100%">
          <TextField
            label="Remarks"
            name="remarks"
            type="text"
            fullWidth
            height="20"
            value={formData.remarks}
            onChange={handleChange}
            required
            inputProps={{
              minLength: 30 // Set a character limit as a fallback
            }}
          />
        </Box>
      </Box>
      {isError &&
        <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
          {error?.data?.message}
        </Alert>
      }

      <Typography variant='h6' style={{color:colors.grey[300], fontStyle:"italic"}}>( * ) Mandatory Fields are Required</Typography>

      {/* Save and Cancel Buttons */}
      <Box display="flex" justifyContent="flex-start" gap="10px">
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          onclick={handleSubmit}
          sx={{
            backgroundColor: isLoading ? '#ccc' : colors.white[100],
            color: isLoading ? '#666' : colors.primary[400],
            border: `2px solid ${colors.primary[400]}`,
            borderRadius: '0px 10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            '&:hover': {
              backgroundColor: isLoading ? '#ccc' : colors.primary[400],
              color: isLoading ? '#ccc' : colors.white[100],
            },
          }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save CAM'}
        </Button>
        <Button
          variant="contained"
          onClick={handleCancel}
          sx={{
            background: colors.white[100],
            color: colors.redAccent[500],
            border: `2px solid ${colors.redAccent[500]}`,
            borderRadius: '0px 10px',
            ':hover': {
              color: colors.white[100],
              backgroundColor: colors.redAccent[500],
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditCam;

// import React, { useState, useEffect } from 'react';
// import { tokens } from '../../theme';
// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   FormControl,
//   FormHelperText,
//   InputAdornment,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   useTheme,
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import moment from 'moment';
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { camSchema } from "../../utils/validations";
// import { useUpdateCamDetailsMutation } from '../../Service/applicationQueries';
// import Swal from 'sweetalert2';
// import { useParams } from 'react-router-dom';

// const EditCam = ({ camData, setIsEditing }) => {
//   const { id } = useParams();

//   const [formData, setFormData] = useState(camData);
//   const [errorMessage, setErrorMessage] = useState({
//     recommendedLoanError: null,
//   });
//   const [loanRecommendedError, setLoanRecommendedError] = useState(null);


//   console.log(camData)
//   const today = new Date().toISOString().split('T')[0];

//   // Color theme
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [updateCamDetails, { data, isLoading, isSuccess, isError, error }] = useUpdateCamDetailsMutation();

//   const defaultValue = {
//     leadNo: '',                // Lead ID
//     salaryDate1: '',           // Salary Date 1
//     salaryAmount1: '',         // Salary Amount 1
//     salaryDate2: '',           // Salary Date 2
//     salaryAmount2: '',         // Salary Amount 2
//     salaryDate3: '',           // Salary Date 3
//     salaryAmount3: '',         // Salary Amount 3
//     nextPayDate: '',           // Next Salary Date
//     averageSalary: '',         // Median Salary Amount
//     customerType: '',          // Customer Type
//     dedupeCheck: '',           // Dedupe Check
//     actualNetSalary: '',       // Net Salary
//     creditBureauScore: '',     // Credit Bureau Score
//     obligations: '',           // Obligations (Rs)
//     salaryToIncomeRatio: '',   // Salary To Income Ratio
//     eligibleLoan: '',          // Loan Amount
//     loanRecommended: '',       // Loan Recommended
//     disbursalDate: '',         // Disbursal Date
//     repaymentDate: '',         // Repayment Date
//     adminFeePercentage: '',    // Admin Fee Inc. GST (%)
//     roi: '',                   // ROI (Rate of Interest)
//     netAdminFeeAmount: '',     // Net Admin Fee Amount
//     eligibleTenure: '',        // Eligible Tenure
//     repaymentAmount: '',       // Repayment Amount
//     remarks: '', 
//   }

//   const { handleSubmit, control, setValue, getValues, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
//       defaultValues: defaultValue,
//       resolver: yupResolver(camSchema),
//     });

//   const calculateDaysDifference = (disbursalDate, repaymentDate) => {
//     if (!disbursalDate && !repaymentDate) {
//       return 0;
//     }
//     const startDate = new Date(disbursalDate);
//     const endDate = new Date(repaymentDate);
//     const timeDiff = endDate - startDate;
//     const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//     return daysDiff;
//   };

//   const calculateRepayment = (amount) => {
//     const repayAmount = Number(amount) ? Number(amount) + (Number(amount) * Number(formData.eligibleTenure) * Number(formData?.roi) / 100) : 0;
//     return repayAmount;
//   };

//   const calculatePF = (loanRecommended, pfPercent) => {
//     const processingFee = Number(loanRecommended) ? (Number(loanRecommended) * Number(pfPercent) / 100) : 0;
//     return processingFee;
//   };

//   const validateSanctionAmount = (loan) => {
//     if (loan > 100000) {
//       setErrorMessage((prev) => ({
//         ...prev,
//         recommendedLoanError: "Amount mustn't be greater than 100000",
//       }));
//       return false;
//     } else {
//       setErrorMessage((prev) => ({ ...prev, recommendedLoanError: null }));
//       return true;
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (
//         e.key.length === 1 &&
//         !(e.key >= "0" && e.key <= "9") &&
//         e.key !== "."
//     ) {
//         e.preventDefault();
//     }
//     if (e.key === "." && e.target.value.includes(".")) {
//         e.preventDefault();
//     }
//   };

//   // console.log(formData)
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prevFormData) => {
//       const updatedFormData = {
//         ...prevFormData,
//         [name]: value,
//       };

//       if (name === 'adminFeePercentage') {
//         updatedFormData.netAdminFeeAmount = calculatePF(updatedFormData.loanRecommended, updatedFormData.adminFeePercentage);
//       }

//       if (name === 'loanRecommended' || name === 'adminFeePercentage') {
//         const recommendedLoan = Number(updatedFormData?.loanRecommended);
//         if (!validateSanctionAmount(recommendedLoan)) return prevFormData;
//         const finalSalaryToIncomeRatioPercentage = prevFormData.actualNetSalary
//           ? (recommendedLoan / prevFormData.actualNetSalary) * 100
//           : 0;
//         updatedFormData.finalSalaryToIncomeRatioPercentage = `${finalSalaryToIncomeRatioPercentage.toFixed()}`;
//         updatedFormData.netAdminFeeAmount = calculatePF(updatedFormData.loanRecommended, updatedFormData.adminFeePercentage);
//         updatedFormData.netDisbursalAmount = recommendedLoan - updatedFormData?.netAdminFeeAmount;
//         updatedFormData.repaymentAmount = calculateRepayment(recommendedLoan);
//       }

//       if (name === 'repaymentDate' || name === 'disbursalDate') {
        
//         const eligibleTenure = calculateDaysDifference(updatedFormData.disbursalDate, updatedFormData.nextPayDate);
//         updatedFormData.eligibleTenure = eligibleTenure + 1 || 0;

//         const roiDecimal = Number(updatedFormData?.roi) / 100;
//         const loanRecommended = Number(updatedFormData.loanRecommended);
//         updatedFormData.repaymentAmount = loanRecommended
//           ? loanRecommended + (loanRecommended * roiDecimal * (eligibleTenure + 1))
//           : 0;
//       }

//       // Check if loan recommended is greater than loan applied
//       if (name === 'loanRecommended') {
//         const loanRecommended = Number(value);
//         const loanApplied = Number(updatedFormData.loanAmount); // Assuming loanAmount is the field for Loan Applied

//         if (loanRecommended > loanApplied) {
//           setLoanRecommendedError("Loan Recommended cannot be greater than Loan Applied.");
//         } else {
//           setLoanRecommendedError(null); // Clear the error if validation passes
//         }
//       }

//       if (name === 'nextPayDate') {
//         updatedFormData.repaymentDate = value;
//       }

//       return updatedFormData;
//     });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     const isValidDate = (date) => {
//       return !isNaN(Date.parse(date));
//     };

//     if (formData.actualNetSalary > 0 && isValidDate(formData.disbursalDate) && isValidDate(formData.repaymentDate)) {
//       updateCamDetails({
//         id: id,
//         updates: formData
//       });
//     } else {
//       setErrorMessage("Please fill out all the required fields.");
//       console.warn("Validation failed. Required fields missing.");
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setFormData({});
//   };

//   const calculatesalaryToIncomeRatio = (salary) => {
//     if (salary < 25000) {
//       return '0';
//     } else if (salary >= 25000 && salary < 35000) {
//       return '35';
//     } else if (salary >= 35000 && salary < 50000) {
//       return '40';
//     } else {
//       return '40';
//     }
//   };

//   const calculateEligibleLoan = (salary, salaryToIncomeRatioPercentage,) => {
//     const salaryToIncomeRatioDecimal = parseFloat(salaryToIncomeRatioPercentage) / 100;
//     return salary * salaryToIncomeRatioDecimal;
//   };

//   useEffect(() => {
//     const salaryToIncomeRatioPercentage = calculatesalaryToIncomeRatio(formData.actualNetSalary);
//     const eligibleLoan = calculateEligibleLoan(formData.actualNetSalary, salaryToIncomeRatioPercentage, formData.loanAmount);
//     if (formData.actualNetSalary > 25000) {
//       setFormData((prevData) => ({
//         ...prevData,
//         customerCategory: 'CAT - B'
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         customerCategory: ''
//       }));
//     }
//     setFormData((prevData) => ({
//       ...prevData,
//       salaryToIncomeRatio: salaryToIncomeRatioPercentage,
//       eligibleLoan: eligibleLoan,
//     }));
//   }, [formData.actualNetSalary, formData.loanAmount]);

//   const meanSalary = (sal1, sal2, sal3) => {
//     return (sal1 + sal2 + sal3) / 3;
//   };

//   useEffect(() => {
//     const avgSal = meanSalary(
//       Number(formData.salaryAmount1),
//       Number(formData.salaryAmount2),
//       Number(formData.salaryAmount3)
//     ).toFixed(2);

//     setFormData((prevData) => ({
//       ...prevData,
//       averageSalary: avgSal || 0,
//     }));
//   }, [formData.salaryAmount1, formData.salaryAmount2, formData.salaryAmount3]);

//   useEffect(() => {
//     const calculateFOIR = (netSalary, obligations) => {
//       const foir = netSalary > 0 ? ((netSalary - obligations) / netSalary) * 100 : 0;
//       return `${foir.toFixed(2)}%`;
//     };

//     setFormData((prevData) => ({
//       ...prevData,
//       eligiblesalaryToIncomeRatioPercentage: calculateFOIR(prevData.actualNetSalary, prevData.obligations),
//     }));
//   }, [formData.actualNetSalary, formData.obligations]);

//   useEffect(() => {
//     if (isSuccess && data) {
//       Swal.fire({
//         text: "Cam Updated Successfully!",
//         icon: "success"
//       });
//       setIsEditing(false);
//       setErrorMessage("");
//     }
//   }, [isSuccess, data]);

//   return (
//     <Box
//       novalidate
//       component="form"
//       onSubmit={handleSave}
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '16px',
//         boxShadow: "0px 0px 20px rgb(0,0,0,0.2)",
//         padding: '30px',
//         borderRadius: '0px 20px',
//         color: colors.black[100],
//         background:colors.white[100],
//         '& .MuiOutlinedInput-root':{
//           color:colors.black[100],
//         },
//         '& .MuiFormLabel-root':{
//           color:colors.black[100]
//         },
//         '& .MuiOutlinedInput-notchedOutline':{
//           borderColor:colors.primary[400],
//         },
//         '& .MuiTypography-root':{
//           color:colors.black[100],
//         },
//         '& .Mui-readOnly':{
//           background:colors.grey[100],
//         },
//       }}
//     >
//       {/* First Row (4 items) */}
//       <Box display="flex" flexWrap="wrap" gap="16px">
//         <Box flex="1 1 46%">
//           <TextField
//             label="Lead No"
//             name="leadNo"
//             type="string"
//             fullWidth
//             value={formData.leadNo}
//             onChange={handleChange}
//             InputProps={{
//               readOnly: true,
//             }}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Credit Bureau Score"
//             name="creditBureauScore"
//             fullWidth
//             value={formData.creditBureauScore}
//             onChange={handleChange}
//             InputProps={{
//               readOnly: true,
//             }}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Salary Date 1"
//             name="salaryDate1"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             inputProps={{ max: today }}
//             fullWidth
//             // value={formData.salaryDate1}
//             value={formData.salaryDate1 ? moment(formData.salaryDate1).format('YYYY-MM-DD') : ''}
//             onChange={handleChange}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Salary Amount 1"
//             name="salaryAmount1"
//             type="text"
//             onKeyDown={handleKeyDown}
//             fullWidth
//             value={formData.salaryAmount1}
//             onChange={handleChange}
//           />
//         </Box>
      

//       {/* Second Row (4 items) */}
      
//         <Box flex="1 1 46%">
//           <TextField
//             label="Salary Date 2"
//             name="salaryDate2"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             inputProps={{ max: today }}
//             fullWidth
//             // value={formData.salaryDate2}
//             value={formData.salaryDate2 ? moment(formData.salaryDate2).format('YYYY-MM-DD') : ''}
//             onChange={handleChange}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Salary Amount 2"
//             name="salaryAmount2"
//             type="text"
//             onKeyDown={handleKeyDown}
//             fullWidth
//             value={formData.salaryAmount2}
//             onChange={handleChange}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Salary Date 3"
//             name="salaryDate3"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             inputProps={{ max: today }}
//             fullWidth
//             // value={formData.salaryDate3}
//             value={formData.salaryDate3 ? moment(formData.salaryDate3).format('YYYY-MM-DD') : ''}
//             placeholder="DD/MM/YYYY"
//             onChange={handleChange}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Salary Amount 3"
//             name="salaryAmount3"
//             type="text"
//             onKeyDown={handleKeyDown}
//             fullWidth
//             value={formData.salaryAmount3}
//             onChange={handleChange}
//           />
//         </Box>

//       {/* Third Row (4 items) */}
     
//         <Box flex="1 1 46%">
//           <TextField
//             label="Next Salary Date"
//             name="nextPayDate"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             inputProps={{ min: today }}
//             fullWidth
//             value={formData.nextPayDate ? moment(formData.nextPayDate).format('YYYY-MM-DD') : ''}
//             onChange={handleChange}
//             required
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Average Salary"
//             name="averageSalary"
//             type="text"
//             onKeyDown={handleKeyDown}
//             fullWidth
//             value={formData.averageSalary}
//             onChange={handleChange}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Net Salary"
//             name="actualNetSalary"
//             type="text"
//             onKeyDown={handleKeyDown}
//             fullWidth
//             value={formData.actualNetSalary}
//             onChange={handleChange}
//             required
//           />
//         </Box>

//       {/* Fourth Row (4 items) */}
      
//         <Box flex="1 1 46%">
//           <TextField
//             label="Customer Type"
//             name="customerType"
//             fullWidth
//             value={formData.customerType}
//             onChange={handleChange}
//             InputProps={{
//               readOnly:true
//             }}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <FormControl
//             fullWidth
//             sx={{
//               '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
//               '& .MuiInputLabel-root': { color: colors.black[100] },
//               '& .MuiSelect-select': { color: colors.black[100] },
//               '& .MuiSelect-icon': { color: colors.black[100] },
//               '&:hover': {
//                 '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
//               }
//             }}
//           >
//             <InputLabel id="dedupe-check-label" style={{ color: colors.black[100] }}>Dedupe Check *</InputLabel>
//             <Select
//               labelId="dedupe-check-label"
//               label="Dedupe Check"
//               name="dedupeCheck"
//               value={formData.dedupeCheck}
//               onChange={handleChange}
//             >
//               <MenuItem value="" disabled>Select Dedupe Check</MenuItem>
//               <MenuItem value="Yes">Yes</MenuItem>
//               <MenuItem value="No">No</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Customer Category"
//             name="customerCategory"
//             fullWidth
//             value={formData.customerCategory}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//             InputProps={{
//               readOnly:true
//             }}
//           />
//         </Box>

//       {/* Fifth Row (4 items) */}
      
//         <Box flex="1 1 46%">
//           <TextField
//             label="Obligations (Rs)"
//             name="obligations"
//             type="text"
//             onKeyDown={handleKeyDown}
//             fullWidth
//             value={formData.obligations}
//             onChange={handleChange}
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Initial Loan To Salary Ratio (%)"
//             name="salaryToIncomeRatio"
//             fullWidth
//             value={calculatesalaryToIncomeRatio(formData.netSalary)}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
//                     %
//                   </InputAdornment>
//                 ),
//               },
//             }}
//             required
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="ROI (%)"
//             name="roi"
//             type="string"
//             fullWidth
//             value={formData.roi}
//             InputLabelProps={{ shrink: true }}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
//                     %
//                   </InputAdornment>
//                 ),
//               },
//             }}
//             required
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Processing Fee % Inc. Gst"
//             name="adminFeePercentage"
//             type="string"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={formData.adminFeePercentage}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
//                     %
//                   </InputAdornment>
//                 ),
//               },
//             }}
//             required
//           />
//         </Box>

//       {/* Sixth Row (4 items) */}
      
//         <Box flex="1 1 46%">
//           <TextField
//             label="Eligible Loan"
//             name="eligibleLoan"
//             type="text"
//             fullWidth
//             value={formData.eligibleLoan}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             required
//           />
//         </Box>

//         <Box flex="1 1 46%">
//           <TextField
//             label="Loan Applied"
//             name="appliedLoan"
//             type="text"
//             fullWidth
//             value={formData.loanAmount}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             // required
//           />
//         </Box>

//         <Box flex="1 1 46%">
//           <TextField
//             label="Loan Recommended"
//             name="loanRecommended"
//             type="text"
//             fullWidth
//             value={formData.loanRecommended}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             required
//           />
//           {loanRecommendedError && (
//             <FormHelperText error>
//               {loanRecommendedError}
//             </FormHelperText>
//           )}
//         </Box>

//       {/* Seventh Row (4 items) */}
      
//         <Box flex="1 1 46%">
//           <TextField
//             label="Sanction Loan To Salary Ratio (%)"
//             name="finalSalaryToIncomeRatioPercentage"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={formData.finalSalaryToIncomeRatioPercentage}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             slotProps={{
//               input: {
//                 endAdornment: (
//                   <InputAdornment position="end" style={{position:"absolute", marginLeft: '50px', }}>
//                     %
//                   </InputAdornment>
//                 ),
//               },
//             }}
//             InputProps={{
//               readOnly: true,
//             }}
//             required
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Net Disbursal Amount"
//             name="netDisbursalAmount"
//             type="text"
//             fullWidth
//             value={formData.netDisbursalAmount}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//         </Box>  
//       {/* Eighth Row (4 items) */}
//         <Box flex="1 1 46%">
//           <TextField
//             label="Disbursal Date"
//             name="disbursalDate"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//             // value={formData.disbursalDate}
//             value={formData.disbursalDate ? moment(formData.disbursalDate).format('YYYY-MM-DD') : ''}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             inputProps={{
//               max: formData.nextPayDate,
//               min: today
//             }}
//             required
//           />
//         </Box>

//         <Box flex="1 1 46%">
//           <TextField
//             label="Repayment Date"
//             name="repaymentDate"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             fullWidth
//             value={formData.repaymentDate ? moment(formData.repaymentDate).format('YYYY-MM-DD') : ''}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             required
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Eligible Tenure"
//             name="eligibleTenure"
//             type="text"
//             fullWidth
//             value={formData.eligibleTenure}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             required
//           />
//         </Box>

//       {/* Ninth Row (4 items) */}
      
//         <Box flex="1 1 46%">
//           <TextField
//             label="Processing Fee"
//             name="netAdminFeeAmount"
//             type="text"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={formData.netAdminFeeAmount}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             required
//           />
//         </Box>
//         <Box flex="1 1 46%">
//           <TextField
//             label="Repayment Amount"
//             name="repaymentAmount"
//             type="text"
//             fullWidth
//             value={calculateRepayment(formData.loanRecommended)}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               readOnly: true,
//             }}
//             required
//           />
//         </Box>

//       {/* Tenth Row (4 items) */}
      
//         <Box flex="1 1 100%">
//           <TextField
//             label="Remarks"
//             name="remarks"
//             type="text"
//             fullWidth
//             height="20"
//             value={formData.remarks}
//             onChange={handleChange}
//             required
//             inputProps={{
//               minLength: 30 // Set a character limit as a fallback
//             }}
//           />
//         </Box>
//       </Box>
//       {isError &&
//         <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
//           {error?.data?.message}
//         </Alert>
//       }

//       <Typography variant='h6' style={{color:colors.grey[300], fontStyle:"italic"}}>( * ) Mandatory Fields are Required</Typography>

//       {/* Save and Cancel Buttons */}
//       <Box display="flex" justifyContent="flex-start" gap="10px">
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={isLoading}
//           onclick={handleSubmit}
//           sx={{
//             backgroundColor: isLoading ? '#ccc' : colors.white[100],
//             color: isLoading ? '#666' : colors.primary[400],
//             border: `2px solid ${colors.primary[400]}`,
//             borderRadius: '0px 10px',
//             cursor: isLoading ? 'not-allowed' : 'pointer',
//             '&:hover': {
//               backgroundColor: isLoading ? '#ccc' : colors.primary[400],
//               color: isLoading ? '#ccc' : colors.white[100],
//             },
//           }}
//         >
//           {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save CAM'}
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleCancel}
//           sx={{
//             background: colors.white[100],
//             color: colors.redAccent[500],
//             border: `2px solid ${colors.redAccent[500]}`,
//             borderRadius: '0px 10px',
//             ':hover': {
//               color: colors.white[100],
//               backgroundColor: colors.redAccent[500],
//             },
//           }}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default EditCam;