import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useAddEmployeeMutation } from '../Service/Query';
import Swal from 'sweetalert2';

const roleOptions = [
    { value: "screener", label: "Screener" },
    { value: "creditManager", label: "Credit Manager" },
    { value: "sanctionHead", label: "Sanction Head" },
    { value: "disbursalManager", label: "Disbursal Manager" },
    { value: "disbursalHead", label: "Disbursal Head" },
    { value: "collectionExecutive", label: "Collection Executive" },
    { value: "accountExecutive", label: "Account Executive" },
];




const AddEmployee = () => {
    const [addEmployee, { data, isSuccess, isError, error: addEmployeeError }] = useAddEmployeeMutation();
    const [roles, setRoles] = useState(roleOptions)
    const [selectedRoles, setSelectedRoles] = useState([])
    const defaultValue = {
        fName: '',
        lName: '',
        email: '',
        gender: '',
        mobile: '',
        password: '',
        confPassword: '',
        empRole: [],
        empId: ''
    }
    const [error, setError] = useState('');
    
    const { handleSubmit, control,watch,getValues, setValue, } = useForm({
        defaultValues: defaultValue
    })


    const onSubmit = (data) => {
        addEmployee(data)
    }
    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                text: "Employee added successfully!",
                icon: "success"
            });
        }

    }, [isSuccess]);

    return (
        <>
            <Box sx={{ padding: '40px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    Add Employee
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
                            name="lName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
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
                    <Box sx={{ flex: '1 1 45%' }}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    InputLabelProps={{shrink:true}}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error ? fieldState.error.message : ''}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ flex: '1 1 45%' }}>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => {
                                return (
                                    <TextField
                                        {...field}
                                        required
                                        fullWidth
                                        label="Password"
                                        type='password'
                                        variant="outlined"
                                        InputLabelProps={{shrink:true}}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error ? fieldState.error.message : ''}
                                    />
                                )
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 45%' }}>
                        <Controller
                            name="confPassword"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    type="password"
                                    label="Confirm Password"
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
                                    type="tel"
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
                            name="empId"
                            control={control}
                            render={({ field, fieldState }) => {
                                return (
                                    <TextField
                                        {...field}
                                        required
                                        fullWidth
                                        label="Employee ID"
                                        variant="outlined"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error ? fieldState.error.message : ''}
                                    />
                                )
                            }}
                        />
                    </Box>

                    <Controller
                        name="empRole"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl variant="outlined" fullWidth required error={!!fieldState.error}>
                                <InputLabel htmlFor="emp-role">Employee Role</InputLabel>
                                <Select
                                    {...field}
                                    multiple
                                    value={field.value || []}
                                    onChange={(e) => {
                                        const selectedValues = e.target.value;
                                        field.onChange(selectedValues);
                                    }}
                                    input={<OutlinedInput id="emp-role" label="Employee Role" />}
                                    renderValue={(selected) =>
                                        selected.map((value) => {
                                            const selectedRole = roles.find(role => role.value === value);
                                            return selectedRole ? selectedRole.label : value;
                                        }).join(', ')
                                    }
                                >
                                    {roles.map((role, i) => (
                                        <MenuItem key={i} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                            </FormControl>
                        )}
                    />

                    {/* <Box sx={{ flex: '1 1 45%' }}>
                        <Controller
                            name="selectedRole"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    type='text'
                                    label="Selected Role"
                                    variant="outlined"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error ? fieldState.error.message : ''}
                                />
                            )}
                        />
                    </Box> */}
                    <Button type="submit" variant="contained" sx={{ mt: 3, backgroundColor: '#007bff', color: '#fff' }}>
                        Save Employee
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default AddEmployee;
