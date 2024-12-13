import React, { useEffect, useState } from "react";
import {
    Button,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateCollectionMutation } from "../../Service/LMSQueries";
import { useParams } from "react-router-dom";
const requestStatus = [
    { value: "closed", label: "Close" },
    { value: "partialPaid", label: "Partial Payment" },
    { value: "settled", label: "Settlement" },
    { value: "writeOff", label: "Write Off" },
];
const RepaymentForm = ({ disburse }) => {
    const { id } = useParams();
    const [selectedOption, setSelectedOption] = useState("");
    const { disbursalDate } =
        disburse?.sanction?.application?.cam?.details || {};
    const [updateCollection, { data, isSuccess, isLoading, isError, error }] =
        useUpdateCollectionMutation();

    const defaultValues = {
        amount: "",
        date: null,
        utr: "",
    };

    const { handleSubmit, control, reset } = useForm({
        defaultValues,
    });

    const onSubmit = (data) => {
        let updatedData;
        if (selectedOption === "partialPaid") {
            updatedData = {
                partialPaid: { ...data, requestedStatus: selectedOption },
            };
        } else {
            updatedData = {
                ...data,
                requestedStatus: selectedOption,
            };
        }
        updateCollection({ loanNo: id, data: updatedData });
        console.log("data", updatedData);
    };

    useEffect(() => {
        if (isSuccess && data) {
            Swal.fire({
                text: "Closing request sent!",
                icon: "success",
            });
            setSelectedOption("");
            reset();
        }
    }, [isSuccess, data]);

    return (
        <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#949494",
                fontSize: "12px",
                lineHeight: "1.5",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginTop: "10px",
            }}
        >
            {/* Radio Button Group */}
            <FormLabel component="legend" sx={{ marginBottom: "16px" }}>
                Select Option
            </FormLabel>
            <RadioGroup
                row
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
            >
                {requestStatus.map((status) => (
                    <FormControlLabel
                        value={status.value}
                        control={<Radio />}
                        label={status.label}
                    />
                ))}
            </RadioGroup>

            {/* Conditionally Render Inputs */}
            {selectedOption && (
                <>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "16px",
                            marginTop: "16px",
                        }}
                    >
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Received Amount"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={!!fieldState?.error}
                                    helperText={
                                        fieldState?.error
                                            ? fieldState?.error?.message
                                            : ""
                                    }
                                    inputProps={{
                                        placeholder: "Received Amount",
                                    }}
                                    sx={{
                                        // backgroundColor: '#f5f5f5',
                                        borderRadius: "8px",
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "#363535",
                                        },
                                    }}
                                />
                            )}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        format="DD/MM/YYYY"
                                        label="Payment Date"
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                        <Controller
                            name="utr"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="UTR"
                                    variant="outlined"
                                    fullWidth
                                    error={!!fieldState?.error}
                                    helperText={
                                        fieldState?.error
                                            ? fieldState?.error?.message
                                            : ""
                                    }
                                    inputProps={{
                                        placeholder: "Enter UTR here",
                                    }}
                                    sx={{
                                        // backgroundColor: '#f5f5f5',
                                        borderRadius: "8px",
                                    }}
                                />
                            )}
                        />
                    </Box>
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            marginTop: "20px",
                            width: "100%",
                        }}
                    >
                        Submit
                    </Button>
                </>
            )}
        </Box>
    );
};

export default RepaymentForm;
