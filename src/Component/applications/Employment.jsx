import React, { useEffect, useState } from 'react';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails, Paper, Divider, TextField, Box, TableContainer, TableBody, TableRow, TableCell, Table, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useStore from '../../Store';
import { useUpdatePersonalDetailsMutation } from '../../Service/applicationQueries';
import { employmentSchema } from '../../utils/validations';
import { Alert } from '@mui/material'; // Import Alert component
import dayjs from 'dayjs';
import useAuthStore from '../store/authStore';
import { formatDate } from '../../utils/helper';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc); // Enable the utc plugin

const accordionStyles = {
  borderRadius: '12px',
  background: 'linear-gradient(145deg, #8cb4f5, #474e59)',
  boxShadow: '5px 5px 10px #d1d5db, -5px -5px 10px #ffffff',
  marginBottom: '20px'
};

const paperStyles = {
  padding: '30px',
  borderRadius: '15px',
  backgroundColor: '#918f8e',
  boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1)',
};



const Employment = ({ employmentData }) => {
  const { applicationProfile } = useStore();
  const {empInfo,activeRole} = useAuthStore()
  const id = applicationProfile._id;
  const [columns, setColumns] = useState(null);
  const [isEditingEmployment, setIsEditingEmployment] = useState(false);

  const [updatePersonalDetails, { data, isSuccess,isLoading, isError, error }] = useUpdatePersonalDetailsMutation();

  const defaultValues = {
    companyName: employmentData?.companyName || '',
    companyAddress: employmentData?.companyAddress || '',
    state: employmentData?.state || '',
    city: employmentData?.city || '',
    pincode: employmentData?.pincode || '',
    department: employmentData?.department || '',
    designation: employmentData?.designation || '',
    employedSince: employmentData?.employedSince ? dayjs(employmentData.employedSince) : null, // Use dayjs for Date object
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(employmentSchema),
    defaultValues
  });

  const onSubmit = (data) => {
    const newData = {
      employment: {
        ...data,
        employedSince: data.employedSince ? dayjs(data.employedSince).format('YYYY-MM-DD') : '', // Format as YYYY-MM-DD
      },
    };
    updatePersonalDetails({ id, updates: newData });
  };

  const handleEmploymentEditToggle = () => {
    setIsEditingEmployment(prev => !prev);
    if (!isEditingEmployment && employmentData) {

      reset({
        companyName: employmentData.companyName || '',
        companyAddress: employmentData.companyAddress || '',
        state: employmentData.state || '',
        city: employmentData.city || '',
        pincode: employmentData.pincode || '',
        department: employmentData.department || '',
        designation: employmentData.designation || '',
        employedSince: employmentData.employedSince ? dayjs(employmentData.employedSince) : null,
      });
    }else{
      reset()
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsEditingEmployment(false);
      reset();
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (employmentData && Object.keys(employmentData).length > 0) {
      setColumns([
        { label: 'Company Name', value: employmentData?.companyName || '', label2: 'Company Address', value2: employmentData?.companyAddress || '' },
        { label: 'State', value: employmentData?.state || '', label2: 'City', value2: employmentData?.city || '' },
        { label: 'Pincode', value: employmentData?.pincode || '', label2: 'Department', value2: employmentData?.department || '' },
        { label: 'Designation', value: employmentData?.designation || '', label2: 'Employed Since', value2: employmentData?.employedSince && formatDate(employmentData?.employedSince)  || '' },
      ]);
    }
  }, [employmentData]);

  const buttonStyles = {
    borderRadius: '8px',
    padding: '10px 20px',
    backgroundColor: isLoading ? "#ccc" : "#1F2A40",
    color: isLoading ? "#666" : "white",
    cursor: isLoading ? "not-allowed" : "pointer",
    "&:hover": {
      backgroundColor: isLoading ? "#ccc" : "#3F4E64",
    },
  };

  return (
    <Accordion style={accordionStyles}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#007bb2' }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6" style={{ fontWeight: '600' }}>Employment Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper elevation={3} style={paperStyles}>
          {(isEditingEmployment || !employmentData) ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Controller
                      name="companyName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Company Name"
                          fullWidth
                          error={!!errors.companyName}
                          helperText={errors.companyName?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="companyAddress"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Company Address"
                          fullWidth
                          error={!!errors.companyAddress}
                          helperText={errors.companyAddress?.message}
                          {...field}
                        />
                      )}
                    />
                  </Box>

                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="State"
                          fullWidth
                          error={!!errors.state}
                          helperText={errors.state?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="City"
                          fullWidth
                          error={!!errors.city}
                          helperText={errors.city?.message}
                          {...field}
                        />
                      )}
                    />
                  </Box>

                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Controller
                      name="pincode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Pincode"
                          fullWidth
                          error={!!errors.pincode}
                          helperText={errors.pincode?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Department"
                          fullWidth
                          error={!!errors.department}
                          helperText={errors.department?.message}
                          {...field}
                        />
                      )}
                    />
                  </Box>

                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Controller
                      name="designation"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Designation"
                          fullWidth
                          error={!!errors.designation}
                          helperText={errors.designation?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="employedSince"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Employed Since"
                          sx={{ width: "100%" }}
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)} // Connect the DatePicker with react-hook-form
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={!!errors.employedSince}
                              helperText={errors.employedSince?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>

                  {isError && (
                    <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                      {error?.data?.message}
                    </Alert>
                  )}

                  <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button variant="outlined" onClick={handleEmploymentEditToggle}>
                      Cancel
                    </Button>
                    <Button style={buttonStyles} type="submit">
                    {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </Button>
                  </Box>
                </Box>
              </form>
            </LocalizationProvider>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableBody>
                    {columns?.map((column, index) => (
                      <TableRow key={index}>
                        <TableCell><strong>{column.label}:</strong> {column.value}</TableCell>
                        <TableCell><strong>{column.label2}:</strong> {column.value2}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              {(activeRole === "creditManager"  ) && <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  style={buttonStyles}
                  onClick={handleEmploymentEditToggle}
                >
                  Edit 
                </Button>
              </Box>}
            </>
          )}
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default Employment;
