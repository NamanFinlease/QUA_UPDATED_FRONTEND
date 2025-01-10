import React, { useEffect, useState } from "react";
import { Button, Box, Typography, TextField, Alert } from "@mui/material";
import useStore from "../../Store";
import { formatDate } from "../../utils/helper";
import useAuthStore from "../store/authStore";
import { SignalCellularNullRounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useRecommendLoanMutation } from "../../Service/applicationQueries";

const DisbursalLoanInfo = ({ disburse }) => {
    const { applicationProfile } = useStore();
    const { activeRole } = useAuthStore();
    const [remarks, setRemarks] = useState(null);
    const [openRemark, setOpenRemark] = useState(false);
    const navigate = useNavigate();

    console.log("profile", applicationProfile);

    const {
        sanction,
        sanction: {
            application,
            application: { cam, lead, lead: { fName, mName, lName } = {} } = {},
        } = {},
    } = applicationProfile || {};

    const [recommendLoan, { data, isSuccess, isError, error }] =
        useRecommendLoanMutation();

    const handleCancel = () => {
        // Reset all states to go back to initial state
        setRemarks("");
        setOpenRemark(false);
    };

    const handleSubmit = () => {
        if (!remarks) {
            Swal.fire({
                text: "Add some remarks!",
                icon: "warning",
            });
            return;
        }
        recommendLoan({ id: applicationProfile._id, remarks });
    };

    console.log("sanction", sanction.approvedBy);

  const info = [
    { label: "Loan No.", value: applicationProfile?.loanNo },
    { label: "Customer Name", value: `${fName}${mName ? ` ${mName}` : ``} ${lName}` },
    { label: "Processed By", value: `${application?.creditManagerId?.fName}${application?.creditManagerId?.mName ? ` ${application?.creditManagerId?.mName}` : ``} ${application?.creditManagerId?.lName}` },
    { label: "Processed On", value: "-" },
    { label: "Sanctioned By", value: `${sanction?.approvedBy?.fName}${sanction?.approvedBy?.mName ? ` ${sanction?.approvedBy?.mName}` : ``} ${sanction?.approvedBy?.lName}` },
    { label: "Sanctioned On", value: sanction?.sanctionDate && formatDate(sanction?.sanctionDate) },
    { label: "Loan Approved (Rs.)", value: cam?.details?.loanRecommended },
    { label: "ROI % (p.d.) Approved", value: cam?.details?.roi },
    { label: "Processing Fee", value: cam?.details?.netAdminFeeAmount },
    { label: "Tenure", value: cam?.details?.eligibleTenure },
    { label: "Sanctioned Email Sent On", value:sanction?.sanctionDate && formatDate(sanction?.sanctionDate) },
    { label: "Sanctioned Email Sent To", value: lead?.personalEmail },
    { label: "Sanctioned Email Response Status", value: "ACCEPTED" },
    { label: "Acceptance Email", value: lead?.personalEmail },
    ...(applicationProfile.isDisbursed ? [
      { label: "Disbursed From", value: applicationProfile?.payableAccount },
      { label: "Disbursed On", value: applicationProfile?.disbursedBy && formatDate(applicationProfile?.disbursedAt) },
      { label: "Disbursed By", value: `${applicationProfile?.disbursedBy?.fName}${applicationProfile?.disbursedBy?.mName ? ` ${applicationProfile?.disbursedBy?.mName}` : ``} ${applicationProfile?.disbursedBy?.lName}` },
      { label: "Disbursed Amount", value: applicationProfile?.amount },
    ] : [])
  ];

    useEffect(() => {
        if (isSuccess && data) {
            Swal.fire({
                text: "Loan disbursement approved!",
                icon: "success",
            });
            navigate("/disbursal-process");
        }
    }, [isSuccess, data]);
    return (
        <>
            <Box
                sx={{
                    maxWidth: "1200px",
                    margin: "10px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr", // Two columns
                        gap: "0",
                        borderCollapse: "collapse",
                    }}
                >
                    {/* Map over the data array to create each field in a row */}
                    {info.map((field, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid #ccc",
                                padding: "10px",
                            }}
                        >
                            <label style={{ fontWeight: "bold", width: "50%" }}>
                                {field.label}
                            </label>
                            <span>
                                {field.value}{" "}
                                {field.label === "ROI % (p.d.) Approved" && "%"}
                            </span>
                        </Box>
                    ))}
                </Box>
            </Box>
            {openRemark && (
                <>
                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 4,
                            backgroundColor: "#f9f9f9", // Light background for the entire form
                            borderRadius: 2,
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Remarks
                        </Typography>
                        <TextField
                            label="Add your remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{
                                marginBottom: 3,
                                color: "#363535", // Ensure text is black or dark
                                backgroundColor: "#ebebeb", // Light background for text area
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#c4c4c4",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#1976d2",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                        />
                    </Box>
                    {isError && (
                        <Alert severity="error" style={{ marginTop: "10px" }}>
                            {error?.data?.message}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            marginTop: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancel}
                            sx={{
                                padding: "10px 20px",
                                borderRadius: 2,
                                fontWeight: "bold",
                                backgroundColor: "#f5f5f5",
                                ":hover": { backgroundColor: "#e0e0e0" },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                padding: "10px 20px",
                                borderRadius: 2,
                                fontWeight: "bold",
                                backgroundColor: "#1976d2",
                                ":hover": { backgroundColor: "#1565c0" },
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
};

export default DisbursalLoanInfo;
