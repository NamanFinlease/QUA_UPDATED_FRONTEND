import React, { useEffect } from 'react';
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
} from '@mui/material';
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


const LeadDetails = ({ leadData, setLeadEdit }) => {
  const { id } = useParams();
  const [updateLead, { data, isSuccess, isError, error }] = useUpdateLeadMutation();

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(leadUpdateSchema),
    defaultValues: leadData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (leadData && Object.keys(leadData).length > 0) {
      Object.keys(leadData).forEach((key) => {
        setValue(key, leadData[key]);
      });
    }
  }, [leadData, setValue]);

  const onSubmit = (formData) => {
    setLeadEdit(false);
    updateLead({ id, formData });
  };

  return (
    <Box sx={{ padding: '40px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Lead Details
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: '#9c9b98',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Box sx={{ flex: '1 1 45%' }}>
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

        <Box sx={{ flex: '1 1 45%' }}>
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

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl variant="outlined" fullWidth required error={!!fieldState.error}>
                <InputLabel htmlFor="gender-select">Gender</InputLabel>
                <Select
                  {...field}
                  input={<OutlinedInput label="Gender" id="gender-select" />}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
                {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
              </FormControl>
            )}
          />
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ flex: '1 1 45%', width: '100%' }} fullWidth> {/* Ensure the box takes full width */}
            <Controller
              name="dob"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  label="Date of Birth"
                  sx={{ width: "100%" }}
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
                    field.onChange(newValue);
                  }}
                />
              )}
            />
          </Box>
        </LocalizationProvider>

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

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

        <Box sx={{ flex: '1 1 45%' }}>
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
                helperText={fieldState.error ? fieldState.error.message : ''}
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <Button
            variant="outlined"
            color="gray"
            onClick={() => setLeadEdit(false)}
            sx={{
              backgroundColor: 'gray',
              color: 'white',
              borderColor: 'gray',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: 'darkgray',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LeadDetails;
