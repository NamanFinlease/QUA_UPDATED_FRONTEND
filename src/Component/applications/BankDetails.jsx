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
    CircularProgress,
    useTheme,
} from '@mui/material';
import { tokens } from '../../theme';
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

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


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
        <Paper 
            elevation={3} 
            style={{ 
                padding: '20px', 
                marginTop: '20px', 
                borderRadius: '0px 20px', 
                background:colors.white[100],
            }}
        >
            {(isAddingBank ||
                !(bankDetails && Object.keys(bankDetails).length > 0 && !bankDetails.message))
                ? (
                    <>
                        <Typography variant="h4" gutterBottom sx={{textAlign:"center", padding:"0px 0px 20px 0px", color:colors.primary[400]}}>
                            Add Bank Details
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box display="flex" flexDirection="column" gap={2}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color:colors.black[100],
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.primary[400],
                                      },
                                    },
                                    '& .MuiSelect-select': {
                                        color:colors.black[100],
                                        padding: '10px',
                                    },
                                    '& .MuiInputLabel-root': { 
                                        color: colors.black[100],
                                        ':hover':{
                                            color:colors.black[100],
                                        }
                                    },
                                    '& .MuiSelect-select': { color: colors.black[100] },
                                  }}
                            >
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
                                                sx={{ 
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
                                                    '& .MuiInputLabel-root': { color: colors.black[100] },
                                                    '& .MuiSelect-select': { color: colors.black[100] },
                                                    '& .MuiSelect-icon': { color: colors.black[100] },
                                                    '&:hover':{
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[100] },
                                                    }
                                                }}
                                            // error={!!errors.reference2?.relation}
                                            >
                                                <InputLabel style={{ color: colors.black[100] }}>Select Account Type</InputLabel>
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
                                    sx={{ 
                                        marginRight: '10px', 
                                        borderColor:colors.redAccent[500],
                                        color:colors.redAccent[500],
                                        background:colors.white[100],
                                        borderRadius:"0px 10px",
                                        border:`2px solid ${colors.redAccent[500]}`,
                                        '&:hover':{
                                            background:colors.redAccent[500],
                                            color:colors.white[100],
                                        }
                                    }}
                                    onClick={() => setIsAddingBank(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={addBankRes?.isLoading || updateLoading}
                                    variant="outlined"
                                    type="submit"
                                    sx={{
                                        backgroundColor: (addBankRes?.isLoading || updateLoading) ? "#ccc" : colors.white[100],
                                        color: (addBankRes?.isLoading || updateLoading) ? "#666" : colors.primary[400],
                                        cursor: (addBankRes?.isLoading || updateLoading) ? "not-allowed" : "pointer",
                                        borderRadius:"0px 10px",
                                        border:`2px solid ${colors.primary[400]}`,
                                        "&:hover": {
                                            background:colors.primary[400],
                                            color:colors.white[100],
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
                        <Typography 
                            variant="h3" 
                            gutterBottom 
                            sx={{
                                color:colors.primary[400],
                                textAlign:"center",
                                marginBottom:"20px",
                            }}
                        >
                            Bank Details
                        </Typography>
                        <TableContainer 
                            component={Paper}
                            sx={{
                                borderRadius:"0px 20px",
                                color:colors.black[100],
                                background:colors.white[100],
                                boxShadow:"0px 0px 20px rgb(0,0,0,0.2)",
                                '& .MuiTableCell-root':{
                                    color:colors.black[100],
                                    borderBottom:`2px solid ${colors.primary[400]}`,
                                }
                            }}
                        >
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
                                    backgroundColor: colors.white[100],
                                    color: colors.primary[400],
                                    borderRadius:"0px 10px",
                                    padding: '10px 20px',
                                    '&:hover': {
                                        boxShadow:"0px 0px 15px rgb(0,0,0,0.3)",
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
