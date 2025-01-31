import React, { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useUpdateCamDetailsMutation } from '../../Service/applicationQueries';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const EditCam = ({ camData, setIsEditing }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState(camData);
  const [errorMessage, setErrorMessage] = useState({
    recommendedLoanError: null,
  });

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [updateCamDetails, { data, isLoading, isSuccess, isError, error }] = useUpdateCamDetailsMutation();

  const calculateDaysDifference = (disbursalDate, repaymentDate) => {


    if (!disbursalDate && !repaymentDate) {
      return 0;
    }
    // Convert the string dates to Date objects
    const startDate = new Date(disbursalDate);
    const endDate = new Date(repaymentDate);

    // Get the time difference in milliseconds
    const timeDiff = endDate - startDate;

    // Convert time difference from milliseconds to days (1000ms * 60s * 60m * 24h)
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff;
  };
  const calculateRepayment = (amount) => {
    const repayAmount = Number(amount) ? Number(amount) + (Number(amount) * Number(formData.eligibleTenure) * Number(formData?.roi) / 100) : 0
    return repayAmount

  }
  const calculatePF = (loanRecommended, pfPercent) => {
    const processingFee = Number(loanRecommended) ? (Number(loanRecommended) * Number(pfPercent) / 100) : 0
    return processingFee

  }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update form data with the new value

    console.log('name',name,value,formData)
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData, // Start by copying the previous formData state
        [name]: value,   // Update the field that triggered the change event
      };

      if (name === 'adminFeePercentage') {
        updatedFormData.netAdminFeeAmount = calculatePF(updatedFormData.loanRecommended, updatedFormData.adminFeePercentage);

      }

      // Handle loan recommendation logic
      if (name === 'loanRecommended' || name === 'adminFeePercentage') {
        const recommendedLoan = Number(updatedFormData?.loanRecommended);
        if (!validateSanctionAmount(recommendedLoan)) return prevFormData
        const finalSalaryToIncomeRatioPercentage = prevFormData.actualNetSalary
          ? (recommendedLoan / prevFormData.actualNetSalary) * 100
          : 0;
        // Add calculated fields to updatedFormData
        updatedFormData.finalSalaryToIncomeRatioPercentage = `${finalSalaryToIncomeRatioPercentage.toFixed()}`;
        updatedFormData.netAdminFeeAmount = calculatePF(updatedFormData.loanRecommended, updatedFormData.adminFeePercentage);
        updatedFormData.netDisbursalAmount = recommendedLoan - updatedFormData?.netAdminFeeAmount;
        updatedFormData.repaymentAmount = calculateRepayment(recommendedLoan)
      }
      // Handle repayment date change and calculate repayment amount
      if (name === 'repaymentDate' || name === 'disbursalDate') {

        const eligibleTenure = calculateDaysDifference(updatedFormData.disbursalDate, updatedFormData.repaymentDate);
        updatedFormData.eligibleTenure = eligibleTenure + 1 || 0;

        // Convert ROI to decimal
        const roiDecimal = Number(updatedFormData?.roi) / 100;
        // ro
        // Calculate repaymentAmount using the correct formula
        const loanRecommended = Number(updatedFormData.loanRecommended);
        updatedFormData.repaymentAmount = loanRecommended
          ? loanRecommended + (loanRecommended * roiDecimal * (eligibleTenure + 1))
          : 0;
      }

      // Return the updated form data
      return updatedFormData;
    });
  };

  console.log('form data',formData)
  const handleSave = async (e) => {
    e.preventDefault();

    // Utility function to validate if the input is a valid date
    const isValidDate = (date) => {
      return !isNaN(Date.parse(date)); // Returns true if valid, false if invalid
    };

    // Validation checks
    if (formData.actualNetSalary > 0 && isValidDate(formData.disbursalDate) && isValidDate(formData.repaymentDate)) {
      updateCamDetails({
        id: id, // ID of the CAM (assuming this is passed as a prop)
        updates: formData // The updated data from the form
      });
      // try {


      //     // if (response?.success) {
      //     //     Swal.fire({
      //     //         text: "Cam Updated Successfuly!",
      //     //         icon: "success"
      //     //     });
      //     //     setIsEditing(false); // Stop editing after successful update
      //     //     setErrorMessage(""); // Clear any error message
      //     // } else {
      //     //     setErrorMessage("Failed to update the data. Please try again.");
      //     // }
      // } catch (error) {
      //     console.error("Error updating CAM details:", error);
      //     setErrorMessage("An error occurred while updating the data.");
      // }

    } else {
      setErrorMessage("Please fill out all the required fields.");
      console.warn("Validation failed. Required fields missing.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({})
  };



  // Function to calculate the salaryToIncomeRatio percentage based on the actual net salary
  const calculatesalaryToIncomeRatio = (salary) => {
    if (salary < 25000) {
      return '0';
    } else if (salary >= 25000 && salary < 35000) {
      return '35';
    } else if (salary >= 35000 && salary < 50000) {
      return '40';
    } else {
      return '45';
    }
  };

  // Function to calculate the eligible loan based on the actual net salary and salaryToIncomeRatio
  const calculateEligibleLoan = (salary, salaryToIncomeRatioPercentage) => {
    const salaryToIncomeRatioDecimal = parseFloat(salaryToIncomeRatioPercentage) / 100;
    return salary * salaryToIncomeRatioDecimal;
  };

  // UseEffect to calculate salaryToIncomeRatio whenever the actualNetSalary changes
  useEffect(() => {
    const salaryToIncomeRatioPercentage = calculatesalaryToIncomeRatio(formData.actualNetSalary);
    const eligibleLoan = calculateEligibleLoan(formData.actualNetSalary, salaryToIncomeRatioPercentage);
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
  }, [formData.actualNetSalary]);

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
      averageSalary: avgSal || 0,  // Ensure default value is set if avgSal is NaN
    }));
  }, [formData.salaryAmount1, formData.salaryAmount2, formData.salaryAmount3]);

  useEffect(() => {
    const calculateFOIR = (netSalary, obligations) => {
      const foir = netSalary > 0 ? ((netSalary - obligations) / netSalary) * 100 : 0;
      return `${foir.toFixed(2)}%`;
    };

    // Update the form data with the calculated FOIR
    setFormData((prevData) => ({
      ...prevData,
      eligiblesalaryToIncomeRatioPercentage: calculateFOIR(prevData.actualNetSalary, prevData.obligations),
    }));

  }, [formData.actualNetSalary, formData.obligations]);


  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        text: "Cam Updated Successfuly!",
        icon: "success"
      });
      setIsEditing(false); // Stop editing after successful update
      setErrorMessage("");
    }
  }, [isSuccess, data])



  return (
    <Box
      component="form"
      onSubmit={handleSave}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: "0px 0px 20px rgb(0,0,0,0.2)",
        padding: '30px',
        borderRadius: '0px 20px',
        color: colors.black[100],
        '& .MuiTextField-root': {
          color: colors.black[100],
          '& .MuiInputBase-input': {
            color: colors.black[100],
          },
          '& .MuiSelect-select': {
            color: colors.black[100],
          },
          '& .MuiInputLabel-root': {
            color: colors.black[100],
          },
          '& .MuiFormHelperText-root': {
            color: colors.black[100],
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[100],
          },
          '& .Mui-disabled': {
            color: `${colors.black[100]} !important`,
            borderColor: colors.black[100],
            opacity: "1 !important",
          },
          '& .MuiInputBase-input .Mui-disabled': {
            color: colors.black[100], // Add this line to make the disabled input text visible
            opacity: 1,
          },
        }
      }}
    >
      <Grid container spacing={2}>
        {/* First Row (4 items) */}
        <Grid item xs={12} sm={6} md={12}>
          <TextField
            label="Lead ID"
            name="leadId"
            type="string"
            fullWidth
            value={formData.leadId}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Salary Date 1"
            name="salaryDate1"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.salaryDate1}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Salary Amount 1"
            name="salaryAmount1"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.salaryAmount1}
            onChange={handleChange}
          />
        </Grid>

        {/* Second Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Salary Date 2"
            name="salaryDate2"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.salaryDate2}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Salary Amount 2"
            name="salaryAmount2"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.salaryAmount2}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Salary Date 3"
            name="salaryDate3"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.salaryDate3}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Salary Amount 3"
            name="salaryAmount3"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.salaryAmount3}
            onChange={handleChange}
          />
        </Grid>

        {/* Third Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Next Salary Date"
            name="nextPayDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.nextPayDate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Average Salary"
            name="averageSalary"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.averageSalary}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Net Salary"
            name="actualNetSalary"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.actualNetSalary}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>

        {/* Fourth Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Customer Type"
            name="customerType"
            fullWidth
            value={formData.customerType}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
            <InputLabel id="dedupe-check-label" style={{ color: colors.black[100] }}>Dedupe Check</InputLabel>
            <Select
              labelId="dedupe-check-label"
              label="Dedupe Check"
              name="dedupeCheck"
              value={formData.dedupeCheck}
              onChange={handleChange}
            >
              <MenuItem value="">Select Dedupe Check</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Customer Category"
            name="customerCategory"
            fullWidth
            value={formData.customerCategory}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Grid>

        {/* Fifth Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Obligations (Rs)"
            name="obligations"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.obligations}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Initial salary To Income Ratio (%)"
            name="salaryToIncomeRatio"
            fullWidth
            value={calculatesalaryToIncomeRatio(formData.netSalary)}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{ marginLeft: '-230px', }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="ROI (%)"
            name="roi"
            type="string"
            fullWidth
            value={formData.roi}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ color: colors.black[100] }} style={{ marginLeft: '-230px', }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Processing Fee % Inc. Gst"
            name="adminFeePercentage"
            type="string"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.adminFeePercentage}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{ marginLeft: '-230px' }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        {/* Sixth Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Eligible Loan"
            name="eligibleLoan"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.eligibleLoan}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Loan Recommended"
            name="loanRecommended"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.loanRecommended}
            onChange={handleChange}
          />
          {errorMessage.recommendedLoanError && (
            <FormHelperText error>
              {errorMessage.recommendedLoanError}
            </FormHelperText>
          )}
        </Grid>

        {/* Seventh Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Final salary To Income Ratio (%)"
            name="finalSalaryToIncomeRatioPercentage"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.finalSalaryToIncomeRatioPercentage}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" style={{ marginLeft: '-230px' }}>
                    %
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Net Disbursal Amount"
            name="netDisbursalAmount"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.netDisbursalAmount}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Eighth Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Disbursal Date"
            name="disbursalDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.disbursalDate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Repayment Date"
            name="repaymentDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.repaymentDate}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Eligible Tenure"
            name="eligibleTenure"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={formData.eligibleTenure}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        {/* Ninth Row (4 items) */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Processing Fee"
            name="netAdminFeeAmount"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.netAdminFeeAmount}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Repayment Amount"
            name="repaymentAmount"
            inputProps={{
              type: 'text',
              pattern: '[0-9]*',
              inputMode: 'numeric',
            }}
            fullWidth
            value={calculateRepayment(formData.loanRecommended)}
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        {/* Tenth Row (4 items) */}
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            label="Remarks"
            name="camRemarks"
            type="text"
            fullWidth
            height="20"
            value={formData.camRemarks}
            onChange={handleChange}
          />
        </Grid>
        {isError &&
          <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
            {error?.data?.message}
          </Alert>
        }

        {/* Save and Cancel Buttons */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            type="submit"
            disabled={isLoading}
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
            variant="outlined"
            onClick={handleCancel}
            style={{ marginLeft: '10px' }}
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
        </Grid>
      </Grid>

    </Box>
  );
};

export default EditCam;