import React, { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import { Typography, Button, Accordion, AccordionSummary, AccordionDetails, Paper, Divider, TextField, Box, InputLabel, Select, MenuItem, FormControl, FormHelperText, Alert, TableContainer, TableBody, TableRow, TableCell, Table, CircularProgress, useTheme } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { residenceSchema } from '../../utils/validations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUpdatePersonalDetailsMutation } from '../../Service/applicationQueries';
import useStore from '../../Store';
import useAuthStore from '../store/authStore';


const Residence = ({ residence }) => {
  const { applicationProfile } = useStore()
  const { empInfo, activeRole } = useAuthStore()
  const id = applicationProfile._id
  const [columns, setColumns] = useState(null)
  const [isEditingResidence, setIsEditingResidence] = useState(false);

  const [updatePersonalDetails, { data, isSuccess, isLoading, isError, error }] = useUpdatePersonalDetailsMutation()

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    borderRadius: '0px 10px',
    padding: '10px 20px',
    background: isLoading ? "#ccc" : colors.primary[400],
    color: isLoading ? "#666" : colors.white[100],
    cursor: isLoading ? "not-allowed" : "pointer",
  };

  const accordionStyles = {
    borderRadius: '0px 20px',
    background: colors.white[100],
    color:colors.primary[400],
    boxShadow: '0px 0px 10px rgb(0,0,0,0,2)',
    marginBottom: '20px',
  };
  
  const paperStyles = {
    padding: '30px',
    borderRadius: '0px 20px',
    background: colors.white[100],
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    '& .MuiTableCell-root':{
      color:colors.black[100],
    }
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
          expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" style={{ fontWeight: '600' }}>Residence Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} style={paperStyles}>
            {(isEditingResidence || !residence) ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  gap={2} 
                  sx={{
                    color:colors.black[100],
                    '& .MuiInputBase-root':{
                      color:colors.black[100],
                    },
                    '& .MuiOutlinedInput-notchedOutline':{
                      borderColor:colors.black[100],
                    },
                    '& .MuiInputLabel-root': { 
                      color: colors.black[100] 
                    },
                    '& .MuiPaper-root':{
                      color:colors.white[100],
                    },
                    '& .MuiSelect-icon': { 
                      color: colors.black[100] 
                    },
                    '&:hover':{
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.black[100] },
                    },
                  }}
                >
                  <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} >
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
                    <Button 
                      sx={{
                        color:colors.redAccent[500], 
                        borderColor:colors.redAccent[500],
                        background:colors.white[100],
                        borderRadius:"0px 10px 0px 10px",
                        ':hover':{
                          background:colors.redAccent[500],
                          color:colors.white[100],
                        }
                      }}
                      variant="contained" onClick={handleResidenceEditToggle}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        color:colors.white[100],
                        background:colors.primary[400],
                        borderRadius:"0px 10px",
                        border:`1px solid ${colors.primary[400]}`,
                        ':hover':{
                          boxShadow:'0px 5px 10px rgba(0,0,0,0.2)',
                        },
                      }}
                      type="submit"
                    >
                      {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}

                    </Button>
                  </Box>
                </Box>
              </form>
            ) : (
              <>
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    borderRadius: '0px 20px', 
                    background:colors.white[100],
                    '& .MuiPaper-root':{
                      background:colors.white[100],
                    },
                    '& .MuiTableCell-root': {
                      background:colors.white[100],
                      color:colors.black[100],
                      borderBottom:`2px solid ${colors.primary[400]}`,
                    },
                  }}
                >
                  <Table aria-label="personal details table">
                    <TableBody>
                      {columns?.map((row, index) => (
                        <TableRow 
                          key={index} 
                          sx={{ 
                            backgroundColor: colors.primary[400], 
                            borderBottom:`2px solid ${colors.white[100]}`,
                            }}>
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
