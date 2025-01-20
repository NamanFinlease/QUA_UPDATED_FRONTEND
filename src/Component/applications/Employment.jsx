import React, { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails, Paper, Divider, TextField, Box, TableContainer, TableBody, TableRow, TableCell, Table, CircularProgress, useTheme } from '@mui/material';
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

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const accordionStyles = {
    borderRadius: '0px 20px',
    background: colors.white[100],
    boxShadow: '0px 0px 10px rgb(0,0,0,0.2)',
    marginBottom: '20px',
  };

  const paperStyles = {
    // padding: '30px',
    borderRadius: '0px 20px',
    backgroundColor: colors.white[100],
    color:colors.black[100],
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    margin:0,
  };

  const buttonStyles = {
    borderRadius: '0px 10px',
    padding: '10px 20px',
    backgroundColor: isLoading ? "#ccc" : colors.white[100],
    color: isLoading ? "#666" : colors.primary[400],
    cursor: isLoading ? "not-allowed" : "pointer",
    "&:hover": {
      backgroundColor: isLoading ? "#ccc" : colors.primary[100],
    },
  };

  return (
    <Accordion style={accordionStyles}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6" style={{ fontWeight: '600', color:colors.primary[400] }}>Employment Information</Typography>
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
                    <Button 
                      variant="outlined" 
                      sx={{
                        background:colors.white[100],
                        // borderColor:colors.redAccent[500],
                        color:colors.redAccent[500],
                        borderRadius:"0px 10px",
                        "&:hover": {
                          background:colors.redAccent[500],
                          color:colors.white[100],
                        }
                      }}
                      onClick={handleEmploymentEditToggle}
                    >
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
              <TableContainer sx={{'& .MuiTableCell-root':{color:colors.black[100], borderBottom:`2px solid ${colors.primary[400]}`,}}}>
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
