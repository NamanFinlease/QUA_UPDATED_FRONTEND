import React, { useEffect, useState } from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import useAuthStore from '../store/authStore';
import useStore from '../../Store';
import { useDisburseLoanMutation } from '../../Service/applicationQueries';

const collectPayment = ({ disburse }) => {
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false);
  const { activeRole } = useAuthStore()
  const { applicationProfile } = useStore()
  const navigate = useNavigate()

  const { disbursalDate, netDisbursalAmount } = disburse?.application?.cam?.details
  const [disburseLoan, { data, isSuccess, isError, error }] = useDisburseLoanMutation()

  const defaultValues = {
    payableAccount: "",
    amount: netDisbursalAmount,
    paymentMode: "",
    channel: "",
    disbursalDate: disbursalDate && dayjs(disbursalDate),
    remarks: "",
  }

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(disburseSchema),
    defaultValues: defaultValues
  })

  const onSubmit = (data) => {
    disburseLoan({ id, data })
  }

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm); // Toggle form visibility
  };
  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        text: "Loan Disbursed!",
        icon: "success"
      });
      navigate("/disbursal-pending")
    }

  }, [isSuccess, data])

  return (
    <Box
      sx={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      {/* Render DisbursalProfile component before the dropdown header */}
      {/* <DisbursalProfile disburse={disburse?.application} /> */}

      {/* Clickable Header for Disbursal Bank with Background */}

      {(activeRole === "disbursalHead" && !applicationProfile.isDisbursed && applicationProfile.isRecommended) &&
        <>
          <Box
            onClick={handleToggleForm}
            sx={{
              backgroundColor: '#3f51b5', // Background color for header
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ffffff', // Text color
              marginTop: '20px',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
              Disbursal Bank
            </Typography>
            <ExpandMoreIcon
              sx={{
                marginLeft: '8px',
                color: '#ffffff',
                transform: showForm ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
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
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                fontSize: '12px',
                lineHeight: '1.5',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                marginTop: '10px',
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <Controller
                  name="payableAccount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth variant="outlined" error={!!fieldState.error}>
                      <InputLabel sx={{ color: '#9e9e9e' }}>Payable Account</InputLabel>
                      <Select
                        {...field}
                        label="Payable Account *"
                        sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px', color: '#363535' }}
                      >
                        <MenuItem value="">
                          <em>Select Account</em>
                        </MenuItem>
                        {
                          applicationProfile?.disbursalBanks && applicationProfile?.disbursalBanks.map(bank =>

                            <MenuItem key={bank._id} value={bank?.accountNo} >{bank?.accountNo}</MenuItem>
                          )
                        }
                      </Select>
                      {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
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
                      helperText={fieldState?.error ? fieldState?.error?.message : ''}
                      inputProps={{
                        placeholder: "Enter amount",
                        style: { color: '#363535' },
                      }}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        color: '#5a5a5a',
                        '& .MuiInputBase-input::placeholder': {
                          color: '#363535', // Placeholder color
                        },
                        '& .MuiInputLabel-root': {
                          color: '#9e9e9e', // Label color
                        },
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ccc', // Border color
                        },
                        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3f51b5', // Border color on hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3f51b5', // Border color on focus
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#e0e0e0', // Background color when disabled
                          color: '#9e9e9e', // Label color when disabled
                          '& .MuiInputBase-input': {
                            color: '#9e9e9e', // Text color when disabled
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#bdbdbd', // Border color when disabled
                          },
                        },
                      }}

                    />
                  )}

                />
                <Controller
                  name="paymentMode"
                  control={control}
                  render={({ field, fieldState }) => (

                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ color: '#9e9e9e' }}>Payment Mode</InputLabel>
                      <Select
                        {...field}
                        label="Payment Mode"
                        required
                        sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px', color: '#363535' }}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="offline">Offline</MenuItem>
                      </Select>
                      {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}

                    </FormControl>
                  )}
                />

                <Controller
                  name="channel"
                  control={control}
                  render={({ field, fieldState }) => (

                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ color: '#9e9e9e' }}>Channel</InputLabel>
                      <Select
                        {...field}
                        label="Channel"
                        required
                        sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px', color: '#363535' }}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value="imps">IMPS</MenuItem>
                        <MenuItem value="neft">NEFT</MenuItem>
                      </Select>
                      {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}

                    </FormControl>
                  )}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="disbursalDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        label="Disbursal Date"
                        value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}

                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            required
                            error={!!fieldState?.error}
                            helperText={fieldState?.error ? fieldState?.error?.message : ''}
                          />
                        )}

                        sx={{
                          backgroundColor: '#f5f5f5',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-input': {
                            color: '#363535', // Input text color
                          },
                          '& .MuiInputBase-input::placeholder': {
                            color: '#5a5a5a', // Placeholder color
                            opacity: 1, // Ensures placeholder color is not transparent
                          },
                          '& .MuiInputLabel-root': {
                            color: '#9e9e9e', // Label color
                          },
                          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ccc', // Border color
                          },
                          '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5', // Border color on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3f51b5', // Border color on focus
                          },
                        }}
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
                      helperText={fieldState?.error ? fieldState?.error?.message : ''}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        color: '#5a5a5a',
                        '& .MuiInputBase-input::placeholder': {
                          color: '#363535', // Placeholder color
                        },
                        '& .MuiInputLabel-root': {
                          color: '#9e9e9e', // Label color
                        },
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ccc', // Border color
                        },
                        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3f51b5', // Border color on hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#3f51b5', // Border color on focus
                        },
                      }}
                      inputProps={{
                        placeholder: 'Enter remarks here', // Placeholder text
                        style: { color: '#363535' }, // Text color
                      }}
                    />
                  )}
                />

              </Box>


              <Button
                type='submit'
                variant="contained"
                color="primary"
                sx={{
                  marginTop: '20px',
                  width: '100%',
                  backgroundColor: '#3f51b5', // Custom button color
                  '&:hover': {
                    backgroundColor: '#1e88e5', // Hover effect
                  },
                }}
              >
                Disburse
              </Button>
            </Box>
          )}
          {/* Submit button */}
        </>}

      {
        !applicationProfile.isRejected &&
        (activeRole !== "disbursalHead" || applicationProfile.isRecommended) &&

        <ActionButton
          id={applicationProfile?._id}
          isHold={applicationProfile?.onHold}
        // setPreviewSanction={setPreviewSanction}
        // sanctionPreview={sanctionPreview}
        // setForceRender={setForceRender}

        />}
    </Box>
  );
};

export default collectPayment;
