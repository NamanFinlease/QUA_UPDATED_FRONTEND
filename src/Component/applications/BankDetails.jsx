import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Paper,
    Divider,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Box,
    Alert,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    CircularProgress
} from '@mui/material';
import { useAddBankMutation, useGetBankDetailsQuery, useUpdateBankMutation } from '../../Service/applicationQueries';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import useStore from '../../Store';
import useAuthStore from '../store/authStore';
import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import { bankDetailsSchema } from '../../utils/validations';

const BankDetails = ({ id }) => {
    const { applicationProfile } = useStore()
    const { empInfo, activeRole } = useAuthStore()
    const [bankDetails, setBankDetails] = useState(null)
    const [isAddingBank, setIsAddingBank] = useState(false);

    const bankRes = useGetBankDetailsQuery(id, { skip: id === null })
    const [addBank, addBankRes] = useAddBankMutation();
    const [updatBank, {data:updateData,isSuccess:updateSuccess,isLoading:updateLoading,isError:isUpdateError,error:updateError}] = useUpdateBankMutation();

    // React Hook Form setup
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: yupResolver(bankDetailsSchema)
    });

    // Handle form submission
    const onSubmit = (data) => {
        if (!isAddingBank) {

            addBank({ id, data });
        }else{
            updatBank({id,data})
        }

    };


    const handleOpenForm = () => {


        setIsAddingBank(true)
        reset(bankDetails)
    }

    useEffect(() => {
        if (bankRes.isSuccess ) {
            setBankDetails(bankRes?.data)
            // reset(bankRes.data[1])

        }

    }, [bankRes.isSuccess, bankRes.data])
    useEffect(() => {
        if ((addBankRes.isSuccess && addBankRes.data) ||  (updateSuccess && updateData)) {
            setIsAddingBank(false);
            reset();
            Swal.fire({
                text: "Bank Details added successfully!",
                icon: "success"
            });

        }

    }, [addBankRes.data ,updateSuccess,updateData])

    return (
        <Paper elevation={3} style={{ padding: '10px', marginTop: '20px', borderRadius: '10px' }}>
            {(isAddingBank ||
                !(bankDetails && Object.keys(bankDetails).length > 0 && !bankDetails.message))
                ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Add Bank Details
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                                    <Controller
                                        name="bankName"
                                        control={control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <TextField
                                                    label="Bank Name"
                                                    fullWidth
                                                    {...field}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error ? fieldState.error.message : ''}

                                                />
                                            )
                                        }}
                                    />
                                    <Controller
                                        name="branchName"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                label="Branch Name"
                                                fullWidth
                                                {...field}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error ? fieldState.error.message : ''}

                                            />
                                        )}
                                    />
                                </Box>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                                    <Controller
                                        name="bankAccNo"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Bank Account Number"
                                                fullWidth
                                                error={!!fieldState.error}
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="ifscCode"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                label="IFSC Code"
                                                fullWidth {...field}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                                    {/* Beneficiary Name Input */}
                                    <Controller
                                        name="beneficiaryName"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                label="Beneficiary Name"
                                                fullWidth {...field}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error ? fieldState.error.message : ''}
                                            />
                                        )}
                                    />

                                    {/* Account Type Dropdown */}
                                    <Controller
                                        name="accountType"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <FormControl
                                                fullWidth
                                                variant="standard"
                                            // error={!!errors.reference2?.relation}
                                            >
                                                <InputLabel>Select Account Type</InputLabel>
                                                <Select
                                                    {...field}
                                                    label="Account Type"
                                                >
                                                    {/* <MenuItem value="">Select Account Type</MenuItem> */}
                                                    <MenuItem value="savings">Savings</MenuItem>
                                                    <MenuItem value="current">Current</MenuItem>
                                                </Select>
                                                {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}

                                                {/* <FormHelperText>{errors.reference2?.relation?.message}</FormHelperText> */}
                                            </FormControl>
                                        )}
                                    />
                                </Box>

                            </Box>

                            <Box display="flex" justifyContent="flex-end" marginTop="20px">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ marginRight: '10px' }}
                                    onClick={() => setIsAddingBank(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={addBankRes?.isLoading || updateLoading}
                                    type="submit"
                                    sx={{
                                        backgroundColor: (addBankRes?.isLoading || updateLoading) ? "#ccc" : "#1F2A40",
                                        color: (addBankRes?.isLoading || updateLoading) ? "#666" : "white",
                                        cursor: (addBankRes?.isLoading || updateLoading) ? "not-allowed" : "pointer",
                                        "&:hover": {
                                            backgroundColor: (addBankRes?.isLoading || updateLoading) ? "#ccc" : "#3F4E64",
                                        },
                                    }}
                                >
                                    {(addBankRes?.isLoading || updateLoading) ? <CircularProgress size={20} color="inherit" /> : "Save"}
                                </Button>

                            </Box>
                        </form>
                        {addBankRes.isError &&
                            <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                                {addBankRes?.error?.data?.message}
                            </Alert>
                        }
                    </>

                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Bank Details
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Bank Name:</strong></TableCell>
                                        <TableCell>{bankDetails?.bankName}</TableCell>
                                        <TableCell><strong>Branch Name:</strong></TableCell>
                                        <TableCell>{bankDetails?.branchName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Bank Account Number:</strong></TableCell>
                                        <TableCell>{bankDetails?.bankAccNo}</TableCell>
                                        <TableCell><strong>IFSC Code:</strong></TableCell>
                                        <TableCell>{bankDetails?.ifscCode}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Beneficiary Name:</strong></TableCell>
                                        <TableCell>{bankDetails?.beneficiaryName}</TableCell>
                                        <TableCell><strong>Account Type:</strong></TableCell>
                                        <TableCell>{bankDetails?.accountType}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {(activeRole === "creditManager") && <Box display="flex" justifyContent="flex-end" marginTop="20px">
                            <Button
                                variant="outlined"
                                onClick={() => handleOpenForm()}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    padding: '10px 20px',
                                    '&:hover': {
                                        backgroundColor: 'darkPrimary',
                                    },
                                }}
                            >
                                Edit
                            </Button>
                        </Box>}
                    </>


                )}

            <Divider style={{ margin: '30px 0' }} />
            {bankRes.isError &&
                <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                    {bankRes?.error?.data?.message}
                </Alert>
            }
        </Paper>
    );
};

export default BankDetails;
