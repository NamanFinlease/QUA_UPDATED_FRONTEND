import React, { useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  OutlinedInput,
  Box,
  useTheme,
  Alert,
  CircularProgress,
} from '@mui/material';
import { tokens } from '../theme';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateLeadMutation } from '../Service/Query';
import { formatDate } from '../utils/helper';
import useAuthStore from './store/authStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { leadUpdateSchema } from '../utils/validations';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Swal from "sweetalert2";


const LeadDetails = ({ leadData, setLeadEdit }) => {
  const { id } = useParams();
  const [updateLead, { data, isSuccess, isLoading, isError, error }] = useUpdateLeadMutation();

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(leadUpdateSchema),
    defaultValues: leadData,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const handleDate = (date) => {
    
    setValue("dob",dayjs(date).format("YYYY/MM/DD"))
  };

  useEffect(() => {
    if (leadData && Object.keys(leadData).length > 0) {
      Object.keys(leadData).forEach((key) => {
        setValue(key, leadData[key]);
      });
    }
  }, [leadData, setValue]);

  const onSubmit = (formData) => {
    
    updateLead({ id, formData });
  };

  useEffect(() => {
    if (isSuccess && data ) {
      Swal.fire({
        text: "Lead details edited successfully!",
        icon: "success",
      });
      setLeadEdit(false);
    }
  }, [isSuccess, data])

  console.log('loading',isLoading)

  return (
    <Box sx={{ padding: '0px 20px', backgroundColor: colors.white[100], minHeight: '100vh' }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ padding: "10px 20px", fontWeight: 'bold', color: colors.primary[400] }}>
        Edit Lead Details
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: colors.white[100],
          color: colors.white[100],
          padding: '30px',
          marginBottom: "20px",
          borderRadius: '0px 30px',
          border: `2px solid ${colors.primary[400]}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          '& .MuiInputLabel-root': {
            color: colors.primary[400],
          },
          '& .MuiOutlinedInput-root': {
            color: colors.black[100],
            '& fieldset': { borderColor: colors.primary[400], borderRadius: "0px 10px", },
            '&:hover fieldset': { borderColor: colors.primary[400] },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black[100]
          },
        }}
      >
        <Box
          sx={{ flex: '1 1 45%', }}
        >
          <Controller
            name="fName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="First Name"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="mName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Middle Name"
                variant="outlined"
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="lName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Last Name"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl
                variant="outlined"
                fullWidth
                required
                error={!!fieldState.error}
              >
                <InputLabel htmlFor="gender-select">
                  Gender
                </InputLabel>
                <Select
                  {...field}
                  input={
                    <OutlinedInput
                      label="Gender"
                      id="gender-select"
                    />
                  }
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ flex: '1 1 45%', width: '100%', }} fullWidth> {/* Ensure the box takes full width */}
            <Controller
              name="dob"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  label="Date of Birth"
                  sx={{
                    width: "100%",
                    '& .MuiButtonBase-root': {
                      color: colors.black[100]
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : ''}
                    />
                  )}
                  value={field.value ? dayjs(field.value) : null}
                  slotProps={{
                    textField: { format: "DD/MM/YYYY" },
                  }}
                  onChange={date => setValue("dob",dayjs(date).format("YYYY/MM/DD"))}
                />
              )}
            />
          </Box>
        </LocalizationProvider>



        <Box sx={{ flex: '1 1 45%' }}>
          <Controller
            name="loanAmount"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Loan Amount"
                type="number"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
                InputProps={{
                  min: 0, // Set the minimum value
                  sx: {
                    '& input[type=number]': {
                      '-moz-appearance': 'textfield', // For Firefox
                    },
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                      '-webkit-appearance': 'none', // For Chrome, Safari, Edge, and Opera
                      margin: 0,
                    },
                  },
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
          <Controller
            name="fathersName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Father's Name"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
          <Controller
            name="mothersName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Mother's Name"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="aadhaar"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Aadhaar"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="pan"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="PAN"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="mobile"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Mobile"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="alternateMobile"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Alternate Mobile"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="personalEmail"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Personal Email"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="officeEmail"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Office Email"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ flex: '1 1 45%', width: '100%' }} fullWidth> {/* Ensure the box takes full width */}
            <Controller
              name="workingSince"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  label="Working Since"
                  sx={{
                    width: "100%",
                    '& .MuiButtonBase-root': {
                      color: colors.black[100]
                    }
                  }}
                  format="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : ''}
                    />
                  )}
                  value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                  onChange={(newValue) => {
                    // field.onChange(newValue);
                    field.onChange(newValue ? newValue.toISOString() : null);
                  }}
                />
              )}
            />
          </Box>
        </LocalizationProvider>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="salary"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Salary"
                type="number"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
                InputProps={{
                  min: 0, // Set the minimum value
                  sx: {
                    "& input[type=number]": {
                      "-moz-appearance": "textfield", // For Firefox
                    },
                    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    {
                      "-webkit-appearance": "none", // For Chrome, Safari, Edge, and Opera
                      margin: 0,
                    },
                  },
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="State"
                variant="outlined"
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? fieldState.error.message
                    : ""
                }
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="City"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
          <Controller
            name="pinCode"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                type='string'
                label="Pin Code"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <Button
            variant="contained"
            onClick={() => setLeadEdit(false)}
            sx={{
              backgroundColor: colors.white[100],
              color: colors.redAccent[500],
              borderColor: colors.redAccent[500],
              borderRadius: "0px 10px 0px 10px",
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: colors.redAccent[500],
                color: colors.white[100]
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: colors.white[100],
              color: colors.primary[400],
              border: `1px solid colors.primary[400]`,
              borderRadius: "0px 10px 0px 10px",
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: colors.primary[400],
                color: colors.white[100]
              },
            }}
          >{
            isLoading ? <CircularProgress size={20} color="inherit" /> : "Submit"
          }
          </Button>
        </Box>
        {isError &&
          <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
            {error?.data?.message || "An error occurred while updating the lead."}
          </Alert>
        }
      </Box>
    </Box>
  );
};

export default LeadDetails;
