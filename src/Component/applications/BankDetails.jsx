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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableHead,
} from '@mui/material';
import { tokens } from '../../theme';
import { useAddBankMutation, useGetBankDetailsQuery, useUpdateBankMutation, useLazyVerifyBankDetailsQuery } from '../../Service/applicationQueries';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import useStore from '../../Store';
import useAuthStore from '../store/authStore';
import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import { bankDetailsSchema } from '../../utils/validations';

const BankDetails = ({ id, leadData }) => {
    const { applicationProfile } = useStore()
    const { empInfo, activeRole } = useAuthStore()
    const [bankDetails, setBankDetails] = useState(null)
    const [isAddingBank, setIsAddingBank] = useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
    const [verificationData, setVerificationData] = useState(null);

    const bankRes = useGetBankDetailsQuery(id, { skip: id === null })
    const [verifyBank, {data : verifyData, isSuccess : verifySuccess, isLoading : verifyLoading, isError : isVerifyError, error : verifyError}] = useLazyVerifyBankDetailsQuery({ bankAccount: bankDetails?.bankAccNo, borrowerId :id }, { skip: id === null || !bankDetails });
    const [addBank, addBankRes] = useAddBankMutation();
    const [updatBank, { data: updateData, isSuccess: updateSuccess, isLoading: updateLoading, isError: isUpdateError, error: updateError }] = useUpdateBankMutation();

    console.log(leadData)
    const fullName = `${leadData?.fName} ${leadData?.mName} ${leadData?.lName}`

    // React Hook Form setup    
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: yupResolver(bankDetailsSchema)
    });

    // Handle form submission
    const onSubmit = (data) => {
        if (!isAddingBank) {

            addBank({ id, data });
        } else {
            updatBank({ id, data })
        }

    };

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const handleOpenForm = () => {
        setIsAddingBank(true)
        reset(bankDetails)
    }

    const handleOpenVerifyBank = () => {
        verifyBank({
            borrowerId: id,
            bankAccount : bankDetails?.bankAccNo
        })
    };

    const handleCloseDialog = () => {
        setOpenVerifyDialog(false); // Close the dialog
    };

    useEffect(() => {
        if (verifySuccess && verifyData) {
            setVerificationData(verifyData);
            setOpenVerifyDialog(true);
        }
    }, [verifySuccess, verifyData]);

    useEffect(() => {
        if (bankRes.isSuccess) {
            setBankDetails(bankRes?.data)
            // reset(bankRes.data[1])

        }

    }, [bankRes.isSuccess, bankRes.data])
    useEffect(() => {
        if ((addBankRes.isSuccess && addBankRes.data) || (updateSuccess && updateData)) {
            setIsAddingBank(false);
            reset();
            Swal.fire({
                text: "Bank Details added successfully!",
                icon: "success"
            });

        }

    }, [addBankRes.data, updateSuccess, updateData])

    return (
        <Paper
            elevation={3}
            style={{
                padding: '20px',
                marginTop: '20px',
                borderRadius: '0px 20px',
                background: colors.white[100],
            }}
        >
            {(isAddingBank ||
                !(bankDetails && Object.keys(bankDetails).length > 0 && !bankDetails.message))
                ? (
                    <>
                        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", padding: "0px 0px 20px 0px", color: colors.primary[400] }}>
                            Add Bank Details
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box display="flex" flexDirection="column" gap={2}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: colors.black[100],
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.primary[400],
                                            '&:hover': {
                                                borderColor: colors.primary[400],
                                            },
                                        },
                                    },
                                    '& .MuiSelect-select': {
                                        color: colors.black[100],
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: colors.black[100],
                                        ':hover': {
                                            color: colors.black[100],
                                        }
                                    },
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
                                                    '& .MuiInputLabel-root': { color: colors.black[100], },
                                                    '& .MuiInputBase-root': { height: "53px", },
                                                    '& .MuiSelect-select': { color: colors.black[100] },
                                                    '& .MuiSelect-icon': { color: colors.black[100] },
                                                    '&:hover': {
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
                                                    <MenuItem value="" disabled>Select Account Type</MenuItem>
                                                    <MenuItem value="savings">Savings</MenuItem>
                                                    <MenuItem value="overdraft">Overdraft</MenuItem>
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
                                    variant="contained"
                                    sx={{
                                        marginRight: '10px',
                                        borderColor: colors.redAccent[500],
                                        color: colors.redAccent[500],
                                        background: colors.white[100],
                                        borderRadius: "0px 10px",
                                        border: `2px solid ${colors.redAccent[500]}`,
                                        '&:hover': {
                                            background: colors.redAccent[500],
                                            color: colors.white[100],
                                        }
                                    }}
                                    onClick={() => setIsAddingBank(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={addBankRes?.isLoading || updateLoading}
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        backgroundColor: (addBankRes?.isLoading || updateLoading) ? "#ccc" : colors.white[100],
                                        color: (addBankRes?.isLoading || updateLoading) ? "#666" : colors.primary[400],
                                        cursor: (addBankRes?.isLoading || updateLoading) ? "not-allowed" : "pointer",
                                        borderRadius: "0px 10px",
                                        border: `2px solid ${colors.primary[400]}`,
                                        "&:hover": {
                                            background: colors.primary[400],
                                            color: colors.white[100],
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
                        {isUpdateError &&
                            <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                                {updateError?.data?.message}
                            </Alert>
                        }
                    </>

                ) : (
                    <>
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                color: colors.primary[400],
                                textAlign: "center",
                                marginBottom: "20px",
                            }}
                        >
                            Bank Details
                        </Typography>
                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: "0px 20px",
                                color: colors.black[100],
                                background: colors.white[100],
                                boxShadow: "0px 0px 20px rgb(0,0,0,0.2)",
                                '& .MuiTableCell-root': {
                                    color: colors.black[100],
                                    borderBottom: `2px solid ${colors.primary[400]}`,
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

                        <Box 
                            display="flex" 
                            justifyContent="flex-end" 
                            marginTop="20px"
                            sx={{
                                color:bankDetails?.isPennyDropped ? colors.greenAccent[700] : colors.redAccent[500]
                            }}
                        >
                            <p><strong>{bankDetails?.isPennyDropped ? "Bank Verified" : " Bank is Not Verified"}</strong></p>
                        </Box>

                        {(activeRole === "creditManager") && <Box display="flex" justifyContent="flex-end" marginTop="20px">
                            <Button
                                variant="contained"
                                onClick={() => handleOpenVerifyBank()}
                                sx={{
                                    background: colors.white[100],
                                    color: colors.primary[400],
                                    borderRadius: "0px 10px",
                                    margin: "0px 10px",
                                    border: `2px solid ${colors.primary[400]}`,
                                    '&:hover': {
                                        background: colors.primary[400],
                                        color: colors.white[100],
                                    },
                                }}
                            >
                                { verifyLoading ? <CircularProgress size={20} color="inherit" /> : "Verify Bank"}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleOpenForm()}
                                sx={{
                                    background: colors.white[100],
                                    color: colors.primary[400],
                                    borderRadius: "0px 10px",
                                    border: `2px solid ${colors.primary[400]}`,
                                    '&:hover': {
                                        background: colors.primary[400],
                                        color: colors.white[100],
                                    },
                                }}
                            >
                                Edit
                            </Button>
                        </Box>}
                    </>


                )}

            {bankRes.isError &&
                <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                    {bankRes?.error?.data?.message}
                </Alert>
            }
            {isVerifyError &&
                <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                    {verifyError?.data?.message}
                </Alert>
            }

            {/* Dialog for verifying bank details */}
            <Dialog
                open={openVerifyDialog} 
                onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '50%',
                        padding:"20px",
                        background: colors.white[100],
                        color: colors.primary[400],
                        borderRadius: "0px 20px",
                        boxShadow: "0px 0px 20px rgb(0,0,0,0.2)",
                    },
                    '& .MuiTableContainer-root': {
                        color: colors.primary[400],
                        borderRadius: "0px 20px",
                    },
                }}
            >
                <DialogTitle variant='h4' textAlign='center'>Verify Bank Details</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow sx={{background:colors.primary[400], color:colors.white[100]}}>
                                    <TableCell><strong>Field</strong></TableCell>
                                    <TableCell><strong>Lead</strong></TableCell>
                                    <TableCell><strong>Bank</strong></TableCell>
                                    <TableCell><strong>Comparison</strong></TableCell>
                                </TableRow>
                                <TableRow sx={{background:colors.white[100]}}>
                                    <TableCell sx={{color:colors.primary[400]}}><strong>Bank A/c No</strong></TableCell>
                                    <TableCell sx={{color:colors.primary[400]}}>{bankDetails?.bankAccNo}</TableCell>
                                    <TableCell sx={{color:colors.primary[400]}}>{verificationData?.pennydropData?.accountNo}</TableCell>
                                    <TableCell sx={{color:colors.primary[400]}}>{bankDetails?.bankAccNo === verificationData?.pennydropData?.accountNo ? "Matched" : "Not Matched"}</TableCell>
                                </TableRow>
                                <TableRow sx={{background:colors.white[100]}}>
                                    <TableCell sx={{color:colors.primary[400]}}><strong>Beneficiary Name</strong></TableCell>
                                    <TableCell sx={{color:colors.primary[400]}}>{fullName}</TableCell>
                                    <TableCell sx={{color:colors.primary[400]}}>{verificationData?.pennydropData?.name}</TableCell>
                                    <TableCell sx={{color:colors.primary[400]}}>{fullName === verificationData?.pennydropData?.name ? "Matched" : "Not Matched"}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseDialog}
                        variant='contained'
                        sx={{
                            color:colors.redAccent[500],
                            background:colors.white[100],
                            border:`2px solid ${colors.redAccent[500]}`,
                            borderRadius:"0px 10px",
                            fontWeight:"bold",
                            '&:hover':{
                                color:colors.white[100],
                                background:colors.redAccent[500]
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default BankDetails;
