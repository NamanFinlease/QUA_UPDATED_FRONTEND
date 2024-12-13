import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Alert,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useAdminBankMutation } from "../Service/Query";

const AddBankDetails = () => {
    const [ifsc, setIfsc] = useState("");
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [accountHolder, setAccountHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [adminBank, { data, isError, isLoading, isSuccess, error: bankError }] =
        useAdminBankMutation();
    const [error, setError] = useState("");

    // Validate IFSC on each key press
    const handleIfscChange = (e) => {
        const input = e.target.value.toUpperCase(); // Convert input to uppercase

        let formattedInput = input;

        // Validation rules:
        if (/^[A-Z]{0,4}$/.test(input)) {
            // Allow up to 4 letters at the start
            setError("");
        } else if (/^[A-Z]{4}\d{0,7}$/.test(input)) {
            // After 4 letters, allow only up to 7 numbers
            setError("");
        } else {
            // If input does not match the format, prevent further input
            formattedInput = ifsc;
            setError("Format should be 4 letters followed by 7 digits.");
        }

        setIfsc(formattedInput);
    };

    // Fetch bank details using the Razorpay IFSC API
    const fetchBankDetails = async (ifscCode) => {
        try {
            const response = await axios.get(
                `https://ifsc.razorpay.com/${ifscCode}`
            );
            setBankName(response.data.BANK);
            setBranchName(response.data.BRANCH);
        } catch (error) {
            console.error("Failed to fetch bank details:", error);
            setBankName("");
            setBranchName("");
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        await adminBank({
            ifsc,
            bankName,
            branchName,
            accountHolder,
            accountNumber,
        });
    };

    // Call API once a valid IFSC code is entered
    useEffect(() => {
        if (ifsc.length === 11) {
            fetchBankDetails(ifsc);
        }
    }, [ifsc]);

    useEffect(() => {
        if ((isSuccess, data)) {
            Swal.fire({
                text: data?.message,
                icon: "success",
            });
        }
    }, [isSuccess, data]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                backgroundColor: "#f3f4f6", // Light gray background
                minHeight: "100vh",
            }}
        >
            <Card
                sx={{
                    maxWidth: 600,
                    width: "100%",
                    padding: "24px 32px",
                    borderRadius: "12px",
                    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    "&:hover": {
                        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                    },
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "700",
                            color: "#333", // Dark gray for the header
                            textAlign: "center",
                            marginBottom: "24px",
                            borderBottom: "3px solid #42a5f5",
                            paddingBottom: "6px",
                            letterSpacing: "0.5px",
                        }}
                    >
                        Add Bank Details
                    </Typography>

                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "16px",
                            }}
                        >
                            {[
                                {
                                    label: "IFSC",
                                    placeholder: "Enter IFSC Code",
                                    value: ifsc,
                                    onChange: handleIfscChange,
                                    error: Boolean(error),
                                    helperText: error,
                                    disabled: false,
                                    InputProps: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    sx={{
                                                        backgroundColor: "#9e9e9e", // Matches placeholder color
                                                        borderRadius: "50%",
                                                        padding: "4px",
                                                        color: "#fff", // Icon color if you want it to stand out on background
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    },
                                },
                                {
                                    label: "Bank Name",
                                    placeholder: "Enter Bank Name",
                                    value: bankName,
                                    onChange: (e) => setBankName(e.target.value),
                                    disabled: true,
                                },
                                {
                                    label: "Branch Name",
                                    placeholder: "Enter Branch Name",
                                    value: branchName,
                                    onChange: (e) => setBranchName(e.target.value),
                                    disabled: true,
                                },
                                {
                                    label: "Account Holder",
                                    placeholder: "Enter Account Holder Name",
                                    value: accountHolder,
                                    onChange: (e) => setAccountHolder(e.target.value),
                                    disabled: false,
                                },
                                {
                                    label: "Account Number",
                                    placeholder: "Enter Account Number",
                                    value: accountNumber,
                                    onChange: (e) => setAccountNumber(e.target.value),
                                    disabled: false,
                                },
                            ].map((field, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        flex: "1 1 calc(50% - 16px)", // 50% width with space
                                        padding: "8px",
                                        borderRadius: "8px",
                                        backgroundColor: "#f9f9f9",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                        "&:hover": {
                                            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "500",
                                            color: "#42a5f5",
                                            mb: 1,
                                        }}
                                    >
                                        {field.label}
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder={field.placeholder}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={field.error}
                                        helperText={field.helperText}
                                        fullWidth
                                        disabled={field.disabled} // Conditionally disable
                                        InputProps={field.InputProps || {}}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#fff",
                                                "& fieldset": {
                                                    borderColor: "#42a5f5",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#1e88e5",
                                                },
                                                "& input": {
                                                    color: "#000",
                                                    "&:disabled": {
                                                        color: "#000", // Ensure black font color when disabled
                                                        WebkitTextFillColor: "#000", // Override text fill color
                                                    },
                                                }, // Set input text color to black
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ textAlign: "center", mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                sx={{
                                    fontWeight: "600",
                                    textTransform: "none",
                                    padding: "8px 20px",
                                    borderRadius: "10px",
                                    backgroundColor: "#42a5f5",
                                    boxShadow:
                                        "0px 4px 10px rgba(66, 165, 245, 0.3)",
                                    "&:hover": {
                                        backgroundColor: "#1e88e5",
                                    },
                                }}
                            >
                                {isLoading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                                
                            </Button>
                        </Box>
                    </CardContent>
                </form>
            </Card>
            {isError &&
                <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                    {bankError?.data?.message}
                </Alert>
            }
        </Box>

    );
};

export default AddBankDetails;
