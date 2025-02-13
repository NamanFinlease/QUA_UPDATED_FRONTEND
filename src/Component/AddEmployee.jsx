// import React, { useEffect, useState } from 'react';
// import { Box, TextField, Typography, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, useTheme, Chip } from '@mui/material';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { tokens } from '../theme'
// import { Controller, useForm } from 'react-hook-form';
// import { useAddEmployeeMutation } from '../Service/Query';
// import Swal from 'sweetalert2';

// const roleOptions = [
//     { value: "screener", label: "Screener" },
//     { value: "creditManager", label: "Credit Manager" },
//     { value: "sanctionHead", label: "Sanction Head" },
//     { value: "disbursalManager", label: "Disbursal Manager" },
//     { value: "disbursalHead", label: "Disbursal Head" },
//     { value: "collectionExecutive", label: "Collection Executive" },
//     { value: "accountExecutive", label: "Account Executive" },
// ];

// const AddEmployee = () => {
//     const [addEmployee, { data, isSuccess, isError, error: addEmployeeError }] = useAddEmployeeMutation();
//     const [roles, setRoles] = useState(roleOptions)
//     const [selectedRoles, setSelectedRoles] = useState([])
//     const defaultValue = {
//         fName: '',
//         lName: '',
//         email: '',
//         gender: '',
//         mobile: '',
//         password: '',
//         confPassword: '',
//         empRole: [],
//         empId: ''
//     }
//     const [error, setError] = useState('');
    
//     const { handleSubmit, control,watch,getValues, setValue, } = useForm({
//         defaultValues: defaultValue
//     })

//     // Color theme
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);


//     const onSubmit = (data) => {
//         addEmployee(data)
//     }
//     useEffect(() => {
//         if (isSuccess) {
//             Swal.fire({
//                 text: "Employee added successfully!",
//                 icon: "success"
//             });
//         }

//     }, [isSuccess]);

//     return (
//         <>
//             <Box sx={{ padding: '10px 20px', minHeight: '80vh' }}>
//                 <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: colors.primary[400],padding:"20px 0px" }}>
//                     Add Employee
//                 </Typography>

//                 <Box
//                     component="form"
//                     noValidate
//                     onSubmit={handleSubmit(onSubmit)}
//                     sx={{
//                         background: colors.white[100],
//                         padding: '30px',
//                         borderRadius: '0px 20px',
//                         boxShadow: '0 0px 18px rgba(0,0,0,0.1)',
//                         display: 'flex',
//                         flexWrap: 'wrap',
//                         gap: '20px',
//                         '& .MuiTextField-root':{
//                             color:colors.black[100],
//                         },
//                         '& .MuiInputLabel-root':{
//                             color:colors.black[100],
//                         },
//                         '& .MuiOutlinedInput-notchedOutline': {
//                             borderColor: colors.primary[400],
//                         },
//                         '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: colors.primary[400],
//                         },
//                         '& .MuiSelect-icon': {
//                             color: colors.black[100],
//                         },
//                         '&:hover .MuiOutlinedInput-notchedOutline': {
//                             borderColor: colors.primary[400],
//                         },
//                     }}
//                 >
//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="fName"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <TextField
//                                     {...field}
//                                     required
//                                     fullWidth
//                                     label="First Name"
//                                     variant="outlined"
//                                     sx={{ color: 'black' }}
//                                     error={!!fieldState.error}
//                                     helperText={fieldState.error ? fieldState.error.message : ''}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="lName"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <TextField
//                                     {...field}
//                                     fullWidth
//                                     label="Last Name"
//                                     variant="outlined"
//                                     error={!!fieldState.error}
//                                     helperText={fieldState.error ? fieldState.error.message : ''}
//                                 />
//                             )}
//                         />
//                     </Box>


//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="gender"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <FormControl variant="outlined" fullWidth required error={!!fieldState.error}>
//                                     <InputLabel htmlFor="gender-select">Gender</InputLabel>
//                                     <Select
//                                         {...field}
//                                         input={<OutlinedInput label="Gender" id="gender-select" />}
//                                     >
//                                         <MenuItem value="M">Male</MenuItem>
//                                         <MenuItem value="F">Female</MenuItem>
//                                     </Select>
//                                     {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
//                                 </FormControl>
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="email"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <TextField
//                                     {...field}
//                                     required
//                                     fullWidth
//                                     label="Email"
//                                     variant="outlined"
//                                     error={!!fieldState.error}
//                                     helperText={fieldState.error ? fieldState.error.message : ''}
//                                 />
//                             )}
//                         />
//                     </Box>

//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="password"
//                             control={control}
//                             render={({ field, fieldState }) => {
//                                 return (
//                                     <TextField
//                                         {...field}
//                                         required
//                                         fullWidth
//                                         label="Password"
//                                         type='password'
//                                         variant="outlined"
//                                         error={!!fieldState.error}
//                                         helperText={fieldState.error ? fieldState.error.message : ''}
//                                     />
//                                 )
//                             }}
//                         />
//                     </Box>
//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="confPassword"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <TextField
//                                     {...field}
//                                     required
//                                     fullWidth
//                                     type="password"
//                                     label="Confirm Password"
//                                     variant="outlined"
//                                     error={!!fieldState.error}
//                                     helperText={fieldState.error ? fieldState.error.message : ''}
//                                 />
//                             )}
//                         />
//                     </Box>
//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="mobile"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <TextField
//                                     {...field}
//                                     required
//                                     fullWidth
//                                     type="tel"
//                                     label="Mobile"
//                                     variant="outlined"
//                                     error={!!fieldState.error}
//                                     helperText={fieldState.error ? fieldState.error.message : ''}
//                                 />
//                             )}
//                         />
//                     </Box>

//                     <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="empId"
//                             control={control}
//                             render={({ field, fieldState }) => {
//                                 return (
//                                     <TextField
//                                         {...field}
//                                         required
//                                         fullWidth
//                                         label="Employee ID"
//                                         variant="outlined"
//                                         error={!!fieldState.error}
//                                         helperText={fieldState.error ? fieldState.error.message : ''}
//                                     />
//                                 )
//                             }}
//                         />
//                     </Box>

//                     <Controller
//                         name="empRole"
//                         control={control}
//                         render={({ field, fieldState }) => (
//                             <FormControl variant="outlined" fullWidth required error={!!fieldState.error}>
//                                 <InputLabel htmlFor="emp-role">Employee Role</InputLabel>
//                                 <Select
//                                     {...field}
//                                     multiple
//                                     value={field.value || []}
//                                     onChange={(e) => {
//                                         const selectedValues = e.target.value;
//                                         field.onChange(selectedValues);
//                                         // const updatedRoles = removeRoleFromSelected(selected, value);
//                                         // field.onChange(updatedRoles); // Update form state with the new list
//                                     }}
//                                     input={<OutlinedInput id="emp-role" label="Employee Role" />}
//                                     renderValue={(selected) => (
//                                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                                         {selected.map((value) => {
//                                             const selectedRole = roles.find(role => role.value === value);
//                                         //     return selectedRole ? selectedRole.label : value;
//                                         // }).join(', ')
//                                             return (
//                                                 <Chip
//                                                     key={value}
//                                                     label={selectedRole.label}
//                                                     onDelete={() => {
//                                                         const newSelectedRoles = selected.filter(role => role !== value);
//                                                         // setSelectedRoles(newSelectedRoles);
//                                                         field.onChange(newSelectedRoles);
                                                        
//                                                         // const updatedRoles = removeRoleFromSelected(selected, value);
//                                                         // field.onChange(updatedRoles); // Update form state with the new list
//                                                     }}
//                                                     deleteIcon={
//                                                         <CancelIcon 
//                                                             onMouseDown={(e) => e.stopPropagation()}
//                                                         />
//                                                     }
//                                                 />
//                                             );
//                                         })};
//                                         </Box>
//                                     )}
//                                 >
//                                     {roles.map((role) => (
//                                         <MenuItem key={role.value} value={role.value}>
//                                             {role.label}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                                 {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
//                             </FormControl>
//                         )}
//                     />

//                     {/* <Box sx={{ flex: '1 1 45%' }}>
//                         <Controller
//                             name="selectedRole"
//                             control={control}
//                             render={({ field, fieldState }) => (
//                                 <TextField
//                                     {...field}
//                                     required
//                                     fullWidth
//                                     type='text'
//                                     label="Selected Role"
//                                     variant="outlined"
//                                     error={!!fieldState.error}
//                                     helperText={fieldState.error ? fieldState.error.message : ''}
//                                 />
//                             )}
//                         />
//                     </Box> */}
//                     <Button 
//                         type="submit" 
//                         variant="contained" 
//                         sx={{ 
//                             mt: 3, 
//                             background:colors.primary[400], 
//                             color: colors.white[100],
//                             ":hover": { boxShadow: `0px 5px 10px rgb(0,0,0,0.3)`}
//                         }}>
//                         Add Employee
//                     </Button>
//                 </Box>
//             </Box>
//         </>
//     );
// };

// export default AddEmployee;


import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, useTheme, Chip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from '../theme';
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

    //color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
            <Box sx={{ margin:"20px", padding: '30px', background: colors.white[100], boxShadow: '0 0px 20px rgba(0,0,0,0.1)', borderRadius: '0px 20px' }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: colors.primary[400] }}>
                    Add Employee
                </Typography>

                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        background: colors.white[100],
                        padding: '30px',
                        margin: '20px auto',
                        borderRadius: '0px 20px',
                        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        '& .MuiTextField-root':{
                            color:colors.black[100],
                        },
                        '& .MuiInputLabel-root':{
                            color:colors.black[100],
                        },
                        '& .MuiInputBase-root':{
                            color : colors.black[100],
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary[400],
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary[400],
                        },
                        '& .MuiSelect-icon': {
                            color: colors.black[100],
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary[400],
                        },
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
                                    // InputLabelProps={{shrink:true}}
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
                                        // InputLabelProps={{shrink:true}}
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
                            <FormControl 
                                variant="outlined"
                                fullWidth 
                                required 
                                error={!!fieldState.error}
                            >
                                <InputLabel htmlFor="emp-role">Employee Role</InputLabel>
                                <Select
                                    {...field}
                                    multiple
                                    value={field.value || []}
                                    onChange={(e) => {
                                        const selectedValues = e.target.value;
                                        field.onChange(selectedValues);
                                        // const updatedRoles = removeRoleFromSelected(selected, value);
                                        // field.onChange(updatedRoles); // Update form state with the new list
                                    }}
                                    input={<OutlinedInput id="emp-role" label="Employee Role" />}
                                    renderValue={(selected) => (
                                        <Box 
                                            sx={{ 
                                                display: 'flex',
                                                flexWrap: 'wrap', 
                                                gap: 0.5,
                                            }}
                                        >
                                        {selected.map((value) => {
                                            const selectedRole = roles.find(role => role.value === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={selectedRole.label}
                                                    sx={{
                                                        color:colors.white[100],
                                                        background:colors.primary[100],
                                                    }}
                                                    onDelete={() => {
                                                        const newSelectedRoles = selected.filter(role => role !== value);
                                                        field.onChange(newSelectedRoles);
                                                        
                                                    }}
                                                    deleteIcon={
                                                        <CancelIcon
                                                            style={{color:colors.white[100]}}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                        />
                                                    }
                                                />
                                            );
                                        })};
                                        </Box>
                                    )}
                                >
                                    {roles.map((role) => (
                                        <MenuItem
                                            key={role.value} 
                                            value={role.value}
                                        >
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
                    <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ 
                            mt: 3, 
                            borderRadius:"0px 10px",
                            background:colors.primary[400], 
                            color: colors.white[100],
                            ":hover": { background: colors.primary[100] }
                        }}>
                        Add Employee
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default AddEmployee;
