import React, { useEffect, useState } from 'react';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails, Paper, Divider, TextField, Box, InputLabel, Select, MenuItem, FormControl, FormHelperText, Alert, TableContainer, TableBody, TableRow, TableCell, Table, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { residenceSchema } from '../../utils/validations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUpdatePersonalDetailsMutation } from '../../Service/applicationQueries';
import useStore from '../../Store';
import useAuthStore from '../store/authStore';

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




const Residence = ({ residence }) => {
  const { applicationProfile } = useStore()
  const { empInfo, activeRole } = useAuthStore()
  const id = applicationProfile._id
  const [columns, setColumns] = useState(null)
  const [isEditingResidence, setIsEditingResidence] = useState(false);

  const [updatePersonalDetails, { data, isSuccess, isLoading, isError, error }] = useUpdatePersonalDetailsMutation()

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(residenceSchema), // Connect Yup with React Hook Form
    defaultValues: {
      address: residence?.address || '',
      state: residence?.state || '',
      city: residence?.city || '',
      pincode: residence?.pincode || '',
      residingSince: residence?.residingSince || '',
    }
  });

  const onSubmit = (data) => {
    updatePersonalDetails({ id, updates: { residence: data } })
    // Call API or mutation function here
  };

  const handleResidenceEditToggle = () => {
    setIsEditingResidence(prev => !prev);
    if (!isEditingResidence && residence) {
      reset({
        address: residence?.address || '',
        state: residence?.state || '',
        city: residence?.city || '',
        pincode: residence?.pincode || '',
        residingSince: residence?.residingSince.split(" ")[0] || '',
      })
    } else {

      reset();
    }
  };

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

  useEffect(() => {
    if (isSuccess) {
      setIsEditingResidence(false)
      reset()
    }
  }, [isSuccess, data])


  useEffect(() => {
    if (residence && Object.keys(residence).length > 0) {
      setColumns([
        { label: 'Address', value: `${residence?.address || ''} `, label2: 'State', value2: residence?.state || '' },
        { label: 'City', value: residence?.city || '', label2: 'Pin Code', value2: residence?.pincode || '' },
        { label: 'Residing Since', value: residence.residingSince || '', },
      ]);
    }
  }, [residence])

  return (
    <>
      <Accordion style={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#007bb2' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" style={{ fontWeight: '600' }}>Residence Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} style={paperStyles}>
            {(isEditingResidence || !residence) ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Address"
                          fullWidth
                          error={!!errors.address}
                          helperText={errors.address?.message}
                          {...field}
                        />
                      )}
                    />
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
                  </Box>

                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
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
                  </Box>

                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>

                    <Controller
                      name="residingSince"
                      control={control}
                      render={({ field }) => {
                        const currentYear = new Date().getFullYear();
                        const pastYears = Array.from(new Array(100), (val, index) => currentYear - index); // Generate last 100 years

                        return (
                          <FormControl fullWidth error={!!errors.residingSince} sx={{ width: '150px' }}>
                            <InputLabel id="residingSince">Residing Since</InputLabel>
                            <Select
                              labelId="residingSince"
                              label="Residing Since"
                              {...field}
                            >
                              {pastYears.map((year) => (
                                <MenuItem key={year} value={year}>
                                  {year}
                                </MenuItem>
                              ))}
                            </Select>
                            {!!errors.residingSince && (
                              <FormHelperText>{errors.residingSince?.message}</FormHelperText>
                            )}
                          </FormControl>
                        );
                      }}
                    />


                    {isError &&
                      <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                        {error?.data?.message}
                      </Alert>
                    }
                  </Box>



                  <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button variant="outlined" onClick={handleResidenceEditToggle}>
                      Cancel
                    </Button>
                    <Button
                      style={buttonStyles}
                      type="submit"
                    >
                      {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}

                    </Button>
                  </Box>
                </Box>
              </form>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                  <Table aria-label="personal details table">
                    <TableBody>
                      {columns?.map((row, index) => (
                        <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#918f8e' } }}>
                          <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                          <TableCell align="left">{row.value || ''}</TableCell>
                          <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label2}</TableCell>
                          <TableCell align="left">{row.value2 || ''}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ my: 2 }} />

                {(activeRole === "creditManager") && <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    style={buttonStyles}
                    onClick={handleResidenceEditToggle}
                  >
                    Edit
                  </Button>
                </Box>}

              </>
            )}
          </Paper>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Residence;
