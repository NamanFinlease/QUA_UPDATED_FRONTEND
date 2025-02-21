import React, {useState} from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Box, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useAuthStore from './store/authStore';


const CommonRemarks = ({id, onRemarksChange}) => {
    const {commonRemarks, setCommonRemarks} = useState([])
    const { empInfo, activeRole } = useAuthStore();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {control} = useForm({
        defaultValues: {
            addRemarks : '',
        }
    })

    const handleChange = (e)=>{

    }

    // const handleRemarksChange = (e) => {
    //     console.log(onRemarksChange)
    //     onRemarksChange(e.target.value);
    // };

    return (
        <>
        
            <Box 
                component="form"
                // onChange={handleChange}
                className="p-3 m-3"
                sx={{
                    background:colors.white[100],
                    color:colors.black[100],
                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                    borderRadius:"0px 20px",
                    // width:"400px",
                    height:"auto",

                }}
            >
                <Typography variant="h6" style={{ fontWeight: '600', color: colors.primary[400], marginBottom:"10px", textAlign:"center", fontSize:"18px" }}>
                    Add Remarks
                </Typography>
                <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                    <Controller
                        name="addRemarks"
                        control={control}
                        render={({ field, fieldState }) => (
                        <FormControl
                            variant="outlined"
                            fullWidth
                            required
                            error={!!fieldState.error}
                            sx={{
                                colors:colors.black[100],
                                '& .MuiOutlinedInput-root': {
                                    color:colors.white[100]
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor:colors.primary[400],
                                    "&:hover": {
                                        borderColor:colors.primary[400]
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color:colors.primary[400],
                                },
                                '& .MuiSelect-select': {
                                    color:colors.primary[100],
                                },
                                '& .MuiSelect-icon': {
                                    color:colors.primary[400],
                                }
                            }}
                            >
                            <TextField
                                {...field}
                                id="add-remarks"
                                label="Remarks"
                                // onChange={handleRemarksChange}
                                multiline
                                rows={4}
                                variant="outlined"
                                inputProps={{
                                    minLength: 30
                                }}
                                sx={{
                                    color:colors.primary[100],
                                    "&:hover": {
                                        color:colors.primary[100],
                                    },
                                    '& .MuiInputBase-root': {
                                        color:colors.black[100],
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor:colors.primary[400],
                                        "&:hover": {
                                            borderColor:colors.primary[400]
                                        }
                                    },
                                }}
                            />
                            {/* <Button
                                // onClick={handleSaveRemarks}
                                className="mt-3"
                                variant="contained"
                                sx={{
                                    width:"130px",
                                    backgroundColor: colors.white[100],
                                    border:`1px solid ${colors.primary[400]}`,
                                    borderRadius:"0px 10px 0px 10px",
                                    color: colors.primary[400],
                                    cursor:"pointer",
                                    "&:hover": {
                                        backgroundColor: colors.primary[400],
                                        color: colors.white[100],
                                    },
                                }}
                            >
                                Add Remarks
                            </Button> */}
                        </FormControl>
                    )}
                    />
                </Box>
            </Box>
        </>
    )
}

export default CommonRemarks;